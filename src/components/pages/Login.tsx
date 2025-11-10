import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../hooks/useAuth";

export function LoginUser() {
  const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/users/login', formData);
            
            if (!response.data.token) {
                throw new Error('Aucun token reçu dans la réponse du serveur');
            }

            // 1. Stocker le token et les données utilisateur
            const { token, user: userData } = response.data;
            
            // 2. Mettre à jour le contexte d'authentification de manière synchrone
            login(token, userData);
            
            // 3. Attendre un court instant pour laisser le temps à l'UI de se mettre à jour
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 4. Rediriger vers la page d'accueil
            navigate('/accueil', { replace: true });
                
        } catch (error: any) {
            console.error('Erreur connexion:', error);
            setError(error.response?.data?.message || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-6">Connexion</h2>
                    
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered" 
                                required 
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered" 
                                required 
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Mot de passe oublié ?{' '}
                            <Link to="/forgotpassword" className="link link-primary">
                                Mot de passe oublié
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="link link-primary">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}