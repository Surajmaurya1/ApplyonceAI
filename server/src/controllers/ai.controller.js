import { extractProfileFromText, chatAboutProfile, analyzeResumeATS, generateCoverLetterText } from '../services/geminiService.js';

export async function extractProfile(req, res, next) {
  try {
    const { ocrText, documentType = 'unknown' } = req.body;
    if (!ocrText?.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'OCR text is required' }
      });
    }
    const profileData = await extractProfileFromText(ocrText, documentType);
    res.json({
      success: true,
      data: {
        profileData,
        fieldsExtracted: Object.values(profileData).filter(Boolean).length
      }
    });
  } catch (e) {
    next(e);
  }
}

export async function chat(req, res, next) {
  try {
    const message = req.body.message || '';
    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Chat message is required' }
      });
    }
    const aiResponse = await chatAboutProfile(message);
    res.json({
      success: true,
      data: {
        message: aiResponse
      }
    });
  } catch (e) {
    next(e);
  }
}

export async function analyzeResume(req, res, next) {
  try {
    const { profile, jobDescription } = req.body;
    if (!jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Job Description is required for analysis' }
      });
    }
    const analysis = await analyzeResumeATS(profile || {}, jobDescription);
    res.json({
      success: true,
      data: { analysis }
    });
  } catch (e) {
    next(e);
  }
}

export async function generateCoverLetter(req, res, next) {
  try {
    const { profile, company, role, jobDescription = '' } = req.body;
    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Company and Role are required for generating cover letters' }
      });
    }
    const coverLetter = await generateCoverLetterText(profile || {}, company, role, jobDescription);
    res.json({
      success: true,
      data: { coverLetter }
    });
  } catch (e) {
    next(e);
  }
}


