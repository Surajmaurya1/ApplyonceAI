import { extractProfileFromText, chatAboutProfile } from '../services/geminiService.js';

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

