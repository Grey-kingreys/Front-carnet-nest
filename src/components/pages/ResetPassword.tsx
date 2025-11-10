// ResetPassword.tsx
import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import api from "../../services/api";

export function ResetPassword() {

  const { token } = useParams();

      const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        token: token || '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); 


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
        setSuccess(false); // Réinitialiser le succès si l'utilisateur modifie le mot de passe
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

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
            const response = await api.post(`/users/resetpassword/${token}`, formData);
            setSuccess(true);
            
            // ✅ Optionnel : Redirection après un délai
            // setTimeout(() => {
            //     navigate('/login');
            // }, 3000);
            
        } catch (error: any) {
            setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

  return (
      <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Réinitialisation du mot de passe</h1>

            {error && <p className="text-red-500">{error}</p>}

            {success && (
                        <div className="alert alert-success">
                            <span>
                                ✅ Mot de passe reinitialiser avec succes,
                                Retourner a la page de connexion
                            </span>
                        </div>
                    )}
            
             {!success ? (<form onSubmit={handleSubmit} className="space-y-4">
                                  

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

                <div className="flex gap-4 mt-6">
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost"
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </button>
                </div>
            </form>) : (
                        // ✅ Affichage après succès
                        <div className="text-center space-y-4">
                            <p className="text-success">
                                ✅ Instructions envoyées à
                            </p>
                            <p className="text-sm text-gray-600">
                                Veuillez retourner a la page de connexion pour vous connecter
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="btn btn-primary mt-4"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}

                    {/* Liens seulement affichés si pas de succès */}
                    {!success && (
                        <>
                            <div className="text-center mt-4">
                                <p className="text-sm">
                                    Se connecter ?{' '}
                                    <Link to="/login" className="link link-primary">
                                        Se connecter
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
                        </>
                    )}
        </div>
  );
}