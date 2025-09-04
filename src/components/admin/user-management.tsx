'use client';
import { useState } from 'react';
import type { UserData } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { updateUserRole, updateUserStatus } from '@/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export function UserManagement({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const handleUpdate = async (uid: string, data: Partial<UserData>) => {
    try {
      const updatedUser = await (data.role ? updateUserRole(uid, data.role) : updateUserStatus(uid, data.status!));
      setUsers(currentUsers => currentUsers.map(u => u.uid === uid ? updatedUser : u));
      toast({ title: 'Success', description: 'User has been updated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user.' });
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.displayName}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} 
                    className={cn(user.status === 'active' && "border-green-500 text-green-600")}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={user.uid === currentUser?.uid}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdate(user.uid, { role: user.role === 'admin' ? 'user' : 'admin' })}>
                      Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdate(user.uid, { status: user.status === 'active' ? 'blocked' : 'active' })}>
                      {user.status === 'active' ? 'Block' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
