import { useLoaderData, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from '../../services/api'
import { toast } from 'react-hot-toast';

export function EditProfile() {
    const navigate = useNavigate();
    const userData = useLoaderData();
    const { id } = userData; // Plus propre

    const user = userData.data || userData;
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // ✅ CORRECTION : ChangeEvent au lieu de FormEvent
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            await api.patch(`/users/update/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            toast.success('Profil modifié avec succès');
            navigate(-1);
        } catch (error) {
            console.error('Erreur modification:', error);
            toast.error('Erreur lors de la modification du profil');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Modifier le profil</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nom complet</span>
                    </label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange} // ✅ Maintenant ça fonctionne !
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
                        onChange={handleChange} // ✅ Maintenant ça fonctionne !
                        className="input input-bordered" 
                        required 
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
                        {loading ? 'Modification...' : 'Modifier le profil'}
                    </button>
                </div>
            </form>
        </div>
    );
}