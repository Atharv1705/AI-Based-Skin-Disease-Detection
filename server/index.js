import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBMBUXdD-7-V2iH4RC_DMrWok20lBhzerU';

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const profilesFile = path.join(dataDir, 'profiles.json');

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));
  if (!fs.existsSync(profilesFile)) fs.writeFileSync(profilesFile, JSON.stringify([]));
}

ensureDataFiles();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/signup', (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const users = readJson(usersFile);
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  const userId = uuidv4();
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = { id: userId, email, passwordHash, full_name: fullName || null, created_at: new Date().toISOString() };
  users.push(newUser);
  writeJson(usersFile, users);

  const profiles = readJson(profilesFile);
  profiles.push({
    id: uuidv4(),
    user_id: userId,
    full_name: fullName || null,
    avatar_url: null,
    date_of_birth: null,
    skin_type: null,
    medical_history: null,
    notifications: true,
    data_sharing: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  writeJson(profilesFile, profiles);

  const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ user: { id: userId, email, full_name: fullName || null }, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const users = readJson(usersFile);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name || null }, token });
});

app.get('/api/auth/session', authMiddleware, (req, res) => {
  const users = readJson(usersFile);
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name || null } });
});

app.put('/api/auth/email', authMiddleware, (req, res) => {
  const { newEmail, password } = req.body;
  if (!newEmail || !password) return res.status(400).json({ error: 'newEmail and password are required' });
  const users = readJson(usersFile);
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(401).json({ error: 'Unauthorized' });
  const user = users[userIndex];
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Incorrect password' });
  if (users.find(u => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== user.id)) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  users[userIndex].email = newEmail;
  writeJson(usersFile, users);
  return res.json({ user: { id: user.id, email: newEmail, full_name: user.full_name || null } });
});

app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  const users = readJson(usersFile);
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(401).json({ error: 'Unauthorized' });
  const user = users[userIndex];
  const ok = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Incorrect current password' });
  users[userIndex].passwordHash = bcrypt.hashSync(newPassword, 10);
  writeJson(usersFile, users);
  return res.json({ success: true });
});

// Profiles
app.get('/api/profiles/me', authMiddleware, (req, res) => {
  const profiles = readJson(profilesFile);
  const profile = profiles.find(p => p.user_id === req.user.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  return res.json(profile);
});

app.put('/api/profiles/me', authMiddleware, (req, res) => {
  const profiles = readJson(profilesFile);
  const idx = profiles.findIndex(p => p.user_id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Profile not found' });
  const updated = {
    ...profiles[idx],
    full_name: req.body.full_name ?? profiles[idx].full_name,
    date_of_birth: req.body.date_of_birth ?? profiles[idx].date_of_birth,
    skin_type: req.body.skin_type ?? profiles[idx].skin_type,
    medical_history: req.body.medical_history ?? profiles[idx].medical_history,
    notifications: typeof req.body.notifications === 'boolean' ? req.body.notifications : profiles[idx].notifications,
    data_sharing: typeof req.body.data_sharing === 'boolean' ? req.body.data_sharing : profiles[idx].data_sharing,
    updated_at: new Date().toISOString()
  };
  profiles[idx] = updated;
  writeJson(profilesFile, profiles);
  return res.json(updated);
});

// Avatar upload & removal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, 'uploads', 'avatars', req.user.id);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/profiles/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const publicUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.user.id}/${req.file.filename}`;
  const profiles = readJson(profilesFile);
  const idx = profiles.findIndex(p => p.user_id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Profile not found' });
  profiles[idx].avatar_url = publicUrl;
  profiles[idx].updated_at = new Date().toISOString();
  writeJson(profilesFile, profiles);
  return res.json({ avatar_url: publicUrl });
});

app.delete('/api/profiles/avatar', authMiddleware, (req, res) => {
  const dir = path.join(__dirname, 'uploads', 'avatars', req.user.id);
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f)));
  }
  const profiles = readJson(profilesFile);
  const idx = profiles.findIndex(p => p.user_id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Profile not found' });
  profiles[idx].avatar_url = null;
  profiles[idx].updated_at = new Date().toISOString();
  writeJson(profilesFile, profiles);
  return res.json({ success: true });
});

