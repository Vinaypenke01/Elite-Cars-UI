/**
 * Elite Motors - TypeScript Types  
 * Type definitions for the car dealer system
 */

// ============ MANUFACTURER ============
export interface Manufacturer {
    id: number;
    name: string;
    country: string;
}

// ============ CAR IMAGE ============
export interface CarImage {
    id: number;
    image: string;
    image_url: string;
    is_primary: boolean;
}

// ============ CAR FEATURE ============
export interface CarFeature {
    id: number;
    name: string;
}

// ============ CAR ============
export interface Car {
    id: number;
    manufacturer_details: Manufacturer;
    manufacturer_id: number;
    body_type: 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Coupe' | 'Convertible' | 'Pickup';
    model_name: string;
    variant: string;
    model_year: number;
    registration_year: number;
    ownership: '1st Owner' | '2nd Owner' | '3rd Owner';
    kilometers_driven: number;
    fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
    transmission: 'Manual' | 'Automatic' | 'AMT' | 'CVT';
    engine_cc: number;
    mileage: number;
    color: string;
    price: number;
    is_negotiable: boolean;
    insurance_valid_till: string | null;
    rc_available: boolean;
    puc_available: boolean;
    loan_clearance: boolean;
    condition: 'Excellent' | 'Good' | 'Average';
    accident_history: boolean;
    service_history: boolean;
    description: string;
    is_active: boolean;
    created_at: string;
    images: CarImage[];
    features: CarFeature[];
}

// ============ CAR LIST (Lightweight) ============
export interface CarList {
    id: number;
    manufacturer_name: string;
    model_name: string;
    model_year: number;
    price: number;
    body_type: string;
    fuel_type: string;
    transmission: string;
    kilometers_driven: number;
    is_active: boolean;
    primary_image: string | null;
}

// ============ CAR FORM DATA ============
export interface CarFormData {
    manufacturer_id: number;
    body_type: string;
    model_name: string;
    variant?: string;
    model_year: number;
    registration_year: number;
    ownership: string;
    kilometers_driven: number;
    fuel_type: string;
    transmission: string;
    engine_cc: number;
    mileage: number;
    color: string;
    price: number;
    is_negotiable: boolean;
    insurance_valid_till?: string;
    rc_available: boolean;
    puc_available: boolean;
    loan_clearance: boolean;
    condition: string;
    accident_history: boolean;
    service_history: boolean;
    description?: string;
    feature_names?: string[];
    uploaded_images?: FileList | File[];
}

// ============ BOOKING ============
export interface Booking {
    id?: number;
    car_id: number;
    car_name: string;
    package_type: 'basic' | 'premium' | 'ultimate';
    customer_name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at?: string;
    updated_at?: string;
}

// ============ RECENTLY SOLD ============
export interface RecentlySold {
    id?: number;
    car_name: string;
    price: string;
    sold_date: string;
    image: string;
    created_at?: string;
}

// ============ DEALERSHIP SETTINGS ============
export interface DealershipSettings {
    id: number;
    address: string;
    phone: string;
    email: string;
    business_hours: {
        mon_sat: string;
        sunday: string;
    };
    updated_at?: string;
}

// ============ ADMIN ============
export interface AdminProfile {
    uid: number;
    email: string;
    display_name?: string;
    role: 'admin' | 'super_admin';
    created_at?: string;
}

// ============ API RESPONSE ============
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}
