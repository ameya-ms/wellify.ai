from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local testing, make this specific later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS Bedrock runtime client
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-west-2",  # Change to your Bedrock region if needed
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    body = {
        "modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
        "contentType": "application/json",
        "accept": "application/json",
        "body": json.dumps({
            "messages": [
                {"role": "user", "content": user_input}
            ]
        }),
    }

    response = bedrock.invoke_model(**body)
    result = json.loads(response["body"].read())

    # Extract Bedrock model output (depends on model)
    ai_output = result["content"][0]["text"]

    return {"reply": ai_output}
