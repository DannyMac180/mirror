import os
from pathlib import Path

def create_code_snapshot(
    directories=["app", "streamlit"],
    output_file="full_code_snapshot.txt",
    include_file_extensions=(".py", ".md", ".txt", ".yaml", ".yml", ".toml", ".json", ".css", ".js", ".html")
):
    """
    Recursively collects all code files from the specified directories and concatenates them into a single file.

    Args:
        directories (list): A list of directories to scan recursively.
        output_file (str): The path to the output file containing the concatenated code.
        include_file_extensions (tuple): A tuple of file extensions to include.
        
    Returns:
        str: The path to the generated code snapshot file.
    """

    # Resolve directories relative to current working directory
    resolved_dirs = [Path(d).resolve() for d in directories]

    # Prepare output file
    output_path = Path(output_file).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as out_f:
        for directory in resolved_dirs:
            if not directory.exists():
                print(f"Warning: Directory {directory} does not exist, skipping.")
                continue
            
            # Walk through the directory structure
            for root, dirs, files in os.walk(directory):
                # Sort files for consistency (optional)
                files.sort()

                for file_name in files:
                    file_path = Path(root) / file_name
                    # Check file extension and exclude hidden/system files
                    if file_path.suffix.lower() in include_file_extensions and not file_path.name.startswith('.'):
                        # Write a header to indicate the start of this file's content
                        out_f.write(f"\n\n# ======= File: {file_path.relative_to(directory.parent)} =======\n\n")

                        # Read and append file content
                        try:
                            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                                content = f.read()
                            out_f.write(content)
                        except Exception as e:
                            print(f"Error reading {file_path}: {e}")
                            continue
    
    print(f"Code snapshot created at: {output_path}")
    return str(output_path)

# Example usage:
# Create or refresh the snapshot file:
snapshot_path = create_code_snapshot()