import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/config/api.config';

interface Enquiry {
    id: number;
    car_name: string;
    customer_name: string;
    email: string;
    phone: string;
    message: string;
    status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
    created_at: string;
}

export const useEnquiries = () => {
    return useQuery({
        queryKey: ['enquiries'],
        queryFn: async (): Promise<Enquiry[]> => {
            const response = await fetch(getApiUrl('/orders/enquiries/'), {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch enquiries');

            const body = await response.json();
            return body.results || body.data || body;
        },
    });
};

export const useUpdateEnquiryStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const response = await fetch(getApiUrl(`/orders/enquiries/${id}/update_status/`), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Failed to update enquiry status');

            const body = await response.json();
            return body.data || body;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enquiries'] });
        },
    });
};
