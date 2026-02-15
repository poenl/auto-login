import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserInfo {
  name: string
  avatar: string
}

interface UserStore {
  userInfo: UserInfo
  setUserInfo: (userInfo: UserInfo) => void
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      userInfo: {
        name: '',
        avatar: ''
      },
      setUserInfo: (userInfo) => set({ userInfo })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
