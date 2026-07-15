import { create } from 'zustand'
import { storageService } from '../../services/storageService'

export const useProfileStore = create((set, get) => ({
  profile: storageService.getProfile(),
  history: storageService.getHistory(),
  analytics: storageService.getAnalytics(),
  
  updateProfile: (patch) =>
    set((state) => {
      const updated = {
        ...state.profile,
        ...patch,
        address: patch.address 
          ? { ...state.profile.address, ...patch.address }
          : state.profile.address,
        emergencyContact: patch.emergencyContact
          ? { ...state.profile.emergencyContact, ...patch.emergencyContact }
          : state.profile.emergencyContact,
        socialLinks: patch.socialLinks
          ? { ...state.profile.socialLinks, ...patch.socialLinks }
          : state.profile.socialLinks,
        preferences: patch.preferences
          ? { ...state.profile.preferences, ...patch.preferences }
          : state.profile.preferences,
        metadata: patch.metadata
          ? { ...state.profile.metadata, ...patch.metadata }
          : state.profile.metadata,
      }
      storageService.saveProfile(updated)
      return { profile: updated }
    }),
    
  setProfile: (newProfile) =>
    set(() => {
      storageService.saveProfile(newProfile)
      return { profile: newProfile }
    }),
    
  clearProfile: () =>
    set(() => {
      storageService.clearProfile()
      return { profile: storageService.getProfile() }
    }),

  // --- History ---
  recordFill: ({ fieldsFilled, website }) => {
    storageService.recordFill({ fieldsFilled, website })
    set({
      history: storageService.getHistory(),
      analytics: storageService.getAnalytics(),
    })
  },

  refreshHistory: () =>
    set({
      history: storageService.getHistory(),
      analytics: storageService.getAnalytics(),
    }),

  clearHistory: () => {
    storageService.clearHistory()
    storageService.clearAnalytics()
    set({
      history: [],
      analytics: storageService.getAnalytics(),
    })
  },
}))

// Backward compatible helper hook to minimize import refactoring
export const useProfile = () => {
  const profile = useProfileStore((state) => state.profile)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const setProfile = useProfileStore((state) => state.setProfile)
  const clearProfile = useProfileStore((state) => state.clearProfile)
  
  return {
    profile,
    updateProfile,
    setProfile,
    clearProfile
  }
}

export const useAnalytics = () => {
  const analytics = useProfileStore((state) => state.analytics)
  const history = useProfileStore((state) => state.history)
  const recordFill = useProfileStore((state) => state.recordFill)
  const refreshHistory = useProfileStore((state) => state.refreshHistory)
  const clearHistory = useProfileStore((state) => state.clearHistory)

  return {
    analytics,
    history,
    recordFill,
    refreshHistory,
    clearHistory,
  }
}
