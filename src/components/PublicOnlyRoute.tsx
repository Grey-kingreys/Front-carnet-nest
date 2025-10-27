import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return !isAuthenticated ? <>{children}</> : <Navigate to="/accueil" replace />;
}