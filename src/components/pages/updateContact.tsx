import { useState, useEffect } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export function UpdateContact() {
    const navigate = useNavigate();
    const { id } = useParams();
    const contactData = useLoaderData();
    
    // Vérifier la structure des données
    const contact = contactData?.data || contactData;
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
    });

    // Pré-remplir le formulaire avec les données du contact
    useEffect(() => {
        if (contact) {
            setFormData({
                firstname: contact.firstname || '',
                lastname: contact.lastname || '',
                email: contact.email || '',
                phone: contact.phone || ''
            });
        }
    }, [contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };



const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem('authToken');
    await api.patch(`/contacts/update/${id}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
    toast.success('Contact modifié avec succès');
    navigate('/contacts/all');
  } catch (error) {
    console.error('Erreur modification:', error);
    toast.error('Erreur lors de la modification du contact');
  } finally {
    setLoading(false);
  }
};

    if (!contact) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Modifier le contact</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Prénom</span>
                    </label>
                    <input 
                        type="text" 
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="input input-bordered" 
                        required 
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nom</span>
                    </label>
                    <input 
                        type="text" 
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="input input-bordered" 
                        required 
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
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Téléphone</span>
                    </label>
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input input-bordered" 
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
                        {loading ? 'Modification...' : 'Modifier le contact'}
                    </button>
                </div>
            </form>
        </div>
    );
}