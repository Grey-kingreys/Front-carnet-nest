import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export function ForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // État pour le succès

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
        setSuccess(false); // Réinitialiser le succès si l'utilisateur modifie l'email
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/users/resetpassword', formData);
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
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-6">Réinitialiser mot de passe</h2>
                    
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>
                                ✅ Un email de réinitialisation a été envoyé à {formData.email}. 
                                Vérifiez votre boîte de réception.
                            </span>
                        </div>
                    )}

                    {!success ? (
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
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control mt-6">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // ✅ Affichage après succès
                        <div className="text-center space-y-4">
                            <p className="text-success">
                                ✅ Instructions envoyées à {formData.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                Vérifiez votre boîte de réception et suivez les instructions 
                                pour réinitialiser votre mot de passe.
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
            </div>
        </div>
    );
}