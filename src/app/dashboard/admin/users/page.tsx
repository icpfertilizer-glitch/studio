import { UserManagement } from "@/components/admin/user-management";
import { getFirebaseAdmin } from "@/lib/firebase/firebase-admin";
import type { UserData } from "@/types";

async function getUsers() {
    try {
        const admin = getFirebaseAdmin();
        const db = admin.database();
        const snapshot = await db.ref('users').get();
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            return Object.values(usersData) as UserData[];
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        // This can happen in dev if service account is not set
        return [];
    }
}

export default async function UserManagementPage() {
    const users = await getUsers();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage user roles and statuses.</p>
            </header>
            <UserManagement initialUsers={users} />
        </div>
    );
}