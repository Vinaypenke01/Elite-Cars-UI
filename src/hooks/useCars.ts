import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCars, getCarById, getFeaturedCars, addCar, updateCar, deleteCar, Car } from '@/services/api.service';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch all cars
 */
export const useCars = () => {
    return useQuery({
        queryKey: ['cars'],
        queryFn: getCars,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch a single car by ID
 */
export const useCar = (id: string) => {
    return useQuery({
        queryKey: ['car', id],
        queryFn: () => getCarById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch featured cars
 */
export const useFeaturedCars = () => {
    return useQuery({
        queryKey: ['cars', 'featured'],
        queryFn: getFeaturedCars,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook to add a new car (Admin only)
 */
export const useAddCar = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (carData: Omit<Car, 'id'>) => addCar(carData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            toast({
                title: 'Success',
                description: 'Car added successfully',
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

/**
 * Hook to update a car (Admin only)
 */
export const useUpdateCar = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Car> }) => updateCar(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.invalidateQueries({ queryKey: ['car', variables.id] });
            toast({
                title: 'Success',
                description: 'Car updated successfully',
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

/**
 * Hook to delete a car (Admin only)
 */
export const useDeleteCar = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => deleteCar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            toast({
                title: 'Success',
                description: 'Car deleted successfully',
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
