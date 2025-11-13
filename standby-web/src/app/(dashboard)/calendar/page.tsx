'use client'

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Plus, Bell } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Kalender</h1>
        <p className="text-muted-foreground mt-2">
          Organisiere Uni, Arbeit und Freizeit an einem Ort
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl mb-2">Kalender-Modul in Entwicklung</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            Bald verfügbar: Event-Management, Kategorien, Erinnerungen und wiederkehrende Termine.
          </CardDescription>
          <div className="flex gap-4">
            <Button variant="outline" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Termin hinzufügen
            </Button>
            <Button variant="outline" disabled>
              <Bell className="mr-2 h-4 w-4" />
              Erinnerungen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
