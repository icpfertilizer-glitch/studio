'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { AppSidebar } from '@/components/sidebar';
import { DoorOpen, LoaderCircle } from 'lucide-react';

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a redirect component
  }

  return <>{children}</>;
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 bg-secondary/50">
            {children}
          </main>
        </div>
    </AuthGate>
  );
}
