/*
Simple proxy server for local development to demonstrate the 'bedrock' LLM classification.
This file contains a mock classifier. To hook up to AWS Bedrock, replace the mock logic
with a call to Bedrock's runtime API (signed via AWS SigV4). Do NOT commit credentials.

Run: node server/bedrock-proxy.js

Note: In production, implement proper auth, rate-limiting, and secrets management.
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function mockClassify(text) {
  // List of available symptoms that can be selected
  const availableSymptoms = [
    "Broken Bone", "Cough", "Swellings", "Sore Throat", 
    "Nausea", "Fatigue", "Body Aches", "Chills",
    "Congestion", "Runny Nose", "Sneezing", "Dizziness",
    "Shortness of Breath", "Chest Pain", "Stomach Pain",
    "Fever", "Headache", "Diarrhea", "Vomiting"
  ];

  // Extract symptoms from text by checking for keywords
  const lower = (text || '').toLowerCase();
  const extractedSymptoms = [];
  
  // Check for each available symptom in the text
  availableSymptoms.forEach(symptom => {
    const symptomLower = symptom.toLowerCase();
    // Check for the symptom or common variations
    if (lower.includes(symptomLower)) {
      extractedSymptoms.push(symptom);
    }
  });

  // Check for additional common variations
  if (/\b(cold|flu|runny)\b/.test(lower) && !extractedSymptoms.includes("Runny Nose")) {
    extractedSymptoms.push("Runny Nose");
  }
  if (/\b(temperature|hot|feverish)\b/.test(lower) && !extractedSymptoms.includes("Fever")) {
    extractedSymptoms.push("Fever");
  }
  if (/\b(ache|aching|hurt|hurting)\b/.test(lower) && !extractedSymptoms.includes("Body Aches")) {
    extractedSymptoms.push("Body Aches");
  }
  if (/\b(tired|exhausted|weak)\b/.test(lower) && !extractedSymptoms.includes("Fatigue")) {
    extractedSymptoms.push("Fatigue");
  }
  if (/\b(throw up|throwing up|vomit)\b/.test(lower) && !extractedSymptoms.includes("Vomiting")) {
    extractedSymptoms.push("Vomiting");
  }
  if (/\b(stuffy|stuffed|congested)\b/.test(lower) && !extractedSymptoms.includes("Congestion")) {
    extractedSymptoms.push("Congestion");
  }

  return {
    symptoms: extractedSymptoms,
    originalText: text
  };
}

app.post('/api/classify', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text required' });

  // In real implementation: call Bedrock / other LLM here with prompt engineering to return JSON.
  const result = mockClassify(text);
  res.json(result);
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Bedrock proxy mock listening on http://localhost:${port}`));
