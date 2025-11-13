import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, ChefHat, Calendar, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Willkommen bei <span className="text-primary">StandBy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Die All-in-One-App für dein selbstständiges Leben. Budget verwalten, Rezepte finden,
            Termine planen – alles an einem Ort.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">Jetzt starten</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Anmelden</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Budget</CardTitle>
              <CardDescription>
                Verwalte deine Finanzen, tracke Ausgaben und erreiche deine Sparziele
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <ChefHat className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Rezepte</CardTitle>
              <CardDescription>
                300+ leckere Rezepte mit Filter nach Preis, Zeit und Ernährungsform
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Kalender</CardTitle>
              <CardDescription>
                Organisiere Uni, Arbeit und Freizeit mit einem übersichtlichen Kalender
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Sparziele</CardTitle>
              <CardDescription>
                Setze dir Ziele und verfolge deinen Fortschritt auf dem Weg dorthin
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-6">
          <h2 className="text-3xl font-bold">Bereit durchzustarten?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Erstelle jetzt dein kostenloses Konto und starte in dein selbstständiges Leben
          </p>
          <Button asChild size="lg">
            <Link href="/auth/register">Kostenlos registrieren</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
