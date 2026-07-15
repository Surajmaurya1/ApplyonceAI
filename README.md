# ApplyOnce AI — Enterprise-Grade Universal Application Autofill Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%202.0%20Flash-blueviolet.svg)](https://aistudio.google.com/)

ApplyOnce AI is a secure, privacy-first universal profile parsing and browser form-filling automation engine. The platform combines in-browser OCR processing with LLM semantic extraction to construct structure-validated candidate profiles, enabling seamless autofill workflows across any online application portal.

---

## 📌 Architectural Overview

ApplyOnce AI uses a decentralized, local-first storage design. Sensitive candidate credentials (including identity cards like Aadhaar/PAN) are retained exclusively within the client container (`localStorage` and `chrome.storage.local`), ensuring zero server-side persistence of personal data.

```mermaid
flowchart TD
    subgraph Client Application (Port 5173)
        A[React Client UI] <-->|Read / Write| B[(Local Storage)]
        A -->|Execute OCR| C[Tesseract.js Web Worker]
        B -->|Message Passing| D[Chrome Content Script]
    end

    subgraph Service Layer (Port 3001)
        E[Express Router] -->|Rate Limiter| F[AI Extraction Controller]
        F -->|Prompt Context| G[Google Gemini API]
    end

    subgraph Chrome Extension sandbox
        D <-->|chrome.storage.local| H[(Extension Database)]
        H <-->|State Preview| I[Extension Popup UI]
    end

    C -->|Raw Text Extract| A
    A -->|OCR Payload| E
    G -->|Structured JSON Response| F
    F -->|Validated Credentials| A
    I -->|Auto-fill Commands| D
```

---

## 🎯 Key Features

- **LLM-Powered Document Semantic Extraction**: Eliminates rigid resume templates. Upload raw text files or document images (Aadhaar, PAN cards, CVs, mark sheets), execute in-browser OCR via Web Workers, and compile structured profiles via Google Gemini 2.0 Flash API.
- **Dynamic Field Mapping Engine**: Maps forms dynamically on any domain using exact matching, semantic pattern groupings, and regex boundary checks (e.g. `\bname\b` prevents matching fields like `username` or `domainName` as the applicant's name).
- **Nested Path Resolution**: Supports deep nesting extraction to parse and autofill education history, percentages/CGPAs, passing years, and career histories (e.g. `education[0].level`, `experience[0].company`).
- **Real-Time Extension Sync Engine**: Leverages safe cross-document messaging (`window.postMessage`) with integrated retry handlers to sync credentials from the main dashboard into `chrome.storage.local` with zero latency.
- **Autofill Confidence Highlighting**: Surfaces visual flags (Green for high confidence matches, Amber for manual verification fields, Red for missing data) in client sandboxes.

---

## 📂 Repository Structure

```
applyonce-ai/
├── client/                     # React / Vite Client Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components & Layouts
│   │   ├── features/           # Zustand stores and core state logic
│   │   ├── pages/              # Application Pages (Dashboard, Profile, Documents)
│   │   └── services/           # Storage, OCR and API Sync Clients
│   └── vite.config.js          # Client Build Configurations
├── server/                     # Node.js Express REST API
│   ├── src/
│   │   ├── controllers/        # AI & OCR Route Handlers
│   │   ├── middleware/         # Security & Error Middlewares
│   │   ├── routes/             # Express App Routes
│   │   └── services/           # Gemini Integration Services
│   ├── app.js                  # Application Router Definitions
│   └── server.js               # Service Entrypoint
├── extension/                  # Chrome Extension Root Container
│   ├── background.js           # Extension Background Service Worker
│   ├── content.js              # DOM Scanning & Form Injection Script
│   ├── popup.html              # Modern Glassmorphic Extension HUD
│   ├── popup.js                # HUD Interaction Controller
│   └── manifest.json           # Extension Metadata (Manifest V3)
├── shared/                     # Multi-workspace Shared Constants
└── package.json                # Project Workspace Configurations
```

---

## 🛠️ Installation & Server Orchestration

### Prerequisites
- Node.js (v18.0.0 or higher)
- NPM

### 1. Environment Configurations
Configure the workspace by creating a `.env` file in the project root directory:

```env
PORT=3001
GEMINI_API_KEY=AIzaSy...           # Google Generative AI API Key
CLIENT_URL=http://localhost:5173
```

### 2. Workspace Dependencies Installation
Install dependencies across both client and server workspaces:
```bash
npm install
```

### 3. Server Initialization
Launch both the Vite development client and the Node.js API cluster concurrently:
```bash
npm run dev
```

- **Vite Web Console**: `http://localhost:5173`
- **REST API Endpoint**: `http://localhost:3001`

---

## 🔌 Chrome Extension Deployment

1. Open **Google Chrome** and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** using the toggle switch in the upper-right corner.
3. Click the **Load unpacked** button in the upper-left corner.
4. Select the project's `extension/` directory.
5. Visit the Web App dashboard, click **My Profile**, populate your credentials, and click **Save Profile** to sync details to the extension container.
6. Open any external application form (or the built-in Sandbox form at `/applications/demo`) and click **Auto-fill form** inside the extension HUD to fill the fields instantly.

---

## 🔒 Security Posture & Privacy Compliance

- **No Central Database Storage**: Personal Identifiable Information (PII) including Aadhaar, phone numbers, and addresses are saved directly in sandbox-isolated browser memory.
- **Local In-Browser OCR Processing**: Tesseract.js processing executes via sandboxed Web Workers directly inside the client's browser, preventing document binaries from being sent to third-party file storage servers.
- **Transit-Only AI Ingestion**: Document OCR text is sent to Google Gemini endpoints via TLS-encrypted connections. The server executes in-flight transformations and returns structured data without logging payloads.
