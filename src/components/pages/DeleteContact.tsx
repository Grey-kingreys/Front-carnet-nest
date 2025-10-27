import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
// Page de confirmation
export function DeleteContact() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
    try {
        await api.delete(`/contacts/delete/${id}`);
        toast.success('Contact supprimé avec succès');
        navigate("/contacts/all");
    } catch (error) {
        console.error('Erreur suppression:', error);
        toast.error('Impossible de supprimer le contact');
    }
    };
    return (
        <div className="max-w-md mx-auto p-6">
            <div className="card bg-base-100 shadow-xl border border-error/20">
                <div className="card-body text-center">
                    {/* Icône d'alerte */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    
                    <h2 className="card-title justify-center text-error">Confirmation requise</h2>
                    
                    <p className="py-4 text-gray-600">
                        Vous êtes sur le point de supprimer définitivement ce contact. 
                        <strong className="block mt-2">Cette action est irréversible.</strong>
                    </p>
                    
                    <div className="card-actions justify-center gap-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-ghost"
                        >
                            Annuler
                        </button>
                        
                        <button 
                            onClick={handleDelete}
                            className="btn btn-error"
                        >
                            Oui, supprimer définitivement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}