'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Booking, Room } from '@/types';
import { saveBooking } from '@/actions/booking';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Partial<Booking> | null;
  rooms: Room[];
}

const bookingSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
});

export function BookingModal({ isOpen, onClose, booking, rooms }: BookingModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      topic: '',
      contactNumber: '',
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        topic: booking.topic || '',
        contactNumber: booking.contactNumber || '',
      });
    }
  }, [booking, form]);
  
  const roomName = rooms.find(r => r.id === booking?.roomId)?.name || '...';
  
  const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
    if (!booking) return;

    try {
      const bookingToSave: Partial<Booking> = {
        ...booking,
        ...values,
      };
      await saveBooking(bookingToSave);
      toast({
        title: 'Success!',
        description: 'Your booking has been saved.',
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Failed to save booking.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{booking?.id ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
          {booking?.date && (
            <DialogDescription>
              For {roomName} on {format(new Date(booking.date), 'MMMM d, yyyy')} from {booking.startTime} to {booking.endTime}.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly Team Sync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 081-234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Booking'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
