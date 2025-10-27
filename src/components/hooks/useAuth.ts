import { useState, useEffect } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            // Vérifier aussi si le token est expiré si possible
            setIsAuthenticated(!!token);
        };
    

        checkAuth();

        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        // Ajouter un event listener custom pour les mises à jour d'auth
        window.addEventListener('authChange', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleStorageChange);
        };
    }, []);

    return { isAuthenticated };
}