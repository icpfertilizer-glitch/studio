'use client';

import { useState, useEffect } from 'react';
import type { Room, Booking } from '@/types';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '@/lib/firebase/client';
import { format } from 'date-fns';

interface MonitorViewProps {
  initialRooms: Room[];
}

export function MonitorView({ initialRooms }: MonitorViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState<Record<string, Booking | null>>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const bookingsQuery = query(
      ref(db, 'bookings'),
      orderByChild('date'),
      equalTo(todayStr)
    );

    const unsubscribe = onValue(bookingsQuery, (snapshot) => {
      const allTodaysBookings: Booking[] = [];
      snapshot.forEach(childSnapshot => {
        allTodaysBookings.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });

      const nowStr = format(new Date(), 'HH:mm');
      const currentBookings: Record<string, Booking | null> = {};

      rooms.forEach(room => {
        const roomBooking = allTodaysBookings.find(b => 
            b.roomId === room.id &&
            b.startTime <= nowStr &&
            b.endTime > nowStr
        );
        currentBookings[room.id] = roomBooking || null;
      });

      setBookings(currentBookings);
    });

    return () => unsubscribe();
  }, [rooms]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-black/90">
      <header className="absolute top-8 right-8 text-right">
        <h1 className="text-5xl font-bold">{format(currentTime, 'HH:mm:ss')}</h1>
        <p className="text-2xl text-gray-400">{format(currentTime, 'eeee, MMMM d, yyyy')}</p>
      </header>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {rooms.map(room => {
          const booking = bookings[room.id];
          const isInUse = !!booking;
          
          return (
            <div key={room.id} className="neon-border relative rounded-xl border-2 bg-gray-900 p-6 transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-bold truncate text-white">{room.name}</h2>
                <span className={`text-xl font-semibold ${isInUse ? 'text-orange-400' : 'text-green-400'}`}>
                    {isInUse ? 'In Use' : 'Available'}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{room.location}</p>
              
              <div className="h-24">
                {isInUse && booking ? (
                    <div className="space-y-2">
                        <p className="text-xl font-medium text-gray-200 truncate">{booking.topic}</p>
                        <p className="text-gray-400">Booked by: <span className="font-semibold text-gray-300">{booking.userDisplayName}</span></p>
                        <p className="text-gray-400">Time: <span className="font-semibold text-gray-300">{booking.startTime} - {booking.endTime}</span></p>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-2xl text-green-400/50">Open</p>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
