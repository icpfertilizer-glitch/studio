'use server';

import { getFirebaseAdmin } from "@/lib/firebase/firebase-admin";
import type { UserData } from "@/types";
import { revalidatePath } from "next/cache";

const admin = getFirebaseAdmin();
const db = admin.database();

async function updateUser(uid: string, data: Partial<UserData>): Promise<UserData> {
    if(!uid) throw new Error("User ID is required.");
    const userRef = db.ref(`users/${uid}`);
    await userRef.update(data);
    const snapshot = await userRef.get();
    revalidatePath('/dashboard/admin/users');
    return snapshot.val() as UserData;
}

export async function updateUserRole(uid: string, role: 'admin' | 'user'): Promise<UserData> {
    return updateUser(uid, { role });
}

export async function updateUserStatus(uid: string, status: 'active' | 'blocked'): Promise<UserData> {
    if (status === 'blocked') {
        // Optional: Also disable the user in Firebase Auth
        try {
            await admin.auth().updateUser(uid, { disabled: true });
        } catch(e) {
            console.warn(`Could not disable user in Auth: ${(e as Error).message}`);
        }
    } else {
         // Optional: Also enable the user in Firebase Auth
         try {
            await admin.auth().updateUser(uid, { disabled: false });
        } catch(e) {
            console.warn(`Could not enable user in Auth: ${(e as Error).message}`);
        }
    }
    return updateUser(uid, { status });
}
