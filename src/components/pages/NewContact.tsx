import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export function NewContact() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const contactData = {
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string
        };

        // Validation basique
        if (!contactData.firstname || !contactData.lastname || !contactData.email) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await api.post('/contacts/create', contactData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Contact créé avec succès');
            navigate('/contacts/all');
        } catch (error) {
            console.error('Erreur création:', error);
            toast.error('Erreur lors de la création du contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Nouveau contact</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Prénom</span>
                    </label>
                    <input 
                        type="text" 
                        name="firstname"
                        className="input input-bordered" 
                        required 
                        placeholder="John"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nom</span>
                    </label>
                    <input 
                        type="text" 
                        name="lastname"
                        className="input input-bordered" 
                        required 
                        placeholder="Doe"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        className="input input-bordered" 
                        required 
                        placeholder="john@example.com"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Téléphone</span>
                    </label>
                    <input 
                        type="tel" 
                        name="phone"
                        className="input input-bordered" 
                        placeholder="+33 1 23 45 67 89"
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
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Création...
                            </>
                        ) : (
                            'Créer le contact'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}