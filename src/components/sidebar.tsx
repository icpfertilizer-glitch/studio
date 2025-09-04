'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  DoorOpen,
  LayoutDashboard,
  LogOut,
  Monitor,
  Shield,
  Users,
  BookCopy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/monitor', icon: Monitor, label: 'Monitor View' },
];

const adminNavItems = [
  { href: '/dashboard/admin/users', icon: Users, label: 'User Management' },
  { href: '/dashboard/admin/rooms', icon: DoorOpen, label: 'Room Management' },
  { href: '/dashboard/admin/bookings', icon: BookCopy, label: 'Booking History' },
];

export function AppSidebar() {
  const { userData, signOut } = useAuth();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-background p-4 shadow-md">
      <div className="flex items-center gap-3 p-2 mb-4">
        <CalendarDays className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">MeetingSphere</h1>
      </div>
      
      <nav className="flex flex-1 flex-col justify-between">
        <div>
            <ul className="space-y-2">
            {navItems.map((item) => (
                <li key={item.href}>
                <Link href={item.href} target={item.href === '/monitor' ? '_blank' : '_self'}>
                    <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base"
                    >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                    </Button>
                </Link>
                </li>
            ))}
            </ul>

            {userData?.role === 'admin' && (
            <div className="mt-6">
                <Separator className="my-4"/>
                <div className="mb-2 flex items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
                    <Shield className="h-5 w-5"/>
                    Admin Panel
                </div>
                <ul className="space-y-2">
                {adminNavItems.map((item) => (
                    <li key={item.href}>
                    <Link href={item.href}>
                        <Button
                        variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-base"
                        >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                        </Button>
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </div>

        <div>
            <Separator className="my-4"/>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={undefined} alt={userData?.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {userData ? getInitials(userData.displayName) : '...'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold">{userData?.displayName}</p>
                <p className="truncate text-sm text-muted-foreground">{userData?.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
        </div>
      </nav>
    </aside>
  );
}
