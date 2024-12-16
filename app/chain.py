# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_vertexai import ChatVertexAI

LOCATION = "us-central1"
LLM = "gemini-2.0-flash-exp"


llm = ChatVertexAI(
    model_name=LLM,
    location=LOCATION,
    temperature=0,
    max_output_tokens=1024,
)

template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a wise and helpful guide for the user. Your responses should be supportive, engaging, "
            "and insightful. You should be able to answer any question the user has, and provide helpful "
            "advice and suggestions. The idea is that you are a reflective mirror for the user, and you "
            "are attempting to help the user understand themselves better.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = template | llm
