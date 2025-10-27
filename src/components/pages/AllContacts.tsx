import { useLoaderData, Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Contact } from "../../App";
import { useEffect, useRef } from "react";

export function AllContacts() {
    const res = useLoaderData();
    const hasShownToast = useRef(false);
    const contacts: Contact[] = res?.data || [];

    useEffect(() => {
    if (contacts.length > 0 && !hasShownToast.current) {
        toast.success(`${contacts.length} contacts chargés`);
        hasShownToast.current = true;
    }
    }, [contacts.length]);

    return (
        <div className="w-full"> {/* ✅ Prend toute la largeur */}
            {/* Header de la page */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tous les contacts</h1>
                <Link to="/contacts/new" className="btn btn-primary">
                    + Ajouter un contact
                </Link>
            </div>

            {/* Contenu tout en haut */}
            <div className="bg-base-100 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-semibold">
                        Nombre de contacts : <span className="text-primary">{contacts.length}</span>
                    </p>
                </div>

                {/* Liste des contacts */}
                <div className="space-y-3">
                    {contacts.map(contact => (
                        <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-base-200 transition-colors">
                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {contact.firstname} {contact.lastname}
                                </h3>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link 
                                    to={`/contacts/${contact.id}`}
                                    className="btn btn-ghost btn-sm"
                                >
                                    Voir
                                </Link>
                                <Link 
                                    to={`/contacts/${contact.id}/edit`}
                                    className="btn btn-primary btn-sm"
                                >
                                    Modifier
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message si aucun contact */}
                {contacts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">Aucun contact trouvé</p>
                        <Link to="/contacts/new" className="btn btn-primary mt-4">
                            Créer votre premier contact
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}