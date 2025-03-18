'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const checkAuth = () => {
      try {
        // Get the current path to check if we're on the onboarding page
        const currentPath = window.location.pathname;
        const isOnboardingPath = currentPath.includes('/onboarding');
        
        // Check for user data in localStorage
        const userData = localStorage.getItem('user');
        
        if (userData) {
          setIsAuthenticated(true);
        } else if (isOnboardingPath) {
          // If we're on the onboarding page and don't have user data yet,
          // we'll still allow access as the OAuth flow might be in progress
          console.log('On onboarding page without user data, allowing access');
          setIsAuthenticated(true);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect
  // If authenticated, render the children
  return isAuthenticated ? children : null;
} 