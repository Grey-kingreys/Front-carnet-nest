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
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                </Link>
                                <Link 
                                    to={`/contacts/${contact.id}/edit`}
                                    className="btn btn-primary btn-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

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