'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChefHat, Search, Heart } from 'lucide-react'

export default function RecipesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Rezepte</h1>
        <p className="text-muted-foreground mt-2">
          Entdecke leckere und günstige Rezepte für jeden Geschmack
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl mb-2">Rezepte-Modul in Entwicklung</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            Bald verfügbar: 300+ leckere Rezepte mit Filtern, Favoriten und Einkaufsliste.
            Bleib dran!
          </CardDescription>
          <div className="flex gap-4">
            <Button variant="outline" disabled>
              <Search className="mr-2 h-4 w-4" />
              Rezepte durchsuchen
            </Button>
            <Button variant="outline" disabled>
              <Heart className="mr-2 h-4 w-4" />
              Meine Favoriten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
