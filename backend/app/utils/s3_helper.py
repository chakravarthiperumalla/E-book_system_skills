import os
import time
from jose import jwt
from app.utils.auth_helper import SECRET_KEY, ALGORITHM

# Local directories for book media assets
STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "storage")
BOOKS_DIR = os.path.join(STORAGE_DIR, "books")
PREVIEWS_DIR = os.path.join(STORAGE_DIR, "previews")
COVERS_DIR = os.path.join(STORAGE_DIR, "covers")

# Ensure storage directories exist
os.makedirs(BOOKS_DIR, exist_ok=True)
os.makedirs(PREVIEWS_DIR, exist_ok=True)
os.makedirs(COVERS_DIR, exist_ok=True)

def generate_signed_download_url(book_id: int, user_id: int, base_url: str) -> str:
    """
    Generates a secure, cryptographically signed expiring link.
    In a full production environment, this would call AWS S3 Boto3 client to generate a presigned URL.
    To make it run locally out-of-the-box and on serverless platforms, this generates a token
    pointing back to our secure local streaming endpoint (/api/library/stream/{token}).
    """
    # Expiration set for 15 minutes
    expiration = int(time.time()) + 900
    
    payload = {
        "book_id": book_id,
        "user_id": user_id,
        "exp": expiration
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    # Strip trailing slash from base url if present
    if base_url.endswith("/"):
        base_url = base_url[:-1]
        
    return f"{base_url}/api/library/stream/{token}"
