const key = 'applyonce-profile'

export const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: {
    full: '',
    city: '',
    state: '',
    pincode: '',
  },
  aadhaarNumber: '',
  panNumber: '',
  education: [],
  experience: [],
  skills: [],
  documents: [],
}

export const storageService = {
  getProfile: () => {
    try {
      return { ...defaultProfile, ...JSON.parse(localStorage.getItem(key) || '{}') }
    } catch {
      return defaultProfile
    }
  },
  saveProfile: (p) => {
    localStorage.setItem(key, JSON.stringify(p))
    // Sync profile data to Chrome Extension content script via postMessage
    try {
      window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: p }, '*')
    } catch (e) {
      console.warn('Could not post sync message to extension', e)
    }
  },
  clearProfile: () => {
    localStorage.removeItem(key)
    try {
      window.postMessage({ type: 'APPLYONCE_SYNC_PROFILE', profile: defaultProfile }, '*')
    } catch (e) {
      console.warn('Could not post sync message to extension', e)
    }
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
