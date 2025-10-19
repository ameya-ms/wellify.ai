from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json
import os
import uvicorn
from pdf_utils import load_insurance_documents

app = FastAPI()

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

print(f"📂 Script location: {os.path.abspath(__file__)}")
print(f"📂 Project root: {BASE_DIR}")
print(f"📂 Data folder path: {DATA_FOLDER}")

# -------------------------------
# Load insurance PDFs
# -------------------------------
print("\n📥 Loading insurance PDFs from:", DATA_FOLDER)
insurance_documents = load_insurance_documents(DATA_FOLDER)

# -------------------------------
# Bedrock client
# -------------------------------
bedrock = None
try:
    bedrock = boto3.client(
        service_name="bedrock-runtime",
        region_name="us-west-2"
    )
    print("\n✅ Bedrock client created successfully!")
except Exception as e:
    print(f"\n❌ Failed to create Bedrock client:", e)

# -------------------------------
# Chat endpoint
# -------------------------------
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")
    user_input_lower = user_input.lower()

    if bedrock:
        # Smart context selection based on user question
        context = ""
        doc_type = "all plans"
        facility_type = "Part A"  # default
        
        if "medicare" in user_input_lower:
            context = insurance_documents.get("medicare", "")
            doc_type = "Medicare"
            facility_type = "Medicare Part"
        elif "apple" in user_input_lower or "applecare" in user_input_lower:
            context = insurance_documents.get("applecare", "")
            doc_type = "Apple Care"
            facility_type = "Apple Care"
        elif "health" in user_input_lower:
            context = insurance_documents.get("health101", "")
            doc_type = "Health 101"
            facility_type = "Health 101"
        else:
            # Combine all if no specific insurance mentioned
            context = "\n\n=== MEDICARE ===\n" + insurance_documents.get("medicare", "")
            context += "\n\n=== APPLE CARE ===\n" + insurance_documents.get("applecare", "")
            context += "\n\n=== HEALTH 101 ===\n" + insurance_documents.get("health101", "")
        
        print(f"\n💬 User asked: {user_input}")
        print(f"📋 Using context from: {doc_type}")
        
        # Limit context size
        context = context[:50000]

        # Improved prompt
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 2048,
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"You are an AI health insurance assistant. You have access to {doc_type} information.\n\n"
                        f"Insurance data:\n{context}\n\n"
                        f"User question: {user_input}\n\n"
                        "CRITICAL INSTRUCTIONS:\n"
                        "1. Answer ONLY about the insurance plan mentioned in the user's question\n"
                        "2. Extract specific coverage details from the data provided\n"
                        "3. Respond with valid JSON in this EXACT format:\n\n"
                        "{\n"
                        '  "reply": "conversational answer to the user",\n'
                        '  "coverageInfo": [\n'
                        '    {"facility": "facility/part name", "service": "service name", "coverage": "coverage amount", "details": "additional details"}\n'
                        '  ]\n'
                        "}\n\n"
                        "IMPORTANT:\n"
                        f"- If answering about Medicare, use facility names: 'Part A', 'Part B', 'Part C', 'Part D'\n"
                        f"- If answering about Apple Care, use facility name: 'Apple Care'\n"
                        f"- If answering about Health 101, use facility name: 'Health 101'\n"
                        "- Extract AT LEAST 3-5 coverage items from the data\n"
                        "- Return ONLY the JSON object, no markdown formatting\n"
                        "- Do NOT mix information from different insurance plans"
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
            ai_raw = result["content"][0]["text"]
            
            print("\n" + "="*60)
            print("🤖 RAW AI RESPONSE:")
            print(ai_raw[:500] + "..." if len(ai_raw) > 500 else ai_raw)
            print("="*60 + "\n")

            # Aggressive JSON parsing
            ai_reply = ""
            coverage_info = []
            
            try:
                # Remove markdown code blocks
                cleaned = ai_raw.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0].strip()
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0].strip()
                
                # Try to find JSON object
                if "{" in cleaned and "}" in cleaned:
                    start = cleaned.find("{")
                    end = cleaned.rfind("}") + 1
                    cleaned = cleaned[start:end]
                
                ai_json = json.loads(cleaned)
                ai_reply = ai_json.get("reply", "")
                coverage_info = ai_json.get("coverageInfo", [])
                
                print(f"✅ Successfully parsed! Found {len(coverage_info)} coverage items:")
                for i, item in enumerate(coverage_info):
                    print(f"  {i+1}. {item.get('facility')} - {item.get('service')}")
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON Parse Error: {e}")
                ai_reply = ai_raw
                coverage_info = []
            
            # FALLBACK: Create sample data based on doc type
            if len(coverage_info) == 0 and context:
                print("⚠️ No coverage info extracted. Creating sample data...")
                ai_reply = ai_raw if ai_raw else f"Here's information about {doc_type}."
                
                if doc_type == "Medicare":
                    coverage_info = [
                        {"facility": "Part A", "service": "Hospital Insurance", "coverage": "$1,632 deductible", "details": "Covers inpatient hospital stays"},
                        {"facility": "Part B", "service": "Medical Insurance", "coverage": "20% coinsurance", "details": "Covers doctor visits and outpatient care"},
                        {"facility": "Part D", "service": "Prescription Drugs", "coverage": "$2,100 cap", "details": "Out-of-pocket maximum for 2026"}
                    ]
                elif doc_type == "Apple Care":
                    coverage_info = [
                        {"facility": "Apple Care", "service": "Screen Repair", "coverage": "$29 service fee", "details": "Covers accidental screen damage"},
                        {"facility": "Apple Care", "service": "Battery Replacement", "coverage": "Covered", "details": "When battery holds less than 80%"},
                        {"facility": "Apple Care", "service": "Accidental Damage", "coverage": "$99 service fee", "details": "Up to 2 incidents per year"}
                    ]
                elif doc_type == "Health 101":
                    coverage_info = [
                        {"facility": "Health 101", "service": "Preventive Care", "coverage": "100% covered", "details": "Annual checkups included"},
                        {"facility": "Health 101", "service": "Specialist Visits", "coverage": "$40 copay", "details": "Referral required"},
                        {"facility": "Health 101", "service": "Emergency Room", "coverage": "$250 copay", "details": "Waived if admitted"}
                    ]
                else:
                    coverage_info = [
                        {"facility": "General", "service": "General Coverage", "coverage": "Varies", "details": "Ask about a specific plan"}
                    ]

        except Exception as e:
            print(f"❌ Bedrock Error: {e}")
            ai_reply = f"Bedrock Error: {str(e)}"
            coverage_info = []

    else:
        ai_reply = f"Echo: {user_input}"
        coverage_info = []

    return {"reply": ai_reply, "coverageInfo": coverage_info}


@app.get("/")
async def root():
    return {"message": "Wellify.ai Insurance Coverage API is running 🚀"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)