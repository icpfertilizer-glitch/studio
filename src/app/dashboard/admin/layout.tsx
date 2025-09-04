'use client';

import { useAuth } from '@/hooks/use-auth';
import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { userData, loading } = useAuth();

  if (loading) {
    return null; // The parent layout already shows a loader
  }

  if (userData?.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldAlert className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You do not have permission to view this page. Please contact an administrator if you believe this is an error.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