// AI Functions - Disease Detection
app.post('/api/ai/disease-detection', async (req, res) => {
  try {
    const { imageData, patientAge, patientSex, medicalHistory } = req.body;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    const medicalPrompt = `You are an expert dermatologist AI assistant. Analyze this skin image and provide a detailed medical assessment.\n\nPATIENT INFORMATION:\n- Age: ${patientAge || 'Not specified'}\n- Sex: ${patientSex || 'Not specified'}\n- Medical History: ${medicalHistory || 'No significant history provided'}\n\nANALYSIS REQUIREMENTS:\nPlease provide your analysis in this EXACT JSON format:\n{\n  \"condition\": \"primary_diagnosis_name\",\n  \"confidence\": 85,\n  \"severity\": \"mild|moderate|severe\",\n  \"description\": \"Detailed description of findings and characteristics observed\",\n  \"differential_diagnoses\": [\"alternative_diagnosis_1\", \"alternative_diagnosis_2\"],\n  \"recommendations\": [\n    \"Specific treatment recommendation 1\",\n    \"Specific treatment recommendation 2\", \n    \"Specific care instruction 3\"\n  ],\n  \"urgency\": \"routine|semi-urgent|urgent\",\n  \"follow_up\": \"Recommended timeframe for follow-up care\",\n  \"red_flags\": [\"any concerning features that require immediate attention\"]\n}\n\nIMPORTANT GUIDELINES:\n- Focus on visible characteristics like color, texture, size, distribution\n- Consider patient age and sex in your assessment\n- Provide realistic confidence levels (60-95%)\n- Be specific with recommendations\n- Include both immediate care and long-term management\n- Flag any concerning features that need urgent attention\n- If the image shows normal skin, indicate that clearly\n\nAnalyze the image thoroughly and respond with only the JSON object.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: medicalPrompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] } }
          ]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      if (errorData.includes('quota') || errorData.includes('rate limit')) {
        return res.status(429).json({ error: 'AI analysis temporarily unavailable due to high demand. Please try again in a few minutes.', details: 'Rate limit exceeded', isQuotaError: true });
      }
      return res.status(500).json({ error: 'AI analysis failed', details: errorData });
    }
    const data = await response.json();
    let aiAnalysis;
    try {
      const rawContent = data.candidates[0].content.parts[0].text;
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiAnalysis = JSON.parse(jsonMatch[0]);
      else throw new Error('No JSON found in response');
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI analysis', details: e.message });
    }
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    const enhancedAnalysis = {
      ...aiAnalysis,
      analysisId,
      timestamp,
      patientInfo: { age: patientAge, sex: patientSex, medicalHistory },
      confidence: Math.min(Math.max(aiAnalysis.confidence || 70, 60), 95),
      disclaimer: 'This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.'
    };
    return res.json(enhancedAnalysis);
  } catch (error) {
    const message = (error && error.message) || 'Failed to analyze image with AI';
    if (message.includes('quota') || message.includes('rate limit')) {
      return res.status(429).json({ error: 'AI analysis temporarily unavailable due to high demand. Please try again in a few minutes.', details: 'Rate limit exceeded', isQuotaError: true });
    }
    return res.status(500).json({ error: 'Failed to analyze image with AI', details: message });
  }
});

// AI Health Chat
app.post('/api/ai/health-chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured', response: "I apologize, I'm currently unable to respond due to a configuration issue." });
    }
    const HEALTH_SYSTEM_PROMPT = `You are SkinAI Health Assistant, a knowledgeable and empathetic AI assistant specializing in dermatology and skin health. Your role is to provide helpful, accurate, and supportive information while maintaining appropriate medical boundaries.\n\nCAPABILITIES:\n- Answer questions about skin conditions, symptoms, and general skin health\n- Provide general skincare advice and prevention tips\n- Explain skin analysis results in understandable terms\n- Offer lifestyle recommendations for skin health\n- Discuss when to seek professional medical care\n\nLIMITATIONS & SAFETY:\n- NEVER provide specific medical diagnoses or replace professional medical advice\n- ALWAYS recommend consulting healthcare professionals for serious concerns\n- Do not prescribe medications or specific treatments\n- Acknowledge limitations and uncertainties in responses\n- Be especially careful with symptoms that could indicate serious conditions\n\nTONE & APPROACH:\n- Warm, supportive, and professional\n- Use clear, accessible language\n- Show empathy for user concerns\n- Encourage healthy skepticism and professional consultation\n- Be encouraging while maintaining medical safety\n\nRESPONSE FORMAT:\n- Keep responses concise but informative (2-4 paragraphs max)\n- Use bullet points for lists when helpful\n- Include disclaimers when appropriate\n- Offer to clarify or expand on topics`;
    let conversationText = HEALTH_SYSTEM_PROMPT + '\n\n';
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg) => {
        if (msg.role === 'user') conversationText += `User: ${msg.content}\n`;
        else if (msg.role === 'assistant') conversationText += `Assistant: ${msg.content}\n`;
      });
    }
    conversationText += `User: ${message}\nAssistant:`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: conversationText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ error: 'AI service unavailable', response: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.", details: errorData });
    }
    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    return res.json({ response: aiResponse, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', response: 'I apologize, but I encountered an error. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});