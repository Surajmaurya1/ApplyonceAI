# ApplyOnce AI – Complete Implementation Plan
### "Upload Once. Apply Anywhere."
> A production-quality AI-powered Universal Application Assistant

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Folder Structure](#3-folder-structure)
4. [Phase 1 – Project Scaffolding & Setup](#phase-1--project-scaffolding--setup)
5. [Phase 2 – Design System & Global Styles](#phase-2--design-system--global-styles)
6. [Phase 3 – Landing Page](#phase-3--landing-page)
7. [Phase 4 – Authentication UI](#phase-4--authentication-ui)
8. [Phase 5 – Dashboard Shell](#phase-5--dashboard-shell)
9. [Phase 6 – Document Upload & OCR](#phase-6--document-upload--ocr)
10. [Phase 7 – Gemini AI Integration](#phase-7--gemini-ai-integration)
11. [Phase 8 – Profile Management](#phase-8--profile-management)
12. [Phase 9 – Applications & Demo Forms](#phase-9--applications--demo-forms)
13. [Phase 10 – Chrome Extension](#phase-10--chrome-extension)
14. [Phase 11 – Autofill Logic & Field Mapping Engine](#phase-11--autofill-logic--field-mapping-engine)
15. [Phase 12 – Backend API (Express)](#phase-12--backend-api-express)
16. [Phase 13 – Final Polish & Production Readiness](#phase-13--final-polish--production-readiness)
17. [Environment Variables Reference](#environment-variables-reference)
18. [Technology Decisions & Rationale](#technology-decisions--rationale)
19. [Dependency List](#dependency-list)
20. [Testing Strategy](#testing-strategy)

---

## 1. Project Overview

**ApplyOnce AI** solves a universal pain point: re-entering the same personal information across dozens of job applications, college admissions, government forms, and scholarship portals. 

The product flow:
1. User uploads identity documents (Aadhaar, PAN, Resume, Marksheets, etc.)
2. **Tesseract.js** OCR extracts raw text from images/PDFs
3. **Google Gemini API** converts raw text → structured JSON profile
4. Profile is stored in LocalStorage (upgradeable to Supabase)
5. A **Chrome Extension** detects supported forms and auto-fills them using the saved profile
6. A **field mapping engine** handles the many different label names for the same data field

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  React 19 + Vite + Tailwind CSS + Framer Motion                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Landing  │  │Dashboard │  │ Profile  │  │Applications  │  │
│  │  Page    │  │  Shell   │  │  Editor  │  │  + Demo Form │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
│                                                                 │
│  Services Layer:                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ OCR Service │  │Gemini Service│  │ Storage Service      │ │
│  │(Tesseract.js│  │(Gemini API)  │  │(LocalStorage→Supabase│ │
│  └─────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           ↕ REST API (Express)
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                         │
│                                                                 │
│  Express Routes → Controllers → Services                       │
│  ┌──────────────────┐  ┌─────────────────┐                    │
│  │ /api/ocr         │  │ /api/ai/extract  │                   │
│  │ /api/profile     │  │ /api/documents   │                   │
│  └──────────────────┘  └─────────────────┘                    │
│                                                                 │
│  AI Layer: Google Gemini API (gemini-1.5-flash)               │
│  OCR Layer: Tesseract.js (server-side for heavy processing)    │
└─────────────────────────────────────────────────────────────────┘
           ↕ Chrome Extension Messages
┌─────────────────────────────────────────────────────────────────┐
│                    CHROME EXTENSION (MV3)                       │
│                                                                 │
│  popup.html/js → content.js → background.js                   │
│  Field Mapping Engine → Form Detector → Auto-filler           │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
[Document Upload] 
       ↓
[Tesseract.js OCR] → raw text string
       ↓
[POST /api/ai/extract] → sends text to Gemini
       ↓
[Gemini returns JSON] → structured profile object
       ↓
[Preview + User Edits] → confirmed profile
       ↓
[LocalStorage.saveProfile()] → persisted profile
       ↓
[Chrome Extension reads profile] → maps fields → fills form
```

---

## 3. Folder Structure

```
applyonce-ai/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── og-image.png
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.svg
│   │   │   ├── hero-bg.png
│   │   │   └── icons/
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── ui/                  # Base atoms
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Progress.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   └── Spinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   ├── landing/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── SupportedDocs.jsx
│   │   │   │   ├── ExtensionPreview.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── FAQ.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── WelcomeCard.jsx
│   │   │   │   ├── ProfileCompletion.jsx
│   │   │   │   ├── RecentDocuments.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   └── SupportedApps.jsx
│   │   │   ├── upload/
│   │   │   │   ├── DropZone.jsx
│   │   │   │   ├── DocumentCard.jsx
│   │   │   │   ├── OCRProgress.jsx
│   │   │   │   └── ExtractedPreview.jsx
│   │   │   └── profile/
│   │   │       ├── ProfileSection.jsx
│   │   │       ├── EducationEntry.jsx
│   │   │       ├── ExperienceEntry.jsx
│   │   │       └── PhotoUpload.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Documents.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── DemoForm.jsx
│   │   │   ├── Extension.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/
│   │   │   ├── useProfile.js
│   │   │   ├── useOCR.js
│   │   │   ├── useGemini.js
│   │   │   ├── useDocuments.js
│   │   │   ├── useToast.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useTheme.js
│   │   ├── services/
│   │   │   ├── ocrService.js        # Tesseract.js wrapper
│   │   │   ├── geminiService.js     # Gemini API calls
│   │   │   ├── storageService.js    # LocalStorage abstraction
│   │   │   ├── profileService.js    # Profile CRUD
│   │   │   └── apiService.js        # Axios base client
│   │   ├── context/
│   │   │   ├── ProfileContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── shared/
│   │   │   ├── types/
│   │   │   │   └── index.js         # JSDoc type definitions
│   │   │   ├── helpers/
│   │   │   │   ├── formatters.js
│   │   │   │   └── validators.js
│   │   │   └── constants/
│   │   │       ├── documentTypes.js
│   │   │       ├── fieldMappings.js # Central field mapping config
│   │   │       └── appCategories.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ocr.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── profile.routes.js
│   │   │   └── documents.routes.js
│   │   ├── controllers/
│   │   │   ├── ocr.controller.js
│   │   │   ├── ai.controller.js
│   │   │   ├── profile.controller.js
│   │   │   └── documents.controller.js
│   │   ├── services/
│   │   │   ├── ocrService.js        # Server-side Tesseract
│   │   │   └── geminiService.js     # Gemini SDK wrapper
│   │   ├── ai/
│   │   │   ├── geminiClient.js      # Gemini SDK init
│   │   │   └── prompts.js           # All AI prompt templates
│   │   ├── ocr/
│   │   │   └── tesseractWorker.js   # Tesseract worker pool
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── upload.js            # Multer config
│   │   │   ├── rateLimiter.js
│   │   │   └── cors.js
│   │   └── utils/
│   │       ├── logger.js
│   │       └── responseHelper.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── extension/                       # Chrome Extension MV3
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── background.js
│   ├── content.js
│   ├── storage.js
│   ├── fieldMapper.js               # Mapping engine (shared logic)
│   ├── formDetector.js              # Detect and read page fields
│   ├── autoFiller.js                # Fill logic
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
│
├── shared/                          # Shared between client/server/ext
│   ├── types/
│   │   └── profile.types.js
│   ├── constants/
│   │   └── fieldMappings.js         # THE single source of truth
│   └── helpers/
│       └── profileHelpers.js
│
├── .env.example
├── .gitignore
├── README.md
└── package.json                     # Root workspace scripts
```

---

## Phase 1 – Project Scaffolding & Setup

### 1.1 Initialize Root Workspace

```bash
# Create root project directory
mkdir applyonce-ai && cd applyonce-ai

# Initialize root package.json with workspaces
npm init -y

# Add workspace config
```

**Root `package.json`:**
```json
{
  "name": "applyonce-ai",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=client\" \"npm run dev --workspace=server\"",
    "build": "npm run build --workspace=client",
    "start": "npm run start --workspace=server"
  }
}
```

### 1.2 Initialize React + Vite Client

```bash
cd client
npm create vite@latest . -- --template react
npm install
```

**Install all client dependencies:**
```bash
npm install react-router-dom@6 \
  react-hook-form \
  @hookform/resolvers \
  zod \
  framer-motion \
  lucide-react \
  axios \
  tesseract.js \
  @google/generative-ai \
  react-dropzone \
  react-hot-toast \
  clsx \
  tailwind-merge \
  @radix-ui/react-dialog \
  @radix-ui/react-tooltip \
  @radix-ui/react-progress \
  date-fns

npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init -p
```

### 1.3 Initialize Express Server

```bash
cd ../server
npm init -y
npm install express cors dotenv multer helmet morgan \
  @google/generative-ai tesseract.js express-rate-limit \
  express-validator uuid
npm install -D nodemon
```

### 1.4 Configure Vite

**`client/vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@shared': path.resolve(__dirname, '../shared'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### 1.5 Configure Tailwind CSS

**`client/tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563EB',   // Brand primary
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#0F172A', // Brand secondary (dark navy)
        },
        accent: {
          DEFAULT: '#38BDF8', // Brand accent (sky blue)
          dark: '#0284c7',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 40px -10px rgb(37 99 235 / 0.15)',
        'glow': '0 0 40px rgb(37 99 235 / 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #fafafa 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 1.6 Global CSS (`client/src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 37 99 235;
    --secondary: 15 23 42;
    --accent: 56 189 248;
  }
  
  * { @apply antialiased; }
  
  body {
    @apply bg-white text-secondary font-sans;
    font-feature-settings: 'ss01', 'cv11';
  }

  ::selection {
    @apply bg-primary-100 text-primary-700;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { @apply bg-transparent; }
  ::-webkit-scrollbar-thumb { @apply bg-slate-200 rounded-full; }
  ::-webkit-scrollbar-thumb:hover { @apply bg-slate-300; }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-5 py-2.5 
           bg-primary-600 text-white font-medium rounded-xl
           hover:bg-primary-700 active:scale-95
           transition-all duration-150 ease-in-out
           shadow-sm hover:shadow-md;
  }
  
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 px-5 py-2.5
           bg-white text-secondary font-medium rounded-xl border border-surface-border
           hover:border-primary-300 hover:bg-primary-50 active:scale-95
           transition-all duration-150 ease-in-out;
  }
  
  .card {
    @apply bg-white rounded-2xl border border-surface-border shadow-card
           hover:shadow-card-hover transition-all duration-200;
  }
  
  .input {
    @apply w-full px-4 py-2.5 rounded-xl border border-surface-border
           text-secondary placeholder-slate-400 text-sm
           focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
           transition-all duration-150;
  }
  
  .label {
    @apply block text-sm font-medium text-slate-700 mb-1.5;
  }
  
  .badge {
    @apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  
  .section-title {
    @apply text-3xl font-bold text-secondary tracking-tight;
  }
  
  .section-subtitle {
    @apply text-lg text-slate-500 max-w-2xl mx-auto;
  }
}
```

### 1.7 Environment Variables

**`.env.example`:**
```
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=3001
NODE_ENV=development

# Client
VITE_API_BASE_URL=http://localhost:3001

# Future: Supabase
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
```

---

## Phase 2 – Design System & Global Styles

### 2.1 Core UI Components

#### `Button.jsx`
- Variants: `primary`, `secondary`, `ghost`, `danger`, `outline`
- Sizes: `sm`, `md`, `lg`
- States: `loading` (shows spinner), `disabled`
- Props: `icon`, `iconPosition`, `fullWidth`

#### `Input.jsx`
- Controlled + uncontrolled modes
- Left/right icon support
- Error state with message
- Label prop
- Integrates with React Hook Form via `register`

#### `Card.jsx`
- Variants: `default`, `glass`, `elevated`
- Optional `hover` prop for hover effect
- `header`, `footer` slot props
- `padding` prop: `sm`, `md`, `lg`

#### `Modal.jsx`
- Radix UI Dialog primitive
- Framer Motion enter/exit animation (`scale + fade`)
- Trap focus, close on backdrop click/Escape
- `title`, `description`, `footer` props

#### `Toast.jsx`
- Powered by `react-hot-toast`
- Custom styled variants: `success`, `error`, `warning`, `info`
- Position: top-right
- Auto dismiss: 4 seconds

#### `Skeleton.jsx`
- Shimmer animation variants
- `line`, `circle`, `card`, `table` shapes
- Used everywhere data is loading

#### `Spinner.jsx`
- Animated SVG ring
- Sizes: `sm`, `md`, `lg`
- Color inherits from parent or explicit prop

### 2.2 Layout Components

#### `Navbar.jsx`
- Fixed top, blur backdrop
- Logo + name left side
- Nav links: Features, How It Works, Pricing
- CTA: `Get Started` button right side
- Mobile: hamburger menu with slide-down drawer
- Dark mode toggle

#### `Sidebar.jsx`
- Collapsible left sidebar for dashboard
- Links: Dashboard, My Profile, Documents, Applications, Extension, Settings
- Active state with blue highlight + pill
- User avatar + name at bottom
- Collapse to icon-only on small screens

#### `DashboardLayout.jsx`
- Wraps all dashboard pages
- `Sidebar` + main content area
- Mobile: bottom tab bar

#### `Footer.jsx`
- Logo + tagline
- Links: Product, Company, Legal
- Social icons
- Dark background, clean minimal style

---

## Phase 3 – Landing Page

### 3.1 Hero Section (`Hero.jsx`)

**Visual Design:**
- Full viewport height
- Background: soft gradient mesh (`#eff6ff → #f0f9ff → white`)
- Floating blur orbs (decorative `div`s with `blur-3xl opacity-30`)
- Grid/dot pattern overlay (SVG)

**Content:**
```
Badge: "✨ Powered by Google Gemini AI"
H1: "Upload Once."
    "Apply Anywhere."    ← blue gradient text
P: "ApplyOnce AI extracts information from your documents and 
    helps you complete job applications faster and with fewer mistakes."
Buttons: [Get Started →]  [▶ Watch Demo]
Social proof: "Trusted by 1,200+ job seekers"
Hero image: Browser mockup showing dashboard (generated image)
```

**Animations:**
- Text: staggered slide-up using Framer Motion
- Buttons: fade-in delay
- Hero image: float animation (subtle up/down)
- Blur orbs: slow scale pulse

### 3.2 Features Section (`Features.jsx`)

Six feature cards in a 3×2 grid:

| Icon | Title | Description |
|------|-------|-------------|
| 📄 | OCR Extraction | Extract text from Aadhaar, PAN, Resume, Marksheets automatically |
| 🤖 | AI-Powered Parsing | Gemini converts raw text into structured, usable profile data |
| 🔁 | Reusable Profile | Fill it once, reuse everywhere across hundreds of applications |
| ⚡ | Auto-Fill Extension | Chrome extension fills forms automatically in one click |
| 🗂️ | Document Manager | Organize and manage all your important documents in one place |
| 🔒 | Privacy First | Your data stays in your browser. No cloud storage without consent |

Each card: icon (colored circle bg), title, description
Animation: scroll-triggered fade-in with stagger (Framer Motion + IntersectionObserver)

### 3.3 How It Works (`HowItWorks.jsx`)

4-step visual process:

```
[1] Upload Documents  →  [2] AI Extracts Info  →  [3] Review Profile  →  [4] Auto-Fill Forms
```

Each step: numbered circle, title, description, connecting line/arrow
Mobile: vertical stack

### 3.4 Supported Documents (`SupportedDocs.jsx`)

Grid of document type cards with icons:
- Aadhaar Card
- PAN Card  
- 10th Marksheet
- 12th Marksheet
- Graduation Certificate
- Caste Certificate
- Disability Certificate
- Passport
- Driving Licence
- Resume / CV

Each card has a status badge `Supported` in green.

### 3.5 Chrome Extension Preview (`ExtensionPreview.jsx`)

Split layout:
- Left: Extension popup mockup screenshot
- Right: Feature list (Auto-detect forms, Smart field mapping, Review before submit)
- CTA: "Add to Chrome" button (links to Chrome Web Store when published)

### 3.6 Testimonials (`Testimonials.jsx`)

3 testimonial cards with:
- Avatar image (generated)
- Name, role
- Star rating (5 stars)
- Quote text
- Auto-scrolling carousel on mobile

### 3.7 FAQ (`FAQ.jsx`)

Accordion component with 8 common questions:
1. Is my data safe?
2. Which documents are supported?
3. How accurate is the OCR?
4. Does it work with all websites?
5. Is it free?
6. Can I edit extracted information?
7. Does it auto-submit forms?
8. How do I install the extension?

### 3.8 CTA Section

Full-width gradient banner with:
- "Ready to stop retyping your information?"
- `Get Started Free` button
- No credit card required

---

## Phase 4 – Authentication UI

> **Note**: For MVP, we use localStorage-based "profile" with no real auth. Auth UI is built but wired to local storage login (email + local profile). The architecture supports easy Supabase Auth integration later.

### 4.1 Login Page (`/login`)
- Email + Password inputs
- "Continue with Google" (UI only for MVP, wire to Supabase later)
- Link to signup

### 4.2 Signup Page (`/signup`)
- Name, Email, Password, Confirm Password
- Terms checkbox
- Redirect to dashboard on success

### 4.3 Auth Context (`AuthContext.jsx`)
```javascript
// Provides: user, login(), logout(), isAuthenticated
// Stores session in localStorage
// Easy to swap with Supabase Auth
```

### 4.4 Protected Route
```javascript
// <ProtectedRoute> wrapper component
// Redirects to /login if not authenticated
// Used in App.jsx for all /dashboard/* routes
```

---

## Phase 5 – Dashboard Shell

### 5.1 Routing Setup (`App.jsx`)

```jsx
// Route structure:
// /                    → Landing
// /login               → Login
// /signup              → Signup
// /dashboard           → Dashboard (protected)
// /dashboard/profile   → Profile
// /dashboard/documents → Documents
// /dashboard/applications → Applications
// /dashboard/applications/:type → DemoForm
// /dashboard/extension → Extension
// /dashboard/settings  → Settings
```

### 5.2 Dashboard Home (`Dashboard.jsx`)

**Welcome Card:**
- Greeting with user name + time of day
- Quick stats: Documents uploaded, Profile %, Applications filled

**Profile Completion Widget:**
- Radial progress circle (animated, SVG)
- Percentage complete
- "Complete your profile" CTA
- List of missing fields highlighted

**Recent Documents:**
- Last 3 uploaded documents
- Name, type, date, status badge
- View / Re-process buttons

**Supported Applications Quick Grid:**
- Government Jobs, Private Jobs, Scholarships, Admissions
- Each with icon + count of forms supported

**Quick Actions:**
- [Upload Document]  [Edit Profile]  [Try Auto-Fill]

### 5.3 Sidebar Navigation

```
Logo (ApplyOnce AI)
─────────────────────
🏠 Dashboard
👤 My Profile
📄 Documents
📋 Applications
🧩 Extension
⚙️  Settings
─────────────────────
[Avatar] John Doe
         john@example.com
```

Active item: blue bg pill, white text, icon colored

---

## Phase 6 – Document Upload & OCR

### 6.1 Documents Page (`Documents.jsx`)

**Layout:**
- Page header with upload button
- Grid of uploaded document cards
- Empty state when no documents

**Document Card:**
- Thumbnail / file icon
- Document type badge
- Upload date
- Status: `Processing`, `Extracted`, `Needs Review`
- Actions: View, Re-process, Delete

### 6.2 Upload Drop Zone (`DropZone.jsx`)

```
┌────────────────────────────────────────────────┐
│                                                │
│        📁  Drag & drop your documents          │
│           or click to browse files             │
│                                                │
│   Supported: JPG, PNG, PDF, WEBP               │
│   Max size: 10MB per file                      │
│                                                │
└────────────────────────────────────────────────┘
```

- `react-dropzone` library
- Visual feedback: border changes color on drag-over
- File type validation: images + PDF
- Size validation: max 10MB
- Multiple file support

### 6.3 Document Type Selector

After drop, user sees a modal to select document type:
```
What type of document is this?
○ Aadhaar Card
○ PAN Card
○ 10th Marksheet
○ 12th Marksheet
○ Graduation Certificate
○ Resume / CV
○ Caste Certificate
○ Passport
○ Driving Licence
○ Other
[Cancel]  [Process Document →]
```

### 6.4 OCR Service (`client/src/services/ocrService.js`)

```javascript
import Tesseract from 'tesseract.js';

/**
 * Tesseract.js OCR Service
 * Runs entirely in the browser using Web Workers
 * No server needed for client-side OCR
 */

export class OCRService {
  
  /**
   * Extract text from an image file
   * @param {File} imageFile - The image file to process
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<string>} Extracted text
   */
  async extractText(imageFile, onProgress) {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',  // Language: English
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            onProgress(Math.round(m.progress * 100));
          }
        }
      }
    );
    return result.data.text;
  }

  /**
   * For PDF files: convert to image first, then OCR
   * Uses canvas to render PDF page
   */
  async extractFromPDF(pdfFile, onProgress) {
    // Use pdf.js to render pages to canvas
    // Then run OCR on each canvas image
    // Return combined text
  }
}

export const ocrService = new OCRService();
```

### 6.5 OCR Progress UI (`OCRProgress.jsx`)

```
Processing: Aadhaar Card
[████████████░░░░░░░░] 64%
Recognizing text...

Steps:
✅ File loaded
✅ Preprocessing
🔄 Text recognition (64%)
⬜ AI extraction
⬜ Profile update
```

### 6.6 Extracted Text Preview (`ExtractedPreview.jsx`)

After OCR:
```
Raw Extracted Text:
┌──────────────────────────────────────────────────────┐
│ GOVERNMENT OF INDIA                                  │
│ आधार / Aadhaar                                       │
│ JOHN DOE                                             │
│ DOB: 15/03/1998                                      │
│ Male                                                 │
│ 1234 5678 9012                                       │
└──────────────────────────────────────────────────────┘

[Send to AI for Extraction →]
```

---

## Phase 7 – Gemini AI Integration

### 7.1 Gemini Service (`client/src/services/geminiService.js`)

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json', // Force JSON response
        temperature: 0.1,                     // Low temp = consistent extraction
      }
    });
  }

  /**
   * Extract structured profile data from OCR text
   */
  async extractProfileFromText(ocrText, documentType) {
    const prompt = this.buildExtractionPrompt(ocrText, documentType);
    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      throw new Error('AI returned invalid JSON. Please try again.');
    }
  }

  /**
   * Smart prompt builder based on document type
   */
  buildExtractionPrompt(ocrText, documentType) {
    return `
You are a document data extraction AI. Extract information from the following 
OCR-extracted text from a ${documentType} and return ONLY valid JSON.

OCR Text:
"""
${ocrText}
"""

Return a JSON object with ONLY the fields that you can find in the text.
Use null for missing fields. Do NOT guess or invent values.

Expected JSON structure:
{
  "name": "Full name as appears on document",
  "dob": "DD/MM/YYYY format",
  "gender": "Male|Female|Other",
  "fatherName": "Father's full name",
  "motherName": "Mother's full name",
  "address": {
    "street": "",
    "city": "",
    "state": "",
    "pincode": "",
    "full": "Complete address as one string"
  },
  "phone": "10-digit number",
  "email": "email address",
  "aadhaarNumber": "XXXX XXXX XXXX (if Aadhaar)",
  "panNumber": "XXXXXXXXXX (if PAN)",
  "education": [
    {
      "level": "10th|12th|Graduation|Post-Graduation",
      "board": "Board/University name",
      "year": "Passing year",
      "percentage": "Percentage or CGPA",
      "subject": "Major subject/stream"
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "from": "",
      "to": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "category": "General|OBC|SC|ST",
  "nationality": "Indian",
  "documentType": "${documentType}"
}

Return ONLY the JSON object. No explanation, no markdown, no code blocks.
`;
  }
}

export const geminiService = new GeminiService();
```

### 7.2 AI Extraction UI Flow

```
Step 1: OCR complete → show raw text
Step 2: User clicks "Extract with AI"
Step 3: Show loading state ("🤖 Gemini is analyzing your document...")
Step 4: Show extracted fields in editable form
Step 5: User reviews, edits if needed
Step 6: User clicks "Save to Profile"
Step 7: Profile updated, success toast
```

### 7.3 Extracted Data Preview + Editor

After Gemini returns JSON, render a preview card:
```
✅ Extraction Complete
────────────────────────────────
Name:         John Doe          ✏️
Date of Birth: 15/03/1998       ✏️
Gender:       Male              ✏️
Father Name:  James Doe         ✏️
Address:      123 Main St, ...  ✏️
Aadhaar:      1234 5678 9012   ✏️
────────────────────────────────
Confidence: 94%
Fields found: 8/12

[Edit Profile]  [Save to Profile ✓]
```

Each field is inline-editable. If a field is missing, show a red placeholder with "Not found - click to add".

### 7.4 Server-Side Gemini (`server/src/ai/geminiClient.js`)

For production, route Gemini calls through the server to protect API keys:
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.1,
  }
});
```

**`server/src/routes/ai.routes.js`:**
```javascript
POST /api/ai/extract
  Body: { ocrText: string, documentType: string }
  Returns: { success: true, data: ProfileJSON }
```

---

## Phase 8 – Profile Management

### 8.1 Profile Data Structure

```javascript
// shared/types/profile.types.js
/**
 * @typedef {Object} UserProfile
 * @property {string} id - UUID
 * @property {string} name - Full name
 * @property {string} dob - Date of birth (DD/MM/YYYY)
 * @property {string} gender - Male|Female|Other
 * @property {string} fatherName
 * @property {string} motherName
 * @property {string} email
 * @property {string} phone
 * @property {Address} address
 * @property {Education[]} education
 * @property {Experience[]} experience
 * @property {string[]} skills
 * @property {string} category - General|OBC|SC|ST
 * @property {string} photoUrl - Base64 or blob URL
 * @property {string} signatureUrl - Base64 or blob URL
 * @property {string} aadhaarNumber
 * @property {string} panNumber
 * @property {number} completionPercentage
 * @property {Date} lastUpdated
 */
```

### 8.2 Storage Service (`storageService.js`)

```javascript
/**
 * Storage abstraction layer.
 * Currently uses localStorage.
 * Can be swapped with Supabase by implementing the same interface.
 */
export class StorageService {
  static PROFILE_KEY = 'applyonce_profile';
  static DOCUMENTS_KEY = 'applyonce_documents';
  static SETTINGS_KEY = 'applyonce_settings';

  // Profile CRUD
  saveProfile(profile) { ... }
  getProfile() { ... }
  updateProfile(partial) { ... }
  clearProfile() { ... }

  // Documents CRUD
  saveDocument(doc) { ... }
  getDocuments() { ... }
  deleteDocument(id) { ... }
  
  // Profile completion calculation
  calculateCompletion(profile) {
    const requiredFields = ['name', 'dob', 'gender', 'phone', 'email', 'address', 'education'];
    const filled = requiredFields.filter(f => profile[f] && profile[f] !== '');
    return Math.round((filled.length / requiredFields.length) * 100);
  }
}
```

### 8.3 Profile Context (`ProfileContext.jsx`)

```jsx
export const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [loading, setLoading] = useState(false);

  const updateProfile = (partial) => {
    const updated = { ...profile, ...partial, lastUpdated: new Date() };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const mergeExtractedData = (extracted) => {
    // Smart merge: only overwrite null/empty fields
    // Ask user before overwriting existing data
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, mergeExtractedData, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}
```

### 8.4 Profile Page (`Profile.jsx`)

**Sections:**

**Personal Information:**
```
[Photo Upload] ← circular, click to upload

Full Name:      [__________________]
Date of Birth:  [__________________] (date picker)
Gender:         (●) Male  ( ) Female  ( ) Other
Father's Name:  [__________________]
Mother's Name:  [__________________]
Category:       [General ▾]
```

**Contact Information:**
```
Phone:    [__________________]
Email:    [__________________]
Address:  [__________________]
City:     [__________________]
State:    [__________________]
Pincode:  [__________________]
```

**Education (Dynamic Array):**
```
+ Add Education

[Entry 1]
Level:       [10th ▾]
Board:       [__________________]
Year:        [____]
Percentage:  [____]
[🗑 Remove]
```

**Work Experience (Dynamic Array):**
```
+ Add Experience

[Entry 1]
Company: [__________________]
Role:    [__________________]
From:    [____] To: [____]
[🗑 Remove]
```

**Skills:**
```
[React.js ×] [Node.js ×] [Python ×] [+ Add skill]
```

**Documents:**
```
Aadhaar: [1234 5678 9012]
PAN:     [ABCDE1234F]
```

**Signature Upload:**
```
[Upload Signature Image]
Or draw signature with mouse
```

Save button: sticky at bottom, full-width on mobile.

### 8.5 `useProfile` Hook

```javascript
export function useProfile() {
  const context = useContext(ProfileContext);
  
  const completionPercentage = useMemo(() => 
    storageService.calculateCompletion(context.profile), 
    [context.profile]
  );

  return { ...context, completionPercentage };
}
```

---

## Phase 9 – Applications & Demo Forms

### 9.1 Applications Page (`Applications.jsx`)

**Category Cards:**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🏛️           │  │  💼           │  │  🎓           │
│ Government   │  │  Private     │  │ Scholarship  │
│    Jobs      │  │    Jobs      │  │              │
│  12 forms    │  │  8 forms     │  │  6 forms     │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│  🏫           │  │  💡           │
│ Admissions   │  │ Internships  │
│  5 forms     │  │  4 forms     │
└──────────────┘  └──────────────┘
```

Clicking a category opens a list of demo forms within it.

### 9.2 Demo Application Form (`DemoForm.jsx`)

**Fields:**
```
APPLICATION FORM
─────────────────────────────────────────

Personal Details
Full Name:           [                  ]
Father's Name:       [                  ]
Mother's Name:       [                  ]
Date of Birth:       [                  ]
Gender:              ( ) Male ( ) Female ( ) Other
Category:            [General           ▾]
Nationality:         [Indian            ]

Contact Details
Mobile Number:       [                  ]
Email Address:       [                  ]
Permanent Address:   [                  ]
City:                [                  ]
State:               [                  ]
PIN Code:            [                  ]

Education Details
Qualification:       [Graduation        ▾]
Board/University:    [                  ]
Passing Year:        [                  ]
Percentage/CGPA:     [                  ]

Identification
Aadhaar Number:      [                  ]
PAN Number:          [                  ]

Documents
Photo:               [Upload Photo      ]
Signature:           [Upload Signature  ]

                              [⚡ AUTO FILL]
                              [    Submit  ]
```

### 9.3 Auto-Fill Button Action

When user clicks "AUTO FILL":
1. Read profile from localStorage
2. For each form field, find matching profile value using field mapping engine
3. Fill the field with animation (simulate typing or instant fill)
4. Color-code each field:
   - 🟢 Green border: Successfully filled
   - 🟡 Yellow border: Filled but needs review
   - 🔴 Red border: No matching data found
5. Show summary at top:
```
✅ Auto-Fill Complete
──────────────────────────────
● 14 fields filled successfully
● 2 fields need review  
● 1 field missing information

[Review Fields]  [Continue]
```

---

## Phase 10 – Chrome Extension

### 10.1 Manifest V3 (`extension/manifest.json`)

```json
{
  "manifest_version": 3,
  "name": "ApplyOnce AI",
  "version": "1.0.0",
  "description": "Auto-fill job applications with your saved profile. Upload Once. Apply Anywhere.",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "http://localhost:5173/*",
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "web_accessible_resources": [
    {
      "resources": ["icons/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### 10.2 Popup (`popup.html` + `popup.js`)

**Popup UI:**
```
┌──────────────────────────────────┐
│  ⚡ ApplyOnce AI           ●●●   │
├──────────────────────────────────┤
│                                  │
│  Profile: John Doe          94%  │
│  ████████████████████░░   ready  │
│                                  │
│  ┌─────────────────────────────┐ │
│  │  ✅ Form Detected           │ │
│  │  23 fillable fields found   │ │
│  └─────────────────────────────┘ │
│                                  │
│  [⚡ Auto Fill Page          ]   │
│  [🏠 Open Dashboard          ]   │
│  [🔄 Refresh Profile         ]   │
│                                  │
│  ─────────────── Settings ─────  │
│  [⚙️ Extension Settings      ]   │
│                                  │
└──────────────────────────────────┘
```

**Status after fill:**
```
✅ Auto-Fill Complete
────────────────────
✓ 18 fields filled
⚠  3 need review
✗  2 missing

[View Details]
```

### 10.3 Storage (`extension/storage.js`)

```javascript
/**
 * Extension Storage - reads profile from:
 * 1. chrome.storage.local (synced from webapp)
 * 2. OR fetches from localhost API (dev mode)
 */

export const extensionStorage = {
  async getProfile() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['applyonce_profile'], (result) => {
        resolve(result.applyonce_profile || null);
      });
    });
  },

  async saveProfile(profile) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ applyonce_profile: profile }, resolve);
    });
  },

  async clearProfile() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['applyonce_profile'], resolve);
    });
  }
};
```

### 10.4 Background Service Worker (`background.js`)

```javascript
// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PROFILE') {
    extensionStorage.getProfile().then(sendResponse);
    return true; // Keep channel open for async
  }
  
  if (request.action === 'SYNC_PROFILE') {
    // Fetch latest profile from webapp localStorage
    // Store in chrome.storage.local
    syncProfileFromWebapp().then(sendResponse);
    return true;
  }
});

// On install: open onboarding page
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'http://localhost:5173' });
  }
});
```

### 10.5 Content Script (`content.js`)

```javascript
/**
 * Content script runs on every webpage.
 * Responsibilities:
 * 1. Detect form fields on the page
 * 2. Receive fill commands from popup
 * 3. Fill fields with profile data
 * 4. Report back what was filled
 */

// Listen for fill command from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FILL_FORM') {
    const result = fillForm(request.profile);
    sendResponse(result);
  }
  
  if (request.action === 'DETECT_FIELDS') {
    const fields = detectFormFields();
    sendResponse({ fieldCount: fields.length, fields });
  }
});

function detectFormFields() {
  // Find all visible input, select, textarea elements
  // Exclude: hidden, password, file, submit, button
  const inputs = document.querySelectorAll(
    'input:not([type=hidden]):not([type=password]):not([type=submit]):not([type=button]), select, textarea'
  );
  return Array.from(inputs).filter(isVisible);
}
```

---

## Phase 11 – Autofill Logic & Field Mapping Engine

### 11.1 Field Mapping Configuration (`shared/constants/fieldMappings.js`)

This is the **heart** of the autofill system. A configurable, extensible mapping engine.

```javascript
/**
 * Field Mapping Engine
 * Maps form field labels/names/ids → profile keys
 * 
 * Each profile key has an array of possible label patterns
 * The engine checks: name attr, id attr, placeholder, label text, aria-label
 * 
 * To add new mappings: simply add strings to the array
 */

export const FIELD_MAPPINGS = {
  name: {
    patterns: [
      'full name', 'fullname', 'candidate name', 'applicant name',
      'your name', 'name of applicant', 'name', 'first name', // careful with common 'name'
      'नाम', 'पूरा नाम'
    ],
    type: 'text',
    profilePath: 'name',
  },
  
  fatherName: {
    patterns: [
      "father's name", "father name", 'fathername', 'fathers name',
      'paternal name', 'पिता का नाम', 'पिताजी का नाम',
      'father_name', 'fatherName', 'guardian name', "guardian's name"
    ],
    type: 'text',
    profilePath: 'fatherName',
  },
  
  motherName: {
    patterns: [
      "mother's name", "mother name", 'mothername',
      'maternal name', 'माता का नाम',
      'mother_name', 'motherName'
    ],
    type: 'text',
    profilePath: 'motherName',
  },
  
  dob: {
    patterns: [
      'date of birth', 'dob', 'birth date', 'birthdate',
      'date_of_birth', 'dateofbirth', 'birth_date',
      'जन्म तिथि', 'd.o.b', 'born on'
    ],
    type: 'date',
    profilePath: 'dob',
    transform: (value) => formatDateForInput(value), // DD/MM/YYYY → YYYY-MM-DD
  },
  
  gender: {
    patterns: ['gender', 'sex', 'लिंग'],
    type: 'select|radio',
    profilePath: 'gender',
    valueMap: {
      'Male': ['male', 'm', '1', 'पुरुष'],
      'Female': ['female', 'f', '2', 'महिला'],
      'Other': ['other', 'transgender', '3']
    }
  },
  
  phone: {
    patterns: [
      'phone', 'mobile', 'contact', 'phone number', 'mobile number',
      'contact number', 'phone_number', 'mobile_no', 'cell',
      'फोन', 'मोबाइल', 'संपर्क'
    ],
    type: 'tel',
    profilePath: 'phone',
  },
  
  email: {
    patterns: [
      'email', 'email address', 'e-mail', 'email_address',
      'mail', 'ईमेल'
    ],
    type: 'email',
    profilePath: 'email',
  },
  
  address: {
    patterns: [
      'address', 'permanent address', 'residential address',
      'communication address', 'home address', 'current address',
      'full address', 'पता', 'स्थायी पता', 'address_line'
    ],
    type: 'text|textarea',
    profilePath: 'address.full',
  },
  
  city: {
    patterns: ['city', 'town', 'district', 'शहर', 'जिला'],
    type: 'text',
    profilePath: 'address.city',
  },
  
  state: {
    patterns: ['state', 'province', 'राज्य'],
    type: 'text|select',
    profilePath: 'address.state',
  },
  
  pincode: {
    patterns: [
      'pincode', 'pin code', 'pin', 'zip', 'zip code', 'postal code',
      'pin_code', 'zipcode', 'पिनकोड'
    ],
    type: 'text|number',
    profilePath: 'address.pincode',
  },
  
  aadhaar: {
    patterns: [
      'aadhaar', 'aadhar', 'uidai', 'aadhaar number', 'aadhar number',
      'uid', 'aadhaar_no', 'आधार', 'आधार संख्या'
    ],
    type: 'text',
    profilePath: 'aadhaarNumber',
  },
  
  pan: {
    patterns: [
      'pan', 'pan number', 'pan card', 'pan_number', 'pan no',
      'permanent account number', 'पैन'
    ],
    type: 'text',
    profilePath: 'panNumber',
  },
  
  category: {
    patterns: [
      'category', 'caste', 'caste category', 'reservation category',
      'social category', 'वर्ग', 'जाति'
    ],
    type: 'select|radio',
    profilePath: 'category',
    valueMap: {
      'General': ['general', 'gen', 'ur', 'unreserved', 'open'],
      'OBC': ['obc', 'other backward class'],
      'SC': ['sc', 'scheduled caste', 'dalit'],
      'ST': ['st', 'scheduled tribe']
    }
  },
  
  qualification: {
    patterns: [
      'qualification', 'education', 'highest qualification',
      'educational qualification', 'शैक्षणिक योग्यता'
    ],
    type: 'select|text',
    profilePath: 'education[0].level', // Latest education
  },
  
  percentage: {
    patterns: [
      'percentage', 'marks', 'cgpa', 'gpa', 'score',
      'marks obtained', '%', 'प्रतिशत'
    ],
    type: 'text|number',
    profilePath: 'education[0].percentage',
  },
  
  passingYear: {
    patterns: [
      'passing year', 'year of passing', 'year', 'pass year',
      'graduation year', 'उत्तीर्ण वर्ष'
    ],
    type: 'text|number|select',
    profilePath: 'education[0].year',
  },
};
```

### 11.2 Field Matching Algorithm (`fieldMapper.js`)

```javascript
/**
 * Scoring algorithm for field matching
 * Returns a confidence score 0-100 for each profile key
 */

export function findBestMatch(fieldElement, profile) {
  const fieldInfo = extractFieldInfo(fieldElement);
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [profileKey, mapping] of Object.entries(FIELD_MAPPINGS)) {
    const score = calculateMatchScore(fieldInfo, mapping.patterns);
    
    if (score > bestScore && score > 40) { // Minimum threshold: 40%
      bestScore = score;
      bestMatch = { profileKey, mapping, score };
    }
  }
  
  return bestMatch;
}

function extractFieldInfo(element) {
  return {
    name: (element.name || '').toLowerCase(),
    id: (element.id || '').toLowerCase(),
    placeholder: (element.placeholder || '').toLowerCase(),
    label: findAssociatedLabel(element).toLowerCase(),
    ariaLabel: (element.getAttribute('aria-label') || '').toLowerCase(),
    type: element.type || element.tagName.toLowerCase(),
  };
}

function calculateMatchScore(fieldInfo, patterns) {
  let maxScore = 0;
  
  for (const pattern of patterns) {
    const patternLower = pattern.toLowerCase();
    
    // Exact match in any attribute = 100
    const attrs = [fieldInfo.name, fieldInfo.id, fieldInfo.label, fieldInfo.ariaLabel];
    for (const attr of attrs) {
      if (attr === patternLower) return 100;
      if (attr.includes(patternLower)) maxScore = Math.max(maxScore, 80);
      if (patternLower.includes(attr) && attr.length > 3) maxScore = Math.max(maxScore, 60);
    }
    
    // Fuzzy match on placeholder
    if (fieldInfo.placeholder.includes(patternLower)) {
      maxScore = Math.max(maxScore, 70);
    }
  }
  
  return maxScore;
}

function findAssociatedLabel(element) {
  // Check for label[for=id]
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }
  
  // Check parent label
  const parentLabel = element.closest('label');
  if (parentLabel) return parentLabel.textContent.trim();
  
  // Check preceding sibling label
  let sibling = element.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === 'LABEL') return sibling.textContent.trim();
    if (sibling.tagName === 'INPUT') break;
    sibling = sibling.previousElementSibling;
  }
  
  // Check parent's label text
  const parentText = element.parentElement?.textContent?.replace(element.value, '').trim();
  return parentText || '';
}
```

### 11.3 Auto-Filler (`autoFiller.js`)

```javascript
/**
 * Core auto-fill execution engine
 * Handles text inputs, selects, radio buttons, checkboxes
 * NEVER fills: password, CAPTCHA, OTP, security questions
 */

export async function fillForm(profile) {
  const fields = detectFormFields();
  const results = { filled: [], needsReview: [], missing: [], skipped: [] };
  
  for (const field of fields) {
    // Skip sensitive/security fields
    if (shouldSkipField(field)) {
      results.skipped.push({ field, reason: 'security' });
      continue;
    }
    
    const match = findBestMatch(field, profile);
    
    if (!match) {
      results.missing.push({ field });
      continue;
    }
    
    const value = getProfileValue(profile, match.mapping.profilePath);
    
    if (!value) {
      results.missing.push({ field, profileKey: match.profileKey });
      continue;
    }
    
    try {
      await fillField(field, value, match.mapping);
      
      if (match.score >= 80) {
        results.filled.push({ field, value, confidence: 'high' });
        highlightField(field, 'success');
      } else {
        results.needsReview.push({ field, value, confidence: 'medium' });
        highlightField(field, 'review');
      }
    } catch (e) {
      results.missing.push({ field, error: e.message });
      highlightField(field, 'error');
    }
  }
  
  return results;
}

async function fillField(element, value, mapping) {
  const tag = element.tagName.toLowerCase();
  
  if (tag === 'select') {
    await fillSelect(element, value, mapping.valueMap);
  } else if (element.type === 'radio') {
    await fillRadio(element, value, mapping.valueMap);
  } else if (element.type === 'checkbox') {
    await fillCheckbox(element, value);
  } else if (element.type === 'date') {
    await fillDate(element, value);
  } else {
    await fillText(element, value);
  }
  
  // Trigger React/Vue/Angular change events
  triggerChangeEvents(element);
}

async function fillText(element, value) {
  element.focus();
  element.value = '';
  
  // Simulate typing for better compatibility
  for (const char of String(value)) {
    element.value += char;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(15); // Small delay for React controlled inputs
  }
  
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.blur();
}

function shouldSkipField(field) {
  const skipPatterns = [
    'captcha', 'otp', 'password', 'security', 'verification code',
    'confirm password', 'secret', 'pin'
  ];
  
  const fieldText = [field.name, field.id, field.placeholder, 
    findAssociatedLabel(field)].join(' ').toLowerCase();
  
  return skipPatterns.some(pattern => fieldText.includes(pattern));
}

function highlightField(element, status) {
  const colors = {
    success: '#22c55e',  // green
    review: '#f59e0b',   // amber
    error: '#ef4444',    // red
  };
  
  const origBorder = element.style.border;
  element.style.outline = `2px solid ${colors[status]}`;
  element.style.outlineOffset = '2px';
  
  // Fade out highlight after 3 seconds
  setTimeout(() => {
    element.style.outline = origBorder || '';
  }, 3000);
}
```

---

## Phase 12 – Backend API (Express)

### 12.1 App Entry (`server/app.js`)

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Routes
import ocrRoutes from './routes/ocr.routes.js';
import aiRoutes from './routes/ai.routes.js';
import profileRoutes from './routes/profile.routes.js';
import documentRoutes from './routes/documents.routes.js';

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Rate limiting on AI endpoints
app.use('/api/ai', rateLimiter);

// Routes
app.use('/api/ocr', ocrRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
```

### 12.2 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ocr/extract` | Upload image, run server-side Tesseract OCR |
| `POST` | `/api/ai/extract` | Send OCR text to Gemini, get structured JSON |
| `POST` | `/api/ai/chat` | Chat with AI about profile/documents |
| `GET`  | `/api/profile` | Get profile (future: from DB) |
| `PUT`  | `/api/profile` | Update profile |
| `POST` | `/api/documents/upload` | Upload document file |
| `GET`  | `/api/documents` | List all documents |
| `DELETE` | `/api/documents/:id` | Delete a document |

### 12.3 OCR Controller (`ocr.controller.js`)

```javascript
import { ocrService } from '../services/ocrService.js';
import { responseHelper } from '../utils/responseHelper.js';

export const extractText = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(responseHelper.error('No file uploaded'));
    }
    
    const { documentType = 'unknown' } = req.body;
    
    // Run OCR on the uploaded file
    const text = await ocrService.extractText(req.file.buffer, req.file.mimetype);
    
    res.json(responseHelper.success({
      text,
      documentType,
      filename: req.file.originalname,
      processingTime: Date.now() - req.startTime,
    }));
  } catch (error) {
    next(error);
  }
};
```

### 12.4 AI Controller (`ai.controller.js`)

```javascript
import { geminiService } from '../services/geminiService.js';
import { responseHelper } from '../utils/responseHelper.js';

export const extractProfile = async (req, res, next) => {
  try {
    const { ocrText, documentType } = req.body;
    
    if (!ocrText) {
      return res.status(400).json(responseHelper.error('OCR text is required'));
    }
    
    const profileData = await geminiService.extractProfileFromText(ocrText, documentType);
    
    res.json(responseHelper.success({
      profileData,
      fieldsExtracted: Object.keys(profileData).filter(k => profileData[k] !== null).length,
    }));
  } catch (error) {
    next(error);
  }
};
```

### 12.5 Error Handler (`middleware/errorHandler.js`)

```javascript
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  
  const status = err.status || err.statusCode || 500;
  
  res.status(status).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
```

---

## Phase 13 – Final Polish & Production Readiness

### 13.1 Dark Mode

```javascript
// ThemeContext.jsx
// Detects system preference via prefers-color-scheme
// Toggles 'dark' class on document.documentElement
// Persists preference in localStorage
```

All components use Tailwind dark: variants:
```jsx
<div className="bg-white dark:bg-secondary text-secondary dark:text-white">
```

### 13.2 Loading States & Skeletons

Every data-dependent component has:
1. `<Skeleton>` loading state
2. Empty state with illustration + CTA
3. Error state with retry button

### 13.3 Toast Notifications

Using `react-hot-toast` with custom styled toasts:
- ✅ Profile saved successfully
- ✅ Document processed (8 fields extracted)
- ⚠️ Some fields could not be extracted
- ❌ OCR failed – please try a clearer image
- ⚡ Auto-fill complete: 14 fields filled

### 13.4 Form Validation

All forms use React Hook Form + Zod:
```javascript
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use DD/MM/YYYY format'),
  // ...
});
```

### 13.5 Responsive Design

Breakpoints used:
- Mobile: < 640px (single column, bottom tab nav)
- Tablet: 640–1024px (2-column grids, collapsed sidebar)
- Desktop: > 1024px (full layout, expanded sidebar)

### 13.6 Performance Optimizations

- Code splitting via React.lazy + Suspense for each route
- Image compression before OCR processing
- Debounce profile auto-save (500ms)
- Tesseract.js worker reuse (don't create new worker per OCR)
- Memoize field mappings with useMemo

### 13.7 Accessibility

- All interactive elements have `aria-label`
- Keyboard navigation support
- Focus management in modals
- Color contrast meets WCAG AA
- Screen reader announcements for dynamic content

### 13.8 Security

- API key in `.env` (never in frontend for production)
- File type validation on upload (MIME type + extension)
- File size limits (10MB)
- Sanitize extracted text before sending to Gemini
- Rate limiting on AI endpoints (5 requests/minute per IP)
- Input sanitization on all form fields

### 13.9 README Documentation

```markdown
# ApplyOnce AI

> Upload Once. Apply Anywhere.

## Setup
1. Clone repo
2. Copy .env.example to .env
3. Add your Gemini API key
4. npm install (root)
5. npm run dev

## Chrome Extension
1. Go to chrome://extensions
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the /extension folder

## Project Structure
[... folder structure ...]
```

---

## Environment Variables Reference

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_GEMINI_API_KEY` | `.env` | Gemini API access (client-side, dev only) |
| `GEMINI_API_KEY` | `.env` | Gemini API access (server-side, production) |
| `PORT` | `.env` | Express server port (default: 3001) |
| `NODE_ENV` | `.env` | `development` or `production` |
| `VITE_API_BASE_URL` | `.env` | Backend URL for API calls |
| `CLIENT_URL` | `.env` | Frontend URL for CORS |

---

## Technology Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Frontend Framework | React 19 | Modern, ecosystem, fast with Vite |
| Styling | Tailwind CSS | Utility-first, fast, consistent |
| Animations | Framer Motion | Best React animation library |
| OCR | Tesseract.js | Free, browser-native, no API cost |
| AI Extraction | Google Gemini | Multimodal, JSON mode, free tier |
| Form Library | React Hook Form | Performance, integration with Zod |
| Schema Validation | Zod | TypeScript-compatible, composable |
| State | React Context | Simple enough for MVP, no Redux needed |
| Storage | LocalStorage | Zero infrastructure for MVP |
| HTTP Client | Axios | Interceptors, error handling, easy |
| Extension | MV3 | Modern, required by Chrome since 2024 |

---

## Dependency List

### Client (`client/package.json`)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "axios": "^1.x",
    "tesseract.js": "^5.x",
    "@google/generative-ai": "^0.x",
    "react-dropzone": "^14.x",
    "react-hot-toast": "^2.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "@tailwindcss/forms": "^0.x",
    "@tailwindcss/typography": "^0.x"
  }
}
```

### Server (`server/package.json`)

```json
{
  "dependencies": {
    "express": "^4.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "multer": "^1.x",
    "helmet": "^7.x",
    "morgan": "^1.x",
    "@google/generative-ai": "^0.x",
    "tesseract.js": "^5.x",
    "express-rate-limit": "^7.x",
    "uuid": "^9.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

---

## Testing Strategy

### Unit Tests
- `ocrService.js` – mock Tesseract, test progress callback
- `geminiService.js` – mock API, test prompt building, JSON parsing
- `fieldMapper.js` – test scoring against known field labels
- `autoFiller.js` – test fill logic with DOM mocks
- `storageService.js` – test CRUD with mocked localStorage

### Integration Tests
- Full upload → OCR → Gemini → profile save flow
- Auto-fill flow with a sample form DOM

### E2E Tests (Playwright)
- Landing page renders and CTAs work
- Document upload flow end-to-end
- Profile editing and saving
- Demo form auto-fill

### Manual Testing Checklist
- [ ] Upload Aadhaar image → verify name, DOB, gender extracted
- [ ] Upload resume PDF → verify skills, experience extracted
- [ ] Edit extracted profile → verify changes persist
- [ ] Open demo form → click Auto-Fill → verify fields filled correctly
- [ ] Install extension → visit a test form → verify popup shows field count
- [ ] Click Auto-Fill in extension → verify fields filled + color coded
- [ ] Dark mode toggle works on all pages
- [ ] Mobile responsive on iPhone 14 viewport
- [ ] All toasts appear for success/error states
- [ ] Empty states render when no documents uploaded

---

## Build & Deployment

### Development

```bash
# From root
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:3001
```

### Production Build

```bash
npm run build        # Builds client to client/dist
npm run start        # Starts Express server (serves API + static)
```

### Chrome Extension

```
1. Build is NOT required – load /extension folder directly
2. Open chrome://extensions
3. Enable Developer Mode (top right toggle)
4. Click "Load unpacked"
5. Select: applyonce-ai/extension/
6. Extension appears in toolbar
```

---

> **Implementation Note for AI Agents:**
> Follow the phases in order. Each phase builds on the previous.
> Complete Phase 1-3 (scaffold + landing) before starting Phase 6 (OCR).
> The field mapping engine (Phase 11) is the most critical component—
> spend extra time making it accurate and extensible.
> Never skip error handling or loading states—they define production quality.
