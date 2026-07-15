const PROFILE_KEY = 'applyonce-profile'
const HISTORY_KEY = 'applyonce-history'
const ANALYTICS_KEY = 'applyonce-analytics'

export const defaultProfile = {
  // Personal
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',

  // Address
  address: {
    full: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  },

  // Identity Documents
  aadhaarNumber: '',
  panNumber: '',
  passportNumber: '',
  drivingLicense: '',

  // Emergency Contact
  emergencyContact: {
    name: '',
    relation: '',
    phone: '',
  },

  // Social Links
  socialLinks: {
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
  },

  // Languages
  languages: [],

  // Education, Experience, Skills
  education: [],
  experience: [],
  skills: [],
  certificates: [],

  // Documents
  documents: [],

  // Preferences
  preferences: {
    jobType: '',
    location: '',
    salary: '',
    noticePeriod: '',
  },

  // Metadata — source/confidence per field
  metadata: {},
}

export const defaultAnalytics = {
  formsFilled: 0,
  charactersSaved: 0,
  timeSavedSeconds: 0,
  averageAccuracy: 0,
  lastUpdated: null,
}

export const storageService = {
  // --- Profile ---
  getProfile: () => {
    try {
      return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }
    } catch {
      return defaultProfile
    }
  },
  saveProfile: (p) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
    // Sync profile data to Chrome Extension content script via postMessage
    try {
      window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: p }, '*')
    } catch (e) {
      console.warn('Could not post sync message to extension', e)
    }
  },
  clearProfile: () => {
    localStorage.removeItem(PROFILE_KEY)
    try {
      window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: defaultProfile }, '*')
    } catch (e) {
      console.warn('Could not post sync message to extension', e)
    }
  },

  // --- Autofill History ---
  getHistory: () => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    } catch {
      return []
    }
  },
  addHistoryEntry: (entry) => {
    const history = storageService.getHistory()
    history.unshift({
      id: crypto.randomUUID(),
      ...entry,
      timestamp: new Date().toISOString(),
    })
    // Keep only the last 100 entries
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)))
  },
  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY)
  },

  // --- Analytics ---
  getAnalytics: () => {
    try {
      return { ...defaultAnalytics, ...JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}') }
    } catch {
      return defaultAnalytics
    }
  },
  updateAnalytics: (patch) => {
    const current = storageService.getAnalytics()
    const updated = { ...current, ...patch, lastUpdated: new Date().toISOString() }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated))
    return updated
  },
  recordFill: ({ fieldsFilled, website }) => {
    const analytics = storageService.getAnalytics()
    const avgCharsPerField = 18
    const avgSecondsPerField = 8
    const charsSaved = fieldsFilled * avgCharsPerField
    const timeSaved = fieldsFilled * avgSecondsPerField

    storageService.updateAnalytics({
      formsFilled: analytics.formsFilled + 1,
      charactersSaved: analytics.charactersSaved + charsSaved,
      timeSavedSeconds: analytics.timeSavedSeconds + timeSaved,
    })

    storageService.addHistoryEntry({
      website: website || 'Unknown',
      fieldsFilled,
      charactersSaved: charsSaved,
      timeSavedSeconds: timeSaved,
    })
  },
  clearAnalytics: () => {
    localStorage.removeItem(ANALYTICS_KEY)
  },

  // --- Profile Completion ---
  getProfileCompletion: () => {
    const p = storageService.getProfile()
    const checks = [
      !!p.name,
      !!p.email,
      !!p.phone,
      !!p.dob,
      !!p.gender,
      !!p.address?.full,
      !!p.address?.city,
      !!p.address?.state,
      !!p.aadhaarNumber,
      !!p.panNumber,
      p.education?.length > 0,
      p.experience?.length > 0,
      p.skills?.length > 0,
      !!p.socialLinks?.linkedin,
      p.documents?.length > 0,
    ]
    const filled = checks.filter(Boolean).length
    return Math.round((filled / checks.length) * 100)
  },

  // --- Achievements ---
  getAchievements: () => {
    const p = storageService.getProfile()
    return [
      { label: 'Resume Uploaded', done: p.documents?.some(d => d.type === 'Resume / CV') },
      { label: 'Aadhaar Added', done: !!p.aadhaarNumber },
      { label: 'PAN Added', done: !!p.panNumber },
      { label: 'Education Added', done: p.education?.length > 0 },
      { label: 'Experience Added', done: p.experience?.length > 0 },
      { label: 'Skills Listed', done: p.skills?.length > 0 },
      { label: 'LinkedIn Connected', done: !!p.socialLinks?.linkedin },
      { label: 'Profile Complete', done: storageService.getProfileCompletion() >= 80 },
    ]
  },
}

// Handle dynamic requests for profile synchronization from Chrome Extension
try {
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'APPLYONCE_REQUEST_SYNC') {
      window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: storageService.getProfile() }, '*')
    }
  })
  
  // Immediately post current profile on startup to prevent extension loading race conditions
  window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: storageService.getProfile() }, '*')
} catch (e) {
  console.warn('Could not register window message listener', e)
}
