import os
from typing import Any, Dict, List, Union, Optional

import google.auth
import vertexai
from langchain_core.messages import AIMessage
from langchain_core.messages import (
    BaseMessage, HumanMessage, AIMessage, SystemMessage
)
from pydantic import BaseModel
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_vertexai import ChatVertexAI
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

class MirrorAgentState(BaseModel):
    messages: List[Union[SystemMessage, HumanMessage, AIMessage]] = []
    memory: Dict[str, Any] = {}

@tool
def retrieve_user_docs(query: str) -> str:
    """Retrieve relevant user documents based on the query.
    
    Args:
        query: The search query to find relevant documents.
        
    Returns:
        str: The retrieved document content or search results.
    """
    return f"Retrieved docs for query: {query}"

@tool
def reflect_on_recent_interactions(context: str) -> str:
    """Analyze and reflect on recent user interactions to provide insights.
    
    Args:
        context: The context or topic to reflect upon.
        
    Returns:
        str: Reflective insights based on the context.
    """
    return f"Reflecting on: {context}"

credentials, project_id = google.auth.default()
vertexai.init(project=project_id)

# Initialize with system message
system_message = SystemMessage(content=(
    "You are a wise and helpful mirror agent. You use a Socratic style, "
    "helping the user to know themselves better."
))

mirror_system_prompt = ChatPromptTemplate.from_messages(
    [
        system_message,
        MessagesPlaceholder(variable_name="chat_history"),
    ]
)

mirror_llm = ChatVertexAI(
    model_name="gemini-2.0-flash-exp",
    location="us-central1",
    temperature=0.7,
    max_output_tokens=4096,
    streaming=True,
)

mirror_agent = mirror_system_prompt | mirror_llm.bind_tools(
    [retrieve_user_docs, reflect_on_recent_interactions],
    tool_choice="any"
)

def mirror_agent_node(state: MirrorAgentState, config: RunnableConfig) -> Dict[str, Any]:
    """Process the current state and generate a response."""
    # Convert any BaseMessage items (if they slipped in) to recognized roles.
    chat_history = []
    for msg in state.messages:
        if isinstance(msg, (SystemMessage, HumanMessage, AIMessage)):
            if isinstance(msg, HumanMessage) and hasattr(msg, "additional_kwargs"):
                # Remove leftover tool_calls from an otherwise valid HumanMessage
                msg.additional_kwargs.pop("tool_calls", None)
            chat_history.append(msg)
        else:
            # If it's a user (HumanMessage) but has leftover tool_calls,
            # remove them so langchain_core doesn't crash on 'get' attribute.
            if isinstance(msg, HumanMessage) and hasattr(msg, "additional_kwargs"):
                msg.additional_kwargs.pop("tool_calls", None)

            # Fallback: treat unknown message type as user input
            chat_history.append(HumanMessage(content=str(msg.content)))

    response_or_responses = mirror_agent.invoke({"chat_history": chat_history}, config)

    # Sometimes the agent returns a single message, sometimes a list.
    # Append to our conversation properly.
    if isinstance(response_or_responses, BaseMessage):
        state.messages.append(response_or_responses)
    elif isinstance(response_or_responses, list):
        for r in response_or_responses:
            if isinstance(r, BaseMessage):
                state.messages.append(r)
            else:
                # Fallback if a tool returns a raw string or something else
                state.messages.append(AIMessage(content=str(r)))

    return {"messages": state.messages}

mirror_workflow = StateGraph(MirrorAgentState)
mirror_workflow.add_node("mirror_agent", mirror_agent_node)
mirror_workflow.add_node("tools", ToolNode(tools=[retrieve_user_docs, reflect_on_recent_interactions]))
mirror_workflow.set_entry_point("mirror_agent")

def should_call_tools(state: MirrorAgentState) -> bool:
    """Check if we should call tools based on the last message."""
    if not state.messages:
        return False
    
    last_msg = state.messages[-1]
    if not isinstance(last_msg, AIMessage):
        return False
        
    # Safely check for tool_calls
    tool_calls = getattr(last_msg, "additional_kwargs", {}).get("tool_calls", [])
    return bool(tool_calls)

# Add edges with proper tool call handling
mirror_workflow.add_conditional_edges(
    "mirror_agent",
    lambda x: "tools" if should_call_tools(x) else END
)

# After tools, return to the agent for another round
mirror_workflow.add_edge("tools", "mirror_agent")

chain = mirror_workflow.compile()