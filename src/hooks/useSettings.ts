import { useQuery } from '@tanstack/react-query';
import { getDealershipSettings } from '@/services/api.service';
import type { DealershipSettings } from '@/types';

export const useSettings = () => {
    const { data: settings, isLoading } = useQuery({
        queryKey: ['dealershipSettings'],
        queryFn: getDealershipSettings
    });

    // Fallback defaults if no settings found
    const defaultSettings: DealershipSettings = {
        id: 0,
        address: '123 Luxury Lane, Beverly Hills, CA 90210',
        phone: '+1 (555) 123-4567',
        email: 'info@elitecars.com',
        business_hours: {
            mon_sat: '9:00 AM - 7:00 PM',
            sunday: '10:00 AM - 5:00 PM'
        }
    };

    const contactInfo = settings || defaultSettings;

    return {
        settings: contactInfo,
        isLoading
    };
};
