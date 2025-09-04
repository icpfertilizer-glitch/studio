'use server';
/**
 * @fileOverview Access control flow that checks user status before allowing login.
 *
 * - checkUserStatus - A function that checks if a user is blocked.
 * - CheckUserStatusInput - The input type for the checkUserStatus function.
 * - CheckUserStatusOutput - The return type for the checkUserStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirebaseAdmin} from '@/lib/firebase/firebase-admin';

const CheckUserStatusInputSchema = z.object({
  uid: z.string().describe('The Firebase UID of the user.'),
});
export type CheckUserStatusInput = z.infer<typeof CheckUserStatusInputSchema>;

const CheckUserStatusOutputSchema = z.object({
  isBlocked: z.boolean().describe('Whether the user is blocked or not.'),
});
export type CheckUserStatusOutput = z.infer<typeof CheckUserStatusOutputSchema>;

export async function checkUserStatus(input: CheckUserStatusInput): Promise<CheckUserStatusOutput> {
  return checkUserStatusFlow(input);
}

const checkUserStatusFlow = ai.defineFlow(
  {
    name: 'checkUserStatusFlow',
    inputSchema: CheckUserStatusInputSchema,
    outputSchema: CheckUserStatusOutputSchema,
  },
  async input => {
    const admin = getFirebaseAdmin();
    const db = admin.database();
    const userRef = db.ref(`users/${input.uid}`);
    const snapshot = await userRef.get();
    const userData = snapshot.val();

    const isBlocked = userData?.status === 'blocked';

    return {isBlocked};
  }
);
