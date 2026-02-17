import { useUserStore } from '@/src/store/user'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  const clearUser = useUserStore((state) => state.clearUserInfo)
  const router = useRouter()

  // 退出登录
  const logout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST'
    })
    if (res.ok) {
      clearUser()
      router.push('/login')
    }
  }
  return logout
}
