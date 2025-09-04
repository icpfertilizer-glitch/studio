'use client';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase/client';
import type { Room, Booking } from '@/types';
import { BookingCalendar } from '@/components/booking-calendar';
import { Button } from '@/components/ui/button';
import { addDays, format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const roomsRef = ref(db, 'rooms');
    const bookingsRef = ref(db, 'bookings');

    const roomsUnsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRooms: Room[] = data
        ? Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Room, 'id'>),
          })).filter(room => room.isActive)
        : [];
      setRooms(loadedRooms);
      setLoading(false);
    });

    const bookingsUnsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedBookings: Booking[] = data
        ? Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Booking, 'id'>),
          }))
        : [];
      setBookings(loadedBookings);
    });

    return () => {
      roomsUnsubscribe();
      bookingsUnsubscribe();
    };
  }, []);

  const handleDateChange = (amount: number) => {
    setCurrentDate((prevDate) => addDays(prevDate, amount));
  };
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking Dashboard</h1>
            <p className="text-muted-foreground">
                {format(currentDate, 'eeee, MMMM d, yyyy')}
            </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleDateChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
            Previous Day
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={() => handleDateChange(1)}>
            Next Day
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <BookingCalendar
          rooms={rooms}
          bookings={bookings}
          currentDate={currentDate}
        />
      )}
    </div>
  );
}
