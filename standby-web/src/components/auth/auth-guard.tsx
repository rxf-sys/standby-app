'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { authService } from '@/lib/services/auth.service'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, setUser, setLoading, login } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const session = await authService.getSession()

        if (!session) {
          router.push('/auth/login')
          return
        }

        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          login(currentUser)
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
