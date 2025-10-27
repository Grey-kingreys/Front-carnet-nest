import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
    const [stats, setStats] = useState({ total: 0, recent: 0 });
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchContactsStats = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('authToken');
                const response = await api.get('/contacts/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const contacts = response.data;
                
                // Calcul des contacts récents (7 derniers jours)
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                const recentContacts = contacts.filter((contact: any) => {
                    const contactDate = new Date(contact.createdAt);
                    return contactDate >= oneWeekAgo;
                });

                setStats({ 
                    total: contacts.length, 
                    recent: recentContacts.length 
                });
                
            } catch (error) {
                console.error("Erreur lors du chargement des contacts:", error);
                setStats({ total: 0, recent: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchContactsStats();
    }, [isAuthenticated]);

    // Contenu différent selon l'authentification
    const renderAuthContent = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <div className="flex gap-4 justify-center mb-12">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Créer un compte
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-lg">
                            Se connecter
                        </Link>
                    </div>
                    
                    {/* Stats pour visiteurs non connectés */}
                    <div className="bg-base-200 rounded-2xl p-8 mt-8">
                        <h3 className="text-2xl font-bold mb-4">Pourquoi nous choisir ?</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                                <div className="text-gray-600">Utilisateurs satisfaits</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-secondary mb-2">10K+</div>
                                <div className="text-gray-600">Contacts gérés</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-accent mb-2">99%</div>
                                <div className="text-gray-600">Disponibilité</div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="flex gap-4 justify-center mb-12">
                    <Link to="/contacts/all" className="btn btn-primary btn-lg">
                        Voir mes contacts
                    </Link>
                    <Link to="/contacts/new" className="btn btn-outline btn-lg">
                        Ajouter un contact
                    </Link>
                </div>

                {/* Stats pour utilisateurs connectés */}
                {!loading && (
                    <div className="bg-base-200 rounded-2xl p-8 mt-8">
                        <h3 className="text-2xl font-bold mb-6 text-center">Votre activité en un coup d'œil</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="stat bg-base-100 rounded-lg p-4 text-center">
                                <div className="stat-figure text-primary mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="stat-value text-primary text-4xl">{stats.total}</div>
                                <div className="stat-title">Contacts totaux</div>
                            </div>
                            <div className="stat bg-base-100 rounded-lg p-4 text-center">
                                <div className="stat-figure text-secondary mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="stat-value text-secondary text-4xl">{stats.recent}</div>
                                <div className="stat-title">Nouveaux cette semaine</div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[60vh]">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl font-bold mb-6">
                            Gestionnaire de <span className="text-primary">Contacts</span>
                        </h1>
                        
                        <p className="text-xl mb-8 text-gray-600">
                            Gérez facilement tous vos contacts professionnels et personnels 
                            en un seul endroit sécurisé.
                        </p>

                        {renderAuthContent()}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body text-center">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="card-title justify-center text-lg mb-2">Gestion Centralisée</h3>
                            <p className="text-gray-600">
                                Tous vos contacts au même endroit, facilement accessibles et organisés.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body text-center">
                            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="card-title justify-center text-lg mb-2">Sécurisé</h3>
                            <p className="text-gray-600">
                                Vos données sont protégées et accessibles uniquement par vous.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body text-center">
                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="card-title justify-center text-lg mb-2">Rapide</h3>
                            <p className="text-gray-600">
                                Interface optimisée pour une gestion rapide et efficace de vos contacts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-content py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {isAuthenticated ? 'Continuez à organiser vos contacts' : 'Commencez dès maintenant'}
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        {isAuthenticated 
                            ? 'Vos contacts sont en sécurité avec nous. Ajoutez-en de nouveaux dès maintenant !'
                            : 'Rejoignez les nombreuses personnes qui organisent déjà leurs contacts avec nous.'
                        }
                    </p>
                    <Link 
                        to={isAuthenticated ? "/contacts/new" : "/register"} 
                        className="btn btn-secondary btn-lg"
                    >
                        {isAuthenticated ? 'Ajouter un contact' : 'Créer votre compte'}
                    </Link>
                </div>
            </div>
        </div>
    );
}