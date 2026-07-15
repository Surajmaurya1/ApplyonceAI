import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app.js';

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`ApplyOnce API listening on http://localhost:${port}`);
});

