import os
import sys
from huggingface_hub import HfApi

def deploy(token: str, space_name: str = "bhashasetu"):
    api = HfApi(token=token)
    user_info = api.whoami()
    username = user_info["name"]
    repo_id = f"{username}/{space_name}"
    
    print(f"Logged in as: {username}")
    print(f"Creating Hugging Face Space: {repo_id}...")
    
    try:
        api.create_repo(
            repo_id=repo_id,
            repo_type="space",
            space_sdk="docker",
            private=False,
            exist_ok=True
        )
        print("Space repository ready!")
    except Exception as e:
        print(f"Notice during repo creation: {e}")

    workspace = os.path.dirname(os.path.abspath(__file__))
    print("Uploading project files to Hugging Face...")
    
    # Upload essential files
    files_to_upload = [
        ("Dockerfile", "Dockerfile"),
        ("requirements.txt", "requirements.txt"),
        ("server.py", "server.py"),
    ]
    
    for local_file, repo_path in files_to_upload:
        full_path = os.path.join(workspace, local_file)
        if os.path.exists(full_path):
            print(f"Uploading {local_file}...")
            api.upload_file(
                path_or_fileobj=full_path,
                path_in_repo=repo_path,
                repo_id=repo_id,
                repo_type="space"
            )
            
    # Upload frontend dist
    dist_dir = os.path.join(workspace, "BhashaSetu", "dist")
    if os.path.exists(dist_dir):
        print("Uploading built frontend...")
        api.upload_folder(
            folder_path=dist_dir,
            path_in_repo="dist",
            repo_id=repo_id,
            repo_type="space"
        )
        
    # Upload model folder
    model_dir = os.path.join(workspace, "Hindi_Mundari_MT5")
    if os.path.exists(model_dir):
        print("Uploading mT5 model weights (~1.2 GB, this may take a few minutes)...")
        api.upload_folder(
            folder_path=model_dir,
            path_in_repo="Hindi_Mundari_MT5",
            repo_id=repo_id,
            repo_type="space"
        )
        
    url = f"https://huggingface.co/spaces/{repo_id}"
    direct_app_url = f"https://{username}-{space_name}.hf.space"
    print("\n" + "="*50)
    print("SUCCESSFULLY DEPLOYED TO HUGGING FACE SPACES!")
    print(f"Space URL: {url}")
    print(f"Direct App URL: {direct_app_url}")
    print("="*50)
    return url, direct_app_url

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python deploy_hf.py <HF_TOKEN>")
        sys.exit(1)
    deploy(sys.argv[1])
