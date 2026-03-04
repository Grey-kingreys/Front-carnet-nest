import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogoutButton } from "../LogoutButton";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export function UserProfile() {
    const userData = useLoaderData() as any;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalContacts: 0, recentContacts: 0, accountAge: 0 });

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const { data: contacts } = await api.get("/contacts/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                setStats({
                    totalContacts: contacts.length,
                    recentContacts: contacts.filter((c: any) => new Date(c.createdAt) >= oneWeekAgo).length,
                    accountAge: Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / 86400000),
                });
            } catch { }
        };
        fetchUserStats();
    }, [userData.createdAt]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

    const handleDeleteAccount = async () => {
        if (!window.confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            await api.delete(`/users/delete/${userData.id}`, { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem("authToken");
            toast.success("Compte supprimé");
            navigate("/");
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    console.log(userData)

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <Link to="/" className="btn btn-ghost mb-4">← Retour</Link>
                    <h1 className="text-4xl font-bold">Mon Profil</h1>
                    <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Gauche — Avatar + actions */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body items-center text-center">

                                {/* AVATAR */}
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center mb-4">
                                    {userData.avatarUrl ? (
                                        <img
                                            src={userData.avatarUrl}
                                            alt={userData.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                if (e.currentTarget.parentElement) {
                                                    e.currentTarget.parentElement.innerHTML = `<span class="text-2xl font-bold text-primary-content">${userData.name?.[0]?.toUpperCase() || "U"}</span>`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-primary-content">
                                            {userData.name?.[0]?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>

                                <h2 className="card-title text-xl mb-1">{userData.name}</h2>
                                <p className="text-gray-600 text-sm mb-6">{userData.email}</p>

                                <div className="space-y-3 w-full">
                                    <Link to="/editProfile" className="btn btn-primary btn-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Modifier le profil
                                    </Link>
                                    <LogoutButton />
                                    <button onClick={handleDeleteAccount} disabled={loading} className="btn btn-error btn-block btn-outline">
                                        {loading ? <><span className="loading loading-spinner loading-xs"></span> Suppression...</> : "Supprimer le compte"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Droite — Infos */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-2xl mb-6">Informations personnelles</h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 text-primary">Informations de base</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-semibold">Nom complet</span></label>
                                                <div className="p-3 bg-base-200 rounded-lg">{userData.name}</div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-semibold">Email</span></label>
                                                <div className="p-3 bg-base-200 rounded-lg">{userData.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 text-secondary">Métadonnées</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-semibold">ID</span></label>
                                                <div className="p-3 bg-base-200 rounded-lg font-mono text-sm">{userData.id}</div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-semibold">Créé le</span></label>
                                                <div className="p-3 bg-base-200 rounded-lg">{formatDate(userData.createdAt)}</div>
                                            </div>
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-semibold">Mis à jour le</span></label>
                                                <div className="p-3 bg-base-200 rounded-lg">{formatDate(userData.updatedAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 text-accent">Statistiques</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            {[
                                                { val: stats.totalContacts, label: "Contacts totaux", color: "text-primary" },
                                                { val: stats.recentContacts, label: "Nouveaux (7j)", color: "text-secondary" },
                                                { val: `${stats.accountAge}j`, label: "Membre depuis", color: "text-accent" },
                                                { val: "✓", label: "Compte actif", color: "text-success" },
                                            ].map((s, i) => (
                                                <div key={i} className="bg-base-200 rounded-lg p-4">
                                                    <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                                                    <div className="text-sm text-gray-600">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="card bg-base-100 shadow-xl border-l-4 border-l-info">
                        <div className="card-body">
                            <h3 className="card-title text-info">🔒 Sécurité du compte</h3>
                            <div className="grid md:grid-cols-3 gap-4 mt-4">
                                <div><p className="font-semibold">Email vérifié</p><p className="text-sm text-success">✓ {userData.email}</p></div>
                                <div><p className="font-semibold">Dernière activité</p><p className="text-sm text-gray-600">Maintenant</p></div>
                                <div><p className="font-semibold">Type de compte</p><p className="text-sm text-gray-600">{userData.email === "soulmamoudou0@gmail.com" ? "admin" : "standard"}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}