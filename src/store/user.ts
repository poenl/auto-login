import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
  name: string
  avatar: string
}

interface UserStore {
  userInfo: UserInfo
  setUserInfo: (userInfo: UserInfo) => void
  clearUserInfo: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {
        name: '',
        avatar: ''
      },
      setUserInfo: (userInfo) => set({ userInfo }),
      clearUserInfo: () => set({ userInfo: { name: '', avatar: '' } })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ userInfo: state.userInfo })
    }
  )
)
