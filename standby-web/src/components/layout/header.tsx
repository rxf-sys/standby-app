'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { authService } from '@/lib/services/auth.service'
import { toast } from '@/lib/hooks/use-toast'
import { LogOut, Moon, Sun, Settings } from 'lucide-react'
import { useThemeStore } from '@/lib/store'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { themeMode, setThemeMode } = useThemeStore()

  const handleLogout = async () => {
    try {
      await authService.signOut()
      logout()
      toast({
        title: 'Erfolgreich abgemeldet',
        description: 'Bis bald!',
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Fehler beim Abmelden',
        description: 'Bitte versuche es erneut.',
        variant: 'destructive',
      })
    }
  }

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              Stand<span className="text-primary">By</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline">
            Hallo, {user?.name}!
          </span>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {themeMode === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
