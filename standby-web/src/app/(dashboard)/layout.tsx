import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
