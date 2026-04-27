import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { LayoutProvider } from '@/components/LayoutContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="h-screen overflow-hidden flex bg-(--background) text-(--foreground)">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <Header />
          <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12 custom-scrollbar">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  )
}

