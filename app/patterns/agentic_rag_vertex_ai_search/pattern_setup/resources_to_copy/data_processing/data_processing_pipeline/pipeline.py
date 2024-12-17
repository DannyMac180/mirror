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

from kfp import dsl
from data_processing_pipeline.components import process_data, ingest_data_in_datastore


@dsl.pipeline(description="A pipeline to run ingestion of new data into the datastore")
def pipeline(
    project_id: str,
    region_vertex_ai_search: str,
    data_store_id: str,
    embedding_model: str = "text-embedding-004",
    file_url: str = "https://services.google.com/fh/files/misc/practitioners_guide_to_mlops_whitepaper.pdf",
    file_type: str = "pdf",
) -> None:
    """Processes a document and ingests it into Vertex AI Search datastore."""

    # Process the document and generate embeddings
    processed_data = process_data(
        embedding_model=embedding_model, 
        file_url=file_url,
        file_type=file_type
    )

    # Ingest the processed data into Vertex AI Search datastore
    ingest_data_in_datastore(
        project_id=project_id,
        region_vertex_ai_search=region_vertex_ai_search,
        input_files=processed_data.output,
        data_store_id=data_store_id,
    )
