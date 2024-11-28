import os

credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
try:
    with open(credentials_path) as f:
        print("Service account file is accessible.")
except Exception as e:
    print(f"Error accessing file: {e}")