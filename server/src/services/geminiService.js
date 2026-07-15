import { GoogleGenerativeAI } from '@google/generative-ai';

const empty = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: {
    full: '',
    city: '',
    state: '',
    pincode: ''
  },
  aadhaarNumber: '',
  panNumber: '',
  education: [],
  experience: [],
  skills: []
};

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured on the server.'), { status: 503 });
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });
}

export async function extractProfileFromText(text, type) {
  const prompt = `Extract profile data from this ${type} OCR text. Return ONLY a JSON object matching this schema structure:
${JSON.stringify(empty, null, 2)}

Provide appropriate nested objects. For education, you can extract list of schools/universities, degree, field of study, year, percentage/cgpa. For experience, extract list of jobs (company, title, duration).
Use empty strings, empty arrays, or null where unknown. Never invent values. OCR text:
\n${text.slice(0, 30000)}`;

  const response = await getModel().generateContent(prompt);
  try {
    const data = JSON.parse(response.response.text());
    return { ...empty, ...data };
  } catch (err) {
    console.error("AI output parsing failed:", response.response.text(), err);
    throw new Error('AI response was not valid profile JSON.');
  }
}

export async function chatAboutProfile(message) {
  const response = await getModel().generateContent(
    `Help the user with their application profile. Be concise. User: ${message}`
  );
  return response.response.text();
}

