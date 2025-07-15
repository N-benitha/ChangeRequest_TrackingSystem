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

/**
 * A higher-order component that protects routes based on user authentication and authorization.
 * 
 * This component checks if a user is authenticated by making an API call to '/auth/me'.
 * If the user is not authenticated, it redirects to the login page.
 * If the user is authenticated but does not have the required role(s), it redirects to a role-based route.
 * Otherwise, it renders the child components.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if access is granted.
 * @param {string[]} [props.allowedRoles=[]] - An optional array of allowed user roles for the route.
 * @returns The protected route logic and children, or a redirect if access is denied.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/me', {
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

    // Show loading state while checking authentication
    if (loading) return <div>Loading...</div>;

    // Redirect to login if authentication failed or user not found
    if (error || !user) {
        return <Navigate to={"/login"} state={{ from: location }} replace />;
    }

    // Check role-based authorization if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_type)) {
        const userRoleRedirect = getBasedRedirect(user.user_type);
        return <Navigate to={userRoleRedirect} replace />;
    }

    // Render protected content if all checks pass
    return (
        <>
            {children}
        </>
    );
}

/**
 * Maps user roles to their corresponding dashboard routes
 * Provides role-based navigation for unauthorized access attempts
 * 
 * @param {string} userType - The user's role type (ADMIN, DEVELOPER, APPROVER)
 * @returns {string} The appropriate dashboards route for the user's role
 */
const getBasedRedirect = (userType) => {
    switch (userType) {
        case 'ADMIN':
            return '/dashboards/admin';
        
        case 'DEVELOPER':
            return '/dashboards/developer';
        
        case 'APPROVER':
            return '/dashboards/approver';

        default:
            return '/dashboards';
    }
};

export default ProtectedRoute