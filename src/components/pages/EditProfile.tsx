import { useLoaderData, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

interface AuthContextType {
    user: { avatarUrl?: string | null } | null;
    updateUser?: (data: any) => void;
}

export function EditProfile() {
    const navigate = useNavigate();
    const userData = useLoaderData() as any;
    const { id } = userData;
    const user = userData.data || userData;

    // Pour mettre à jour le contexte Auth après upload
    const { updateUser } = useAuth() as AuthContextType;

    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    // Prévisualisation locale avant upload
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user?.avatarUrl || null
    );

    const [formData, setFormData] = useState({ name: "", email: "" });

    // Référence cachée pour le input file
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || "", email: user.email || "" });
            setAvatarPreview(user.avatarUrl || null);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Quand l'utilisateur sélectionne une image
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vérifier le type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Seules les images JPG, PNG, WEBP et GIF sont autorisées");
            return;
        }

        // Vérifier la taille (5 MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 5 MB");
            return;
        }

        // Prévisualisation immédiate (avant même l'upload)
        const localUrl = URL.createObjectURL(file);
        setAvatarPreview(localUrl);

        // Upload vers l'API
        setAvatarLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            // FormData pour envoyer le fichier
            const form = new FormData();
            form.append("file", file);

            const response = await api.post("/users/avatar", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { avatarUrl } = response.data;

            // Mettre à jour la prévisualisation avec l'URL S3 réelle
            setAvatarPreview(avatarUrl);

            // Mettre à jour le contexte Auth → la sidebar se met à jour automatiquement
            if (updateUser) updateUser({ avatarUrl });

            toast.success("Photo de profil mise à jour !");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Erreur lors de l'upload de la photo"
            );
            // Revenir à l'ancienne photo en cas d'erreur
            setAvatarPreview(user?.avatarUrl || null);
        } finally {
            setAvatarLoading(false);
            // Réinitialiser le input pour permettre de re-sélectionner le même fichier
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            await api.patch(`/users/update/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Profil modifié avec succès");
            navigate(-1);
        } catch (error) {
            toast.error("Erreur lors de la modification du profil");
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

            {/* ===== SECTION AVATAR ===== */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    {/* Photo ou initiale */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                        {avatarLoading ? (
                            <span className="loading loading-spinner loading-md text-primary-content"></span>
                        ) : avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Photo de profil"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-primary-content">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </span>
                        )}
                    </div>

                    {/* Bouton crayon superposé */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarLoading}
                        className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary shadow-lg"
                        title="Changer la photo"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15H9v-2.828z"
                            />
                        </svg>
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WEBP ou GIF · Max 5 MB
                </p>

                {/* Input file caché */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>

            {/* ===== FORMULAIRE INFOS ===== */}
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

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost"
                    >
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Modification...
                            </>
                        ) : (
                            "Modifier le profil"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}