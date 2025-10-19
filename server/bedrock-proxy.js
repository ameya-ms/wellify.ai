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
  // naive mock: check for keywords
  const lower = (text || '').toLowerCase();
  const age = /\b(child|kid|infant|toddler)\b/.test(lower) ? '0-12' : /\b(teen|adolescent)\b/.test(lower) ? '13-17' : /\b(older|elder|senior|65)\b/.test(lower) ? '65+' : '18-64';
  const gender = /\b(male|man|boy)\b/.test(lower) ? 'male' : /\b(female|woman|girl)\b/.test(lower) ? 'female' : 'unknown';
  const urgency = /\b(chest pain|difficulty breathing|unconscious|severe)\b/.test(lower) ? 'high' : /\b(fever|cough|pain)\b/.test(lower) ? 'medium' : 'low';
  const symptom_code = /\b(fever|cough|headache|nausea|dizziness)\b/.exec(lower)?.[0] || 'other';
  const time_of_day = /\b(morning|afternoon|evening|night)\b/.test(lower) ? (/(morning)/.exec(lower)?.[1] || 'unspecified') : 'unspecified';
  
  // mock wait loads and specialties
  const wait_load_A = urgency === 'high' ? 'short' : 'normal';
  const wait_load_B = 'normal';
  const wait_load_C = 'low';
  const specialty_match_A = symptom_code === 'fever' ? 'Primary Care' : 'General Medicine';
  const specialty_match_B = 'Urgent Care';
  const specialty_match_C = 'Telemedicine';

  return {
    age,
    gender,
    symptom_code,
    urgency,
    time_of_day,
    wait_load_A,
    wait_load_B,
    wait_load_C,
    specialty_match_A,
    specialty_match_B,
    specialty_match_C,
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
