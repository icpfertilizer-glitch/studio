'use client';

import { useState } from 'react';
import type { Booking, Room } from '@/types';
import { addHours, format, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { BookingModal } from './booking-modal';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { PlusCircle, User, Edit } from 'lucide-react';
import { deleteBooking } from '@/actions/booking';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';

interface BookingCalendarProps {
  rooms: Room[];
  bookings: Booking[];
  currentDate: Date;
}

export function BookingCalendar({ rooms, bookings, currentDate }: BookingCalendarProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    booking: Partial<Booking> | null;
  }>({ isOpen: false, booking: null });
  const { userData } = useAuth();
  const { toast } = useToast();

  const timeSlots: Date[] = [];
  let startTime = 8;
  const endTime = 18;
  for (let i = startTime; i < endTime; i++) {
    timeSlots.push(setMinutes(setHours(startOfDay(currentDate), i), 0));
  }

  const getBookingForSlot = (roomId: string, slot: Date) => {
    return bookings.find(
      (b) =>
        b.roomId === roomId &&
        b.date === format(currentDate, 'yyyy-MM-dd') &&
        b.startTime === format(slot, 'HH:mm')
    );
  };
  
  const handleSlotClick = (room: Room, slot: Date) => {
    const bookingTime = new Date(`${format(currentDate, 'yyyy-MM-dd')}T${format(slot, 'HH:mm')}`);
    const now = new Date();
    // Allow booking past times on the current day
    // if (isBefore(bookingTime, now) && format(currentDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
    //   return;
    // }

    const newBooking: Partial<Booking> = {
      roomId: room.id,
      date: format(currentDate, 'yyyy-MM-dd'),
      startTime: format(slot, 'HH:mm'),
      endTime: format(addHours(slot, 1), 'HH:mm'),
      userId: userData?.uid,
      userDisplayName: userData?.displayName,
    };
    setModalState({ isOpen: true, booking: newBooking });
  };
  
  const handleEditClick = (booking: Booking) => {
    setModalState({ isOpen: true, booking });
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      toast({ title: "Success", description: "Booking has been deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete booking." });
    }
  };


  return (
    <>
      <div className="grid gap-px overflow-x-auto bg-border" style={{gridTemplateColumns: `10rem repeat(${timeSlots.length}, minmax(8rem, 1fr))`}}>
        <div className="sticky left-0 z-10 p-2 font-semibold bg-card text-card-foreground">Room</div>
        {timeSlots.map((slot, i) => (
          <div key={i} className="p-2 text-center font-semibold bg-card text-card-foreground">
            {format(slot, 'HH:mm')}
          </div>
        ))}

        {rooms.map((room) => (
          <>
            <div key={room.id} className="sticky left-0 z-10 p-2 font-semibold bg-card text-card-foreground flex items-center">
              <div>
                <p>{room.name}</p>
                <p className="text-sm font-normal text-muted-foreground">{room.location}</p>
              </div>
            </div>
            {timeSlots.map((slot, i) => {
              const booking = getBookingForSlot(room.id, slot);
              const isPast = isBefore(new Date(`${format(currentDate, 'yyyy-MM-dd')}T${format(slot, 'HH:mm')}`), new Date()) && format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const canModify = userData?.role === 'admin' || (booking && booking.userId === userData?.uid);

              if (booking) {
                return (
                  <div key={i} className="group relative min-h-[6rem] bg-primary/20 border-l-4 border-primary p-2 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold truncate text-primary-foreground">{booking.topic}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3"/> {booking.userDisplayName}
                      </p>
                    </div>
                    {canModify && (
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditClick(booking)}>
                                <Edit className="h-4 w-4"/>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground">
                                        <PlusCircle className="h-4 w-4 rotate-45"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the booking for "{booking.topic}".
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(booking.id)} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={i} className={cn("group min-h-[6rem] bg-background hover:bg-accent transition-colors", isPast ? 'bg-secondary/50' : 'cursor-pointer')} onClick={() => !isPast && handleSlotClick(room, slot)}>
                    { !isPast &&
                        <div className="flex h-full w-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlusCircle className="h-6 w-6 text-muted-foreground"/>
                        </div>
                    }
                </div>
              );
            })}
          </>
        ))}
      </div>
      
      <BookingModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, booking: null })}
        booking={modalState.booking}
        rooms={rooms}
      />
    </>
  );
}
