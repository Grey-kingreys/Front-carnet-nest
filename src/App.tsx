"use client"

import './App.css'
import api from './services/api'
import { createBrowserRouter, RouterProvider, Link, useRouteError, Outlet, isRouteErrorResponse } from 'react-router-dom'
import { AllContacts } from './components/pages/AllContacts'// Correction orthographique
import { Layout } from './components/pages/Layout'
import { Single } from './components/pages/singleContac'
import { NewContact } from './components/pages/NewContact'
import { DeleteContact} from './components/pages/DeleteContact'
import { UpdateContact } from './components/pages/updateContact'
import { RegisterUser } from './components/pages/RegisterUser'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicOnlyRoute } from './components/PublicOnlyRoute'
import { UserProfile } from './components/pages/User'
import { HomePage } from './components/pages/Acceuil'
import { LoginUser } from './components/pages/Login'
import { EditProfile } from './components/pages/EditProfile'
import { AuthProvider } from './components/Contexts/AuthContext'
import { ForgotPassword } from './components/pages/ForgotPassword'
import { ResetPassword } from './components/pages/ResetPassword'

function LoadingFallback() {
  return (
    <div className="container text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement en cours...</p>
    </div>
  );
}

export type Contact = {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    createdAt: string,
    updatedAt: string
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage/>,
        hydrateFallbackElement: <LoadingFallback/>,
        children: [
              {
                index: true,
                element: <HomePage /> // Retirer PublicOnlyRoute pour la page d'accueil
              },
              {
                path: "accueil",
                element: <HomePage />
              },
              {
              path: "contacts",
              element: <Outlet />,
              children: [
              { 
                path: "all",
                element: <ProtectedRoute><AllContacts /></ProtectedRoute>,
                loader: async () => await api.get<Contact[]>("/contacts/all")
              },
              {
                path: ":id",
                element: <ProtectedRoute><Single /></ProtectedRoute>,
                loader: async ({ params }) => await api.get<Contact[]>(`/contacts/${params.id}`)
              },
              {
                path: "new",
                element: <ProtectedRoute><NewContact /></ProtectedRoute>,
              },
              {
                path: ":id/delete",  
                element: <ProtectedRoute><DeleteContact /></ProtectedRoute>,
              }, 
              {
                path: ":id/edit",
                element: <ProtectedRoute><UpdateContact /></ProtectedRoute>,
                loader: async ({ params }) => {
                  // Correction : utiliser GET pour charger les données
                  const response = await api.get(`/contacts/${params.id}`);
                  return response.data;
                }
              }
            ]
          },
          {
            path: "register",
            element: <RegisterUser />
          },
          {
            path: "login",
            element: (
              <PublicOnlyRoute>
                <LoginUser />
              </PublicOnlyRoute>
            ),
          },
          {
            path: "forgotpassword",
            element: (
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            ),
          },
          {
            path: "reset-password/:token",
            element: (
              <PublicOnlyRoute>
                <ResetPassword />
              </PublicOnlyRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            ),
            loader: async () => {
              const token = localStorage.getItem('authToken');
              const response = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
              });
              return response.data;
            }
          },
          {
            path: 'editProfile',
            element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
            loader: async () => {
              const token = localStorage.getItem('authToken');
              const response = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
              });
              return response.data;
            }
          }
        ]
    }
])

function ErrorPage() {
  const error = useRouteError();
  
  console.error('Erreur de route:', error);

  let errorMessage = "Une erreur inattendue s'est produite";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.status === 404 
      ? "La page que vous cherchez n'existe pas." 
      : `Erreur ${error.status}: ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="container">
      <h2>Oups !</h2>
      <p>{errorMessage}</p>
      <Link to="/accueil">Retour à l'accueil</Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App