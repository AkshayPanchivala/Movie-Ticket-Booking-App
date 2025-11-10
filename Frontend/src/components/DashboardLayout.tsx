import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-[1800px] mx-auto w-full">
            <div className="cinema-gradient rounded-2xl p-1 shadow-xl">
              <div className="bg-background/95 rounded-2xl p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
