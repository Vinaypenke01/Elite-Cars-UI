import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminProfile, getAdminProfile, logoutAdmin } from '@/services/api.service';

interface User {
    id: number;
    email: string;
    display_name?: string;
}

interface AuthContextType {
    user: User | null;
    adminProfile: AdminProfile | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
    setAdminProfile: (profile: AdminProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (token exists)
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');

            if (token) {
                try {
                    const profile = await getAdminProfile();
                    setUser({
                        id: profile.uid,
                        email: profile.email,
                        display_name: profile.display_name
                    });
                    setAdminProfile(profile);
                    setIsAdmin(true);
                } catch (error) {
                    console.error('Error fetching admin profile:', error);
                    // Clear invalid token
                    localStorage.removeItem('auth_token');
                    setUser(null);
                    setAdminProfile(null);
                    setIsAdmin(false);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    // Sync isAdmin state with adminProfile
    useEffect(() => {
        setIsAdmin(!!adminProfile);
    }, [adminProfile]);

    const signOut = async () => {
        try {
            await logoutAdmin();
            setUser(null);
            setAdminProfile(null);
            setIsAdmin(false);
        } catch (error) {
            console.error('Error signing out:', error);
            // Even if API call fails, clear local state
            localStorage.removeItem('auth_token');
            setUser(null);
            setAdminProfile(null);
            setIsAdmin(false);
        }
    };

    const value = {
        user,
        adminProfile,
        isAdmin,
        loading,
        signOut,
        setUser,
        setAdminProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
