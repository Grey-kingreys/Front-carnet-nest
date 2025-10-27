import { Outlet, NavLink } from "react-router-dom";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { LogoutButton } from "../LogoutButton";
import { useAuth } from "../hooks/useAuth";

// Définition du type User
interface User {
  _id: string;
  name: string;
  email: string;
  // Ajoutez d'autres propriétés selon ce que renvoie votre backend
}

export function Layout() {
  const [userData, setUserData] = useState<User | null>(null);
  const { isAuthenticated } = useAuth();

    
 useEffect(() => {
  if (!isAuthenticated) {
            setUserData(null)
              return;
            }
  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Erreur:", error);
      setUserData(null);
    }
  };
  
  fetchUserData();
}, [isAuthenticated]); // Tableau de dépendances vide pour exécution unique

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Page content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Header pour mobile */}
        <div className="lg:hidden navbar bg-base-100 shadow-sm">
          <div className="flex-none">
            <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-semibold">Mon Application</div>
        </div>

        {/* Main content avec Outlet - CONTENU PRINCIPAL EN HAUT */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet /> {/* ✅ Votre contenu s'affichera ici, tout en haut */}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50"> {/* ✅ z-index pour éviter le masquage */}
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="bg-base-200 min-h-full w-64 flex flex-col">
          {/* Logo/Brand */}
          <div className="p-4 border-b border-base-300">
            <h1 className="text-xl font-bold text-center">Mon App</h1>
          </div>

          {/* Navigation */}
          <ul className="menu p-4 w-full flex-1">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  `flex items-center gap-3 ${isActive ? 'active bg-base-300' : ''}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span>Accueil</span>
              </NavLink>
            </li>

            {userData === null && (
              <li>
                <NavLink 
                  to="/register" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 ${isActive ? 'active bg-base-300' : ''}`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Register</span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink 
                to="/contacts/all" 
                className={({ isActive }) => 
                  `flex items-center gap-3 ${isActive ? 'active bg-base-300' : ''}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Contacts</span>
              </NavLink>
            </li>
          </ul>
          
          {/* Footer sidebar */}
          <div className="p-4 border-t border-base-300 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* NavLink pour le profil utilisateur */}
                <NavLink 
                  to="/profile" 
                  className="flex items-center gap-3 hover:bg-base-300 rounded-lg p-2 transition-colors"
                >
                  <div className="avatar">
                    <div className="w-8 rounded-full bg-primary">
                      <span className="text-primary-content text-xs font-bold">
                        {userData?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">{userData?.name || 'Utilisateur'}</div>
                    <div className="text-xs text-gray-500">Voir le profil</div>
                  </div>
                </NavLink>
                
                {/* Bouton de déconnexion */}
                {userData && <LogoutButton />}
              </div>
              
              <label htmlFor="my-drawer" className="btn btn-ghost btn-sm lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}