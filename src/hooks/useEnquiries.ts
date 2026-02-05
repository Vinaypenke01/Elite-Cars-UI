import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl, getAuthHeaders } from '@/config/api.config';
import { toast } from 'sonner';

interface EnquiryData {
    car: number;
    customer_name: string;
    email: string;
    phone: string;
    message?: string;
}

interface EnquiryResponse {
    id: number;
    car: number;
    customer_name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
}

export const useCreateEnquiry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EnquiryData): Promise<EnquiryResponse> => {
            const response = await fetch(getApiUrl('/orders/enquiries/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(), // Assuming getAuthHeaders might be needed for authenticated requests
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || 'Failed to submit enquiry');
            }

            const body = await response.json();
            return body.data || body;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enquiries'] });
            toast.success('Enquiry submitted successfully!', {
                description: "We'll contact you soon.",
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to submit enquiry';
            toast.error('Error', {
                description: errorMessage,
            });
        },
    });
};
