import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogoutButton } from "../LogoutButton";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading?: boolean;
}

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth() as AuthContextType;

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Page content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Header pour mobile */}
        <div className="lg:hidden navbar bg-base-100 shadow-sm">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold">Carnet d'adresses</span>
          </div>
          {isAuthenticated && user && (
            <div className="flex-none">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><span>{user.name}</span></li>
                  <li><span>{user.email}</span></li>
                  <li><NavLink to="/profile">Profil</NavLink></li>
                  <li><button onClick={() => logout()}>Déconnexion</button></li>
                </ul>
              </div>
            </div>
          )}
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

            {isAuthenticated && user && (
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
                  <span>Mes contacts</span>
                </NavLink>
              </li>
            )}

            {isAuthenticated && user && (
              <li>
                <NavLink 
                  to="/conversations" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 ${isActive ? 'active bg-base-300' : ''}`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m1 7l-4-4H7a3 3 0 01-3-3V7a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-3l-4 4z" />
                  </svg>
                  <span>Conversations</span>
                </NavLink>
              </li>
            )}

            {isAuthenticated && user && user.email === "soulmamoudou0@gmail.com" && (
            <li>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => 
                  `flex items-center gap-3 ${isActive ? 'active bg-base-300' : ''}`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin</span>
                
              </NavLink>
            </li>
            )}

          </ul>
          
          {/* Footer sidebar */}
          {isAuthenticated && user && (
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
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">{user?.name || 'Utilisateur'}</div>
                      <div className="text-xs text-gray-500">Voir le profil</div>
                    </div>
                  </NavLink>
                </div>
                
                <label htmlFor="my-drawer" className="btn btn-ghost btn-sm lg:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}