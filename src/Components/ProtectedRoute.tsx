import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

interface User {
  id: string;
  username: string;
  email: string;
  user_type: string;
  status: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('http://localhost:3000/auth/me', {
                    withCredentials: true
                });
                if (response.data && response.data.user) {
                    setUser(response.data.user as User);
                } else {
                    setError('No user data received');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                setError('Authentication check failed');
                
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    if (loading) return <div>Loading...</div>;

    if (error || !user) {
        return <Navigate to={"/login"} state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_type)) {
        const userRoleRedirect = getBasedRedirect(user.user_type);
        return <Navigate to={userRoleRedirect} replace />;
    }

    return (
        <>
            {children}
        </>
    );
}

const getBasedRedirect = (userType) => {
    switch (userType) {
        case 'ADMIN':
            return '/dashboard/admin';
        
        case 'DEVELOPER':
            return '/dashboard/developer';
        
        case 'APPROVER':
            return '/dashboard/approver';

        default:
            return '/dashboard';
    }
};

export default ProtectedRoute