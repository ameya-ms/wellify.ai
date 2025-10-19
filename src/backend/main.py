# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# import boto3
# import json
# import os

# app = FastAPI()

# # Allow frontend requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # restrict later in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# bedrock = None

# # Attempt to create Bedrock client and log issues
# try:
#     print("Attempting to create Bedrock client...")
#     bedrock = boto3.client(
#         service_name="bedrock-runtime",
#         region_name="us-west-2"  # ensure this is a supported Bedrock region
#     )
#     print("Bedrock client created successfully!")
# except Exception as e:
#     print("Failed to create Bedrock client:", e)

# @app.post("/chat")
# async def chat(request: Request):
#     data = await request.json()
#     user_input = data.get("message", "")

#     if bedrock:
#         print("Calling Bedrock with user input:", user_input)
#         body = json.dumps({
#             "messages": [{"role": "user", "content": user_input}]
#         })
#         try:
#             response = bedrock.invoke_model(
#                 modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
#                 #modelId="anthropic.claude-3-sonnet-20240229-v1:0",
#                 contentType="application/json",
#                 accept="application/json",
#                 body=body
#             )
#             result = json.loads(response["body"].read())
#             ai_output = result["content"][0]["text"]
#             print("Bedrock response:", ai_output)
#         except Exception as e:
#             print("Error calling Bedrock:", e)
#             ai_output = "Sorry, I couldn't get a response from Bedrock."
#     else:
#         print("Bedrock client not initialized. Returning mock response.")
#         ai_output = f"Echo: {user_input}"

#     return {"reply": ai_output}





from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json
import os
import pandas as pd
from pydantic import BaseModel
import joblib
import numpy as np
import uvicorn

app = FastAPI()

model = joblib.load("models/doctor_routing_model.pkl")
encoder = joblib.load("models/label_encoder.pkl")

class PatientInput(BaseModel):
    age: int
    gender: int
    symptom_code: str
    urgency: int
    time_of_day: int
    wait_load_A: float
    wait_load_B: float
    wait_load_C: float
    specialty_match_A: int
    specialty_match_B: int
    specialty_match_C: int


# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict_center(data: PatientInput):
    # Create a DataFrame so XGBoost can match column names correctly
    input_df = pd.DataFrame([{
        "age": data.age,
        "gender": data.gender,
        "symptom_code": data.symptom_code,   # keep as string
        "urgency": data.urgency,
        "time_of_day": data.time_of_day,
        "wait_load_A": data.wait_load_A,
        "wait_load_B": data.wait_load_B,
        "wait_load_C": data.wait_load_C,
        "specialty_match_A": data.specialty_match_A,
        "specialty_match_B": data.specialty_match_B,
        "specialty_match_C": data.specialty_match_C
    }])

    # Make prediction
    input_df["symptom_code"] = input_df["symptom_code"].astype("category")
    probs = model.predict_proba(input_df)[0]
    pred_idx = np.argmax(probs)
    pred_center = encoder.classes_[pred_idx]

    return {
        "predicted_center": pred_center,
        "probabilities": probs.tolist()
    }


# -----------------------------
# Optional home route
# -----------------------------
@app.get("/")
def home():
    return {"message": "Wellify.ai backend is running 🚀"}


# -----------------------------
# Run app
# -----------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bedrock = None

# Attempt to create Bedrock client and log issues
try:
    print("Attempting to create Bedrock client...")
    bedrock = boto3.client(
        service_name="bedrock-runtime",
        region_name="us-west-2"  # ensure this is a supported Bedrock region
    )
    print("Bedrock client created successfully!")
except Exception as e:
    print("Failed to create Bedrock client:", e)


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")
    
    if bedrock:
        print("Calling Bedrock with user input:", user_input)
        
        # ✅ Correct format with all required parameters
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": user_input}]
        })
        
        try:
            response = bedrock.invoke_model(
                modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
                contentType="application/json",
                accept="application/json",
                body=body
            )
            
            result = json.loads(response["body"].read())
            ai_output = result["content"][0]["text"]
            print("Bedrock response:", ai_output)
            
        except Exception as e:
            print("Error calling Bedrock:", e)
            ai_output = f"Bedrock Error: {str(e)}"
    else:
        print("Bedrock client not initialized. Returning mock response.")
        ai_output = f"Echo: {user_input}"
    
    return {"reply": ai_output}


@app.get("/")
async def root():
    return {"message": "UW Insurance Coverage API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)