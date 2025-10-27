import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export function RegisterUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(''); // Reset error on change
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6 || formData.password.length > 12) {
            setError('Le mot de passe doit contenir entre 6 et 12 caractères');
            setLoading(false);
            return;
        }

        try {
            // Envoyer les données sans le confirmPassword
            const { confirmPassword, ...userData } = formData;
            const response = await api.post('/users/create', userData);
            
            // Stocker le token si l'API le retourne
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            
            navigate('/'); // Redirection après succès
        } catch (error: any) {
            console.error('Erreur inscription:', error);
            setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-6">Créer un compte</h2>
                    
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nom complet</span>
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered" 
                                required 
                                placeholder="Votre nom complet"
                            />
                        </div>

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
                                placeholder="6-12 caractères"
                                minLength={6}
                                maxLength={12}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirmer le mot de passe</span>
                            </label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input input-bordered" 
                                required 
                                placeholder="Retapez votre mot de passe"
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Inscription...' : 'Créer mon compte'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="link link-primary">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}