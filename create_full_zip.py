import os
import zipfile
import time

def create_package():
    start_time = time.time()
    workspace = os.path.dirname(os.path.abspath(__file__))
    output_zip = os.path.join(workspace, "BhashaSetu_Full_Package.zip")
    
    if os.path.exists(output_zip):
        os.remove(output_zip)
        
    print(f"Creating {output_zip}...")
    
    # Items to include in the package root
    includes = [
        "server.py",
        "requirements.txt",
        "run_app.bat",
        "HOW_TO_RUN.txt",
        "package.json",
        ".gitignore",
        "Hindi_Mundari_MT5",
        "BhashaSetu",
    ]
    
    # Exclude patterns
    exclude_dirs = {"node_modules", "__pycache__", ".git", ".system_generated"}
    exclude_extensions = {".zip", ".pyc"}
    
    total_files = 0
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=1) as zf:
        for item in includes:
            full_item = os.path.join(workspace, item)
            if not os.path.exists(full_item):
                continue
                
            if os.path.isfile(full_item):
                zf.write(full_item, arcname=item)
                total_files += 1
                print(f"Added file: {item}")
            elif os.path.isdir(full_item):
                for root, dirs, files in os.walk(full_item):
                    # Filter out excluded directories in-place
                    dirs[:] = [d for d in dirs if d not in exclude_dirs]
                    
                    for f in files:
                        ext = os.path.splitext(f)[1].lower()
                        if ext in exclude_extensions:
                            continue
                        
                        file_path = os.path.join(root, f)
                        rel_path = os.path.relpath(file_path, workspace)
                        
                        # Store safetensors without heavy compression for speed
                        if f.endswith(".safetensors"):
                            zf.write(file_path, arcname=rel_path, compress_type=zipfile.ZIP_STORED)
                        else:
                            zf.write(file_path, arcname=rel_path, compress_type=zipfile.ZIP_DEFLATED)
                            
                        total_files += 1
                        if total_files % 15 == 0:
                            print(f"Archived {total_files} files... (latest: {rel_path})")
                            
    elapsed = time.time() - start_time
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print("\n" + "="*50)
    print(f"Package created successfully in {elapsed:.1f} seconds!")
    print(f"Total files: {total_files}")
    print(f"Archive size: {size_mb:.1f} MB")
    print(f"Output path: {output_zip}")
    print("="*50)

if __name__ == "__main__":
    create_package()
