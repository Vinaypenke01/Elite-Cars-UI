/**
 * Elite Motors - API Services
 * Service layer for Django REST API calls
 */
import { getApiUrl, getAuthHeaders, API_ENDPOINTS } from '@/config/api.config';
import type {
    Manufacturer,
    Car,
    CarList,
    CarFormData,
    Booking,
    AdminProfile,
    RecentlySold,
    DealershipSettings
} from '@/types';

// Export types for compatibility
export type {
    Manufacturer,
    Car,
    CarList,
    CarFormData,
    Booking,
    AdminProfile,
    RecentlySold,
    DealershipSettings
};

// ============ MANUFACTURER SERVICES ============

export const getManufacturers = async (): Promise<Manufacturer[]> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.MANUFACTURERS));
    if (!response.ok) throw new Error('Failed to fetch manufacturers');
    const body = await response.json();
    return body.results || body.data || body;
};

export const addManufacturer = async (data: { name: string; country?: string }): Promise<Manufacturer> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.MANUFACTURERS), {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add manufacturer');
    }
    const body = await response.json();
    return body.data || body;
};

// ============ CAR SERVICES ============

export const getCars = async (): Promise<CarList[]> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.CARS));
    if (!response.ok) throw new Error('Failed to fetch cars');
    const body = await response.json();
    return body.results || body.data || body;
};

export const getCarById = async (id: string): Promise<Car> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.CAR_DETAIL(id)));
    if (!response.ok) throw new Error('Failed to fetch car');
    const body = await response.json();
    return body.data || body;
};

export const getFeaturedCars = async (): Promise<CarList[]> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.FEATURED_CARS));
    if (!response.ok) throw new Error('Failed to fetch featured cars');
    return (await response.json()).data;
};

export const addCar = async (carData: CarFormData): Promise<Car> => {
    const formData = new FormData();

    // Append all car data to FormData
    Object.keys(carData).forEach(key => {
        const typedKey = key as keyof CarFormData;
        const value = carData[typedKey];

        if (key === 'uploaded_images' && value) {
            const files = value as FileList | File[];
            for (let i = 0; i < files.length; i++) {
                formData.append('uploaded_images', files[i]);
            }
        } else if (key === 'feature_names' && value) {
            formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(getApiUrl(API_ENDPOINTS.CARS), {
        method: 'POST',
        headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add car');
    }
    const body = await response.json();
    return body.data || body;
};

export const updateCar = async (id: string, carData: Partial<CarFormData>): Promise<Car> => {
    const formData = new FormData();

    Object.keys(carData).forEach(key => {
        const typedKey = key as keyof CarFormData;
        const value = carData[typedKey];

        if (key === 'uploaded_images' && value) {
            const files = value as FileList | File[];
            for (let i = 0; i < files.length; i++) {
                formData.append('uploaded_images', files[i]);
            }
        } else if (key === 'feature_names' && value) {
            formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(getApiUrl(API_ENDPOINTS.CAR_DETAIL(id)), {
        method: 'PATCH',
        headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update car');
    }
    const body = await response.json();
    return body.data || body;
};

export const deleteCar = async (id: string): Promise<void> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.CAR_DETAIL(id)), {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete car');
};

// ============ BOOKING SERVICES ============

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Booking> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.BOOKINGS), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
    }
    return (await response.json()).data;
};

export const getBookings = async (): Promise<Booking[]> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.BOOKINGS), {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const body = await response.json();
    // Handle both wrapped and paginated results
    return body.results || body.data || body;
};

export const getBookingById = async (id: string): Promise<Booking> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.BOOKING_DETAIL(id)));
    if (!response.ok) throw new Error('Failed to fetch booking');
    const body = await response.json();
    return body.data || body;
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<Booking> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_BOOKING_STATUS(id)), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    return (await response.json()).data;
};

// ============ AUTHENTICATION SERVICES ============

export const registerAdmin = async (
    email: string,
    password: string,
    display_name?: string,
    role: 'admin' | 'super_admin' = 'admin'
): Promise<{ token: string; user: AdminProfile }> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH_REGISTER), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, display_name, role }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register admin');
    }

    const body = await response.json();
    const data = body.data;
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    return data;
};

export const loginAdmin = async (
    email: string,
    password: string
): Promise<{ token: string; user: AdminProfile }> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH_LOGIN), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid credentials');
    }

    const body = await response.json();
    const data = body.data;
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    return data;
};

export const logoutAdmin = async (): Promise<void> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH_LOGOUT), {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    if (!response.ok) throw new Error('Failed to logout');
};

export const getAdminProfile = async (): Promise<AdminProfile> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH_PROFILE), {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin profile');
    return (await response.json()).data;
};

// ============ RECENTLY SOLD SERVICES ============

export const getRecentlySold = async (limit: number = 10): Promise<RecentlySold[]> => {
    const response = await fetch(getApiUrl(`${API_ENDPOINTS.RECENTLY_SOLD}?limit=${limit}`));
    if (!response.ok) throw new Error('Failed to fetch recently sold');
    return (await response.json()).data;
};

export const addCarToRecentlySold = async (carId: number, soldDate?: string): Promise<RecentlySold> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.ADD_CAR_TO_RECENTLY_SOLD), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            car_id: carId,
            sold_date: soldDate
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add car to recently sold');
    }
    return (await response.json()).data;
};


// ============ SETTINGS SERVICES ============

export const getDealershipSettings = async (): Promise<DealershipSettings> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.SETTINGS));
    if (!response.ok) throw new Error('Failed to fetch dealership settings');
    return (await response.json()).data;
};

export const updateDealershipSettings = async (data: Partial<DealershipSettings>): Promise<DealershipSettings> => {
    const response = await fetch(getApiUrl(API_ENDPOINTS.SETTINGS_UPDATE), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update dealership settings');
    return (await response.json()).data;
};
