import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAdminAuth = (required = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('adminAuth');
    const isAuth = !!adminData && JSON.parse(adminData).isAuthenticated;
    
    setIsAuthenticated(isAuth);
    
    if (required && !isAuth) {
      router.push('/room-031');
    } else if (!required && isAuth) {
      router.push('/room-031/homepage');
    }
  }, [required, router]);

  const login = (username: string, password: string) => {
    // In a real app, verify credentials with your backend
    if (username === 'admin' && password === 'admin031') {
      const authData = { isAuthenticated: true, username };
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      // Update state and redirect immediately
      setIsAuthenticated(true);
      router.push('/room-031/homepage');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/room-031');
  };

  return { isAuthenticated, login, logout };
};
