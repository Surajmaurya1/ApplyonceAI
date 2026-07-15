import { createWorker } from 'tesseract.js';

export async function extractText(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { message: 'No file uploaded' }
    });
  }
  
  if (req.file.mimetype === 'application/pdf') {
    return res.status(422).json({
      success: false,
      error: { message: 'PDF OCR requires PDF image conversion, which is not enabled.' }
    });
  }

  let worker;
  try {
    worker = await createWorker('eng');
    const { data } = await worker.recognize(req.file.buffer);
    res.json({
      success: true,
      data: {
        text: data.text,
        filename: req.file.originalname
      }
    });
  } catch (e) {
    next(e);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

