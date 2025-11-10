import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    // Afficher un indicateur de chargement pendant la vérification de l'authentification
    if (isLoading || isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
                <span className="ml-2">Vérification de l'authentification...</span>
            </div>
        );
    }

    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est authentifié, afficher le contenu protégé
    return <>{children}</>;
}