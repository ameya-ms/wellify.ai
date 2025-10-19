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
from pdf_utils import load_insurance_documents

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_FOLDER = os.path.join(BASE_DIR, "data")

# -------------------------------
# Load insurance PDFs
# -------------------------------
print("📥 Loading insurance PDFs from:", DATA_FOLDER)
insurance_context = load_insurance_documents(DATA_FOLDER)
print(f"📄 Loaded {len(insurance_context)} characters of insurance data")
print(insurance_context[:1000])  # first 1k chars for sanity check

# -------------------------------
# Bedrock client
# -------------------------------
bedrock = None
try:
    print("🔄 Attempting to create Bedrock client...")
    bedrock = boto3.client(
        service_name="bedrock-runtime",
        region_name="us-west-2"
    )
    print("✅ Bedrock client created successfully!")
except Exception as e:
    print("❌ Failed to create Bedrock client:", e)

# -------------------------------
# Chat endpoint
# -------------------------------
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    if bedrock:
        print(f"💬 Calling Bedrock with user input: {user_input}")

        context = insurance_context[:12000] if insurance_context else ""

        # Prompt structure
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [
                {
                    "role": "user",
                    "content": (
                        "You are Wellify, an assistant that ONLY answers questions using the provided "
                        "U.S. health insurance plan data. Do NOT make assumptions beyond the data.\n\n"
                        f"Insurance plan data:\n{context}\n\n"
                        f"User question: {user_input}\n\n"
                        "If the answer isn't found in the data, respond: 'Not mentioned in plan data.'"
                    )
                }
            ]
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
            print("✅ Bedrock response:", ai_output)

        except Exception as e:
            print("❌ Error calling Bedrock:", e)
            ai_output = f"Bedrock Error: {str(e)}"

    else:
        print("⚠️ Bedrock client not initialized. Returning mock response.")
        ai_output = f"Echo: {user_input}"

    return {"reply": ai_output}

@app.get("/")
async def root():
    return {"message": "UW Insurance Coverage API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
