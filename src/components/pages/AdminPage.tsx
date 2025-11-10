import { useState, useEffect } from "react";
import api from "../../services/api";
import { LogoutButton } from "../LogoutButton";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Définition du type User
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données de l'utilisateur connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated]);

  // Récupérer la liste des utilisateurs
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/users/all');
        setUsers(response.data);
        toast.success(`${response.data.length} utilisateurs chargés`);
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError("Impossible de charger les utilisateurs. Veuillez réessayer plus tard.");
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  // Si l'utilisateur n'est pas authentifié ou n'est pas admin
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center p-6 max-w-md mx-auto bg-base-100 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-error mb-4">Accès refusé</h1>
          <p className="mb-6">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  // Formatage de la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full">
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Connecté en tant que: <span className="font-semibold">{currentUser?.name}</span>
          </span>
          <LogoutButton />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        {/* Résumé */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
            <p className="text-gray-600">
              {loading ? 'Chargement...' : `${users.length} utilisateur(s) enregistré(s)`}
            </p>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Administrateurs</div>
              <div className="stat-value text-primary">
                {users.filter(u => u.email === 'soulmamoudou0@gmail.com').length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Utilisateurs</div>
              <div className="stat-value text-secondary">
                {users.filter(u => u.email !== 'soulmamoudou0@gmail.com').length}
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="alert alert-error mb-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        Liste des utilisateurs
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Inscrit le</th>
                  <th>Dernière mise à jour</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.email === 'soulmamoudou0@gmail.com' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user.email === 'soulmamoudou0@gmail.com' ? 'admin' : 'utilisateur'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.updatedAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        {user.id === currentUser?.id && (
                            <Link 
                            to={`/editProfile`} 
                            className="btn btn-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                        </Link>
                        )}
                        {user.id !== currentUser?.id && (
                          <Link 
                            to={`/users/${user.id}/delete`} 
                            className="btn btn-error"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                          <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                        </svg>



                            Supprimer
                        </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-lg font-medium mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Il n'y a aucun utilisateur enregistré dans le système pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}