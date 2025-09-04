'use server';

import { getFirebaseAdmin } from '@/lib/firebase/firebase-admin';
import type { Booking } from '@/types';
import { revalidatePath } from 'next/cache';

const admin = getFirebaseAdmin();
const db = admin.database();

export async function saveBooking(booking: Partial<Booking>): Promise<void> {
  if (!booking.roomId || !booking.date || !booking.startTime || !booking.userId) {
    throw new Error('Missing required booking information.');
  }

  const bookingsRef = db.ref('bookings');
  
  // Server-side check for double booking
  const snapshot = await bookingsRef.orderByChild('roomId').equalTo(booking.roomId).get();
  if (snapshot.exists()) {
    const existingBookings = snapshot.val();
    const conflict = Object.values(existingBookings).some((b: any) => 
        b.date === booking.date && b.startTime === booking.startTime && b.id !== booking.id
    );
    if(conflict) {
        throw new Error('This time slot is already booked.');
    }
  }
  
  if (booking.id) {
    // Update existing booking
    await db.ref(`bookings/${booking.id}`).update(booking);
  } else {
    // Create new booking
    const newBookingRef = bookingsRef.push();
    await newBookingRef.set({ ...booking, id: newBookingRef.key });
  }

  revalidatePath('/dashboard');
  revalidatePath('/monitor');
}

export async function deleteBooking(bookingId: string): Promise<void> {
    if (!bookingId) {
        throw new Error('Booking ID is required.');
    }
    await db.ref(`bookings/${bookingId}`).remove();

    revalidatePath('/dashboard');
    revalidatePath('/monitor');
}
