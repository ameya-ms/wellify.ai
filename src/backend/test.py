import boto3

# Check if credentials are loaded
session = boto3.Session()
credentials = session.get_credentials()
print("AWS Access Key:", credentials.access_key)
print("AWS Secret Key:", credentials.secret_key)
print("AWS Session Token:", credentials.token)  # might be None

# Test Bedrock client
bedrock = boto3.client("bedrock-runtime", region_name="us-west-2")
print("Bedrock client created successfully!")
