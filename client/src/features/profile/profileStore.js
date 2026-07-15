import { create } from 'zustand'
import { storageService } from '../../services/storageService'

export const useProfileStore = create((set) => ({
  profile: storageService.getProfile(),
  
  updateProfile: (patch) =>
    set((state) => {
      const updated = {
        ...state.profile,
        ...patch,
        address: patch.address 
          ? { ...state.profile.address, ...patch.address }
          : state.profile.address,
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
