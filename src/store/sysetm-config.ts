import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface SystemConfig {
  theme: Theme
  setTheme: (theme: Theme) => void
  switchTheme: () => void
}

export const useSystemConfigStore = create<SystemConfig>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  switchTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
}))
