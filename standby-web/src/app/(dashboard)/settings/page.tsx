'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuthStore, useThemeStore } from '@/lib/store'
import { Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react'
import { ThemeMode } from '@/lib/store/theme.store'

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const { themeMode, setThemeMode } = useThemeStore()

  const themes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Hell', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dunkel', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground mt-2">Verwalte dein Konto und deine Präferenzen</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Deine persönlichen Informationen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={user?.name || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled />
          </div>
          <Button variant="outline" disabled>
            Profil bearbeiten
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Design</CardTitle>
          <CardDescription>Wähle dein bevorzugtes Theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setThemeMode(theme.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  themeMode === theme.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                {theme.icon}
                <span className="text-sm font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungen</CardTitle>
          <CardDescription>Verwalte deine Benachrichtigungs-Präferenzen</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Benachrichtigungseinstellungen werden in einer zukünftigen Version verfügbar sein.
          </p>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
          <CardDescription>Unwiderrufliche Account-Aktionen</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Account löschen
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
