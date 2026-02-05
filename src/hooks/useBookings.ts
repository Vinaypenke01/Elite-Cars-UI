import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBooking, getBookings, getBookingById, updateBookingStatus, Booking } from '@/services/api.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to create a new booking
 */
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>) => createBooking(bookingData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast({
                title: 'Booking Confirmed',
                description: 'Your test drive has been scheduled successfully!',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Booking Failed',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
};

/**
 * Hook to fetch all bookings (Admin only)
 */
export const useBookings = () => {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: getBookings,
    });
};

/**
 * Hook to fetch a single booking by ID
 */
export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => getBookingById(id),
        enabled: !!id,
    });
};

/**
 * Hook to update booking status (Admin only)
 */
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
            updateBookingStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
            toast({
                title: 'Success',
                description: 'Booking status updated successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
};
