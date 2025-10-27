import { useNavigate } from "react-router-dom";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        // Déclencher l'événement custom pour useAuth
        window.dispatchEvent(new Event('authChange'));
        navigate('/accueil', { replace: true });
    };

    window.dispatchEvent(new Event('authChange'));

    return (
        <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            Déconnexion
        </button>
    );
}