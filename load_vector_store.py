import weaviate
import weaviate.classes as wvc
from langchain.document_loaders import ObsidianLoader
import os
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()

try:
    # Connect to Weaviate cloud
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=os.getenv("WEAVIATE_CLUSTER_URL"),
        auth_credentials=weaviate.auth.AuthApiKey(os.getenv("WEAVIATE_API_KEY")),
        headers={
            "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
        }
    )

    # Check if the collection already exists
    if not client.collections.exists("ObsidianNotes"):
        # Create a collection using OpenAI embedding and generative models
        client.collections.create(
            name="ObsidianNotes",
            description="Collection for Obsidian notes",
            vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_openai(),
            generative_config=wvc.config.Configure.Generative.openai(),
        )
        print("Collection 'ObsidianNotes' created successfully.")
    else:
        print("Collection 'ObsidianNotes' already exists.")

    # Load documents from ObsidianLoader
    loader = ObsidianLoader(os.getenv("OBSIDIAN_PATH"))
    docs = loader.load()
    print(f"Total documents loaded: {len(docs)}")

    # Add this function to chunk the content
    def chunk_content(content, max_chunk_size=1000, chunk_overlap=200):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=max_chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len
        )
        return text_splitter.split_text(content)

    # Prepare objects for insertion
    objects_to_insert = []
    for doc in docs:
        chunks = chunk_content(doc.page_content)
        for i, chunk in enumerate(chunks):
            obj = {
                "title": f"{doc.metadata.get('source', '')} - Chunk {i+1}",
                "content": chunk,
                "metadata": {
                    "source": doc.metadata.get("source", ""),
                    "file_path": doc.metadata.get("path", ""),
                    "created_at": doc.metadata.get("created", ""),
                    "last_accessed": doc.metadata.get("last_accessed", ""),
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                }
            }
            objects_to_insert.append(obj)

    # Insert documents using insert_many with error handling
    obsidian_notes = client.collections.get("ObsidianNotes")
    
    batch_size = 100  # Adjust based on your needs
    for i in range(0, len(objects_to_insert), batch_size):
        batch = objects_to_insert[i:i+batch_size]
        try:
            result = obsidian_notes.data.insert_many(batch)
            successful_inserts = len(batch)  # Assume all inserts were successful
            print(f"Inserted batch {i//batch_size + 1} with {successful_inserts} documents successfully.")
        except weaviate.exceptions.WeaviateBaseError as e:
            print(f"Error inserting batch {i//batch_size + 1}: {str(e)}")
            # Optionally, you can implement retry logic here

    # Verify the total number of objects inserted
    total_count = obsidian_notes.aggregate.over_all(total_count=True).total_count
    print(f"Total documents in collection: {total_count}")

except weaviate.exceptions.WeaviateBaseError as e:
    print(f"An error occurred: {str(e)}")

finally:
    if 'client' in locals():
        client.close()
        print("Weaviate client connection closed.")

print("Script execution completed.")