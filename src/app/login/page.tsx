'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const MicrosoftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.235 11.235H1.5V1.5H11.235V11.235Z" fill="#F25022"/>
        <path d="M22.5 11.235H12.765V1.5H22.5V11.235Z" fill="#7FBA00"/>
        <path d="M11.235 22.5H1.5V12.765H11.235V22.5Z" fill="#00A4EF"/>
        <path d="M22.5 22.5H12.765V12.765H22.5V22.5Z" fill="#FFB900"/>
    </svg>
  );

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <DoorOpen className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Loading your space...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <DoorOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">MeetingSphere</CardTitle>
          <CardDescription>Elegant room booking for modern teams.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button onClick={signIn} size="lg" className="w-full text-base font-semibold">
              <MicrosoftIcon />
              Sign in with Microsoft
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Use your company's Office 365 account to continue.
            </p>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MeetingSphere. All rights reserved.</p>
      </footer>
    </main>
  );
}
