from google.cloud import storage
import os

# Set the path to your service account key JSON file
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\jerry\school\C09\keys\unirentals-33aa49b63a3e.json"

# Initialize the Cloud Storage client
storage_client = storage.Client()

# Define your GCS bucket name
bucket_name = "unirentals-images"

# The name of the file you want to upload and its local path
local_file_path = 'dog.jpg'
destination_blob_name = 'images/image.jpg'  # The path in the bucket

def upload_image():
    """Uploads an image to Google Cloud Storage."""
    # Get the GCS bucket object
    bucket = storage_client.bucket(bucket_name)

    # Create a blob object for the file to be uploaded
    blob = bucket.blob(destination_blob_name)

    # Upload the file to the bucket
    blob.upload_from_filename(local_file_path)

    # Print the public URL of the uploaded file
    print(f"File uploaded to: gs://{bucket_name}/{destination_blob_name}")
    print(f"Access the file at: https://storage.googleapis.com/{bucket_name}/{destination_blob_name}")

if __name__ == "__main__":
    upload_image()