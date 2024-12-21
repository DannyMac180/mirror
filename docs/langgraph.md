# LangGraph Agent Design Guide

You are tasked with designing a LangGraph agent. Follow these principles and patterns to create a reliable, controllable agent with proper state management and human oversight capabilities.

## Core Design Principles

1. CONTROLLABILITY
- Express the application flow as nodes (processing steps) and edges (transitions)
- Each node should have clear, single responsibility
- Use conditional logic in edges to control flow between nodes
- Maintain explicit state management through a common memory system
- Design clear entry and exit points for each processing stage

Example:
```python
from langgraph.graph import StateGraph
from typing import Annotated, TypeVar

# Define state type
State = TypeVar("State")

# Create graph with state
graph = StateGraph(State)

# Add nodes
graph.add_node("start", start_node)
graph.add_node("process", process_node)
graph.add_node("end", end_node)

# Add edges with conditional logic
graph.add_edge("start", "process")
graph.add_edge("process", conditional_edge)
```

2. STATE MANAGEMENT
- Define explicit state schemas using Pydantic models
- Implement persistence layers for maintaining state across runs
- Use appropriate memory patterns (short-term vs long-term storage)
- Consider state sharing between parallel executions
- Implement proper state cleanup and management

Example:
```python
from pydantic import BaseModel
from typing import List, Optional

class AgentState(BaseModel):
    messages: List[str] = []
    current_step: str = "start"
    memory: dict = {}
    
    # Add persistence
    def checkpoint(self):
        return {
            "messages": self.messages,
            "current_step": self.current_step,
            "memory": self.memory
        }
    
    @classmethod
    def from_checkpoint(cls, checkpoint):
        return cls(**checkpoint)
```

3. HUMAN-IN-THE-LOOP INTEGRATION
- Add strategic breakpoints for human review
- Enable state inspection and modification capabilities
- Implement approval workflows for critical decisions
- Design clear interfaces for human intervention
- Allow for state rollback and correction

Example:
```python
def process_with_human_review(state):
    # Add breakpoint for review
    if needs_review(state):
        return {
            "type": "human_review",
            "state": state.checkpoint(),
            "options": ["approve", "modify", "reject"]
        }
    
    # Continue processing
    return process_next_step(state)

# Add human review node
graph.add_node("human_review", process_with_human_review)
```

4. RELIABILITY PATTERNS
- Implement proper error handling and recovery
- Add logging and monitoring touchpoints
- Use recursion limits to prevent infinite loops
- Design fallback behaviors for failure cases
- Implement proper validation at state transitions

Example:
```python
def safe_process_node(state):
    try:
        # Add recursion limit
        if state.steps_taken > MAX_STEPS:
            return end_execution(state)
            
        # Process with validation
        result = process_step(state)
        if not validate_result(result):
            return fallback_behavior(state)
            
        return result
        
    except Exception as e:
        logger.error(f"Error in processing: {e}")
        return error_recovery(state)
```

## Implementation Requirements

1. STATE DEFINITION
```python
from typing import Dict, List, Union
from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class AgentConfig(BaseModel):
    model_name: str = "gpt-4"
    temperature: float = 0.7
    max_steps: int = 10

class AgentState(BaseModel):
    messages: List[Message]
    memory: Dict[str, Union[str, int, float]]
    config: AgentConfig
```

2. NODE DESIGN
```python
async def process_node(state: AgentState) -> AgentState:
    # Single responsibility: Process messages
    response = await llm.generate(state.messages)
    
    # Validate output
    if not is_valid_response(response):
        raise ValueError("Invalid LLM response")
        
    # Update state
    state.messages.append(Message(role="assistant", content=response))
    return state
```

3. EDGE LOGIC
```python
def conditional_edge(state: AgentState) -> str:
    if state.memory.get("task_complete"):
        return "end"
    elif needs_human_review(state):
        return "human_review"
    else:
        return "process"
```

4. TOOLS AND ACTIONS
```python
from typing import Protocol

class Tool(Protocol):
    name: str
    description: str
    
    async def execute(self, input: str) -> str:
        ...

class Calculator(Tool):
    name = "calculator"
    description = "Perform mathematical calculations"
    
    async def execute(self, input: str) -> str:
        try:
            return str(eval(input))
        except Exception as e:
            return f"Error: {str(e)}"
```

## Best Practices

1. MODULARITY
```python
# Create reusable subgraph
def create_processing_subgraph(config: AgentConfig) -> StateGraph:
    subgraph = StateGraph(AgentState)
    subgraph.add_node("process", process_node)
    subgraph.add_node("validate", validate_node)
    subgraph.add_edge("process", "validate")
    return subgraph

# Use in main graph
main_graph = StateGraph(AgentState)
main_graph.add_subgraph("processing", create_processing_subgraph(config))
```

2. OBSERVABILITY
```python
import logging

def create_monitored_node(func):
    async def wrapper(state: AgentState) -> AgentState:
        logging.info(f"Starting node: {func.__name__}")
        try:
            result = await func(state)
            logging.info(f"Node {func.__name__} completed successfully")
            return result
        except Exception as e:
            logging.error(f"Error in node {func.__name__}: {e}")
            raise
    return wrapper
```

3. SECURITY
```python
from typing import Optional

class SecureState(AgentState):
    user_id: str
    access_token: Optional[str] = None
    
    def validate_access(self, required_role: str) -> bool:
        return check_user_permission(self.user_id, required_role)

@requires_permission("admin")
async def sensitive_operation(state: SecureState) -> SecureState:
    # Perform operation
    return state
```

4. PERFORMANCE
```python
from concurrent.futures import ThreadPoolExecutor

async def parallel_processing_node(state: AgentState) -> AgentState:
    with ThreadPoolExecutor() as executor:
        # Run multiple operations in parallel
        futures = [
            executor.submit(process_chunk, chunk)
            for chunk in state.get_data_chunks()
        ]
        results = [f.result() for f in futures]
        
    state.update_with_results(results)
    return state
```

Remember to prioritize reliability and controllability while maintaining flexibility for human oversight and intervention. Your implementation should balance these concerns while meeting the specific requirements of your use case.

