import { useEffect, useMemo, useState, useRef } from "react";
import { getSocket } from "../../services/socket";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../hooks/useAuth";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: number;
  content: string;
  sender: { id: number; name: string; email: string };
  createdAt: string;
}

interface Conversation {
  id: number;
  updatedAt: string;
  users: Array<{ id: number; name: string; email: string }>;
  messages?: Message[];
  unreadCount?: number;
}

export function Conversations() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const conversationId = params.get("conversationId");
  
  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [participants, setParticipants] = useState<Array<{ id: number; name: string; email: string }>>([]);

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion des événements WebSocket
  useEffect(() => {
    const socket = getSocket();
    
    const onConnect = () => {
      setConnected(true);
      if (conversationId) {
        socket.emit("join", { conversationId });
      }
    };
    
    const onDisconnect = () => setConnected(false);
    
    const onNewMessage = (payload: { 
      conversationId: number; 
      message: Message;
    }) => {
      // Mettre à jour la liste des conversations si on est sur la page d'accueil
      if (!conversationId) {
        setConversations(prev => {
          const updated = [...prev];
          const convIndex = updated.findIndex(c => c.id === payload.conversationId);
          
          if (convIndex >= 0) {
            // Mettre à jour la conversation existante
            updated[convIndex] = {
              ...updated[convIndex],
              updatedAt: new Date().toISOString(),
              messages: [payload.message],
              unreadCount: (updated[convIndex].unreadCount || 0) + 1
            };
          }
          
          // Déplacer la conversation en haut de la liste
          const [movedConversation] = updated.splice(convIndex, 1);
          return [movedConversation, ...updated];
        });
      } 
      // Si on est dans la conversation concernée
      else if (String(payload.conversationId) === conversationId) {
        setMessages(prev => [...prev, payload.message]);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat:newMessage", onNewMessage);

    // Rejoindre la conversation actuelle
    if (conversationId) {
      socket.emit("join", { conversationId });
    }

    // Nettoyer les écouteurs lors du démontage
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat:newMessage", onNewMessage);
    };
  }, [conversationId]);

  // Charger les conversations ou les messages d'une conversation spécifique
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (!conversationId) {
          // Charger la liste des conversations
          const { data } = await api.get(`/chat`);
          
          // Trier les conversations par date de mise à jour (les plus récentes en premier)
          const sortedConversations = (data || []).sort((a: Conversation, b: Conversation) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          
          setConversations(sortedConversations);
        } else {
          // Charger les messages d'une conversation spécifique
          const { data } = await api.get(`/chat/${conversationId}`);
          setMessages(data?.messages || []);
          setParticipants(data?.users || []);
          
          // Marquer la conversation comme lue
          if (data?.id) {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === data.id 
                  ? { ...conv, unreadCount: 0 } 
                  : conv
              )
            );
          }
        }
      } catch (e) {
        console.error("Erreur lors du chargement des conversations:", e);
      } finally {
        setLoading(false);
      }
    };
    
    load();
    
    // Rafraîchir les conversations toutes les 30 secondes
    const interval = setInterval(() => {
      if (!conversationId) {
        api.get(`/chat`).then(({ data }) => {
          const sortedConversations = (data || []).sort((a: Conversation, b: Conversation) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setConversations(sortedConversations);
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [conversationId]);

  const sendMessage = async () => {
    const value = input.trim();
    if (!value || !conversationId || sending) return;
    
    setSending(true);
    try {
      await api.post(`/chat/${conversationId}`, { content: value });
      setInput("");
    } catch (e: any) {
      console.error("Erreur lors de l'envoi du message:", e);
      alert(e.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };
  
  // Formater la date d'un message
  const formatMessageDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch (e) {
      return '';
    }
  };
  
  // Formater la date d'une conversation
  const formatConversationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return format(date, 'HH:mm', { locale: fr });
      } else if (diffDays === 1) {
        return 'Hier';
      } else if (diffDays < 7) {
        return format(date, 'EEEE', { locale: fr });
      } else {
        return format(date, 'dd/MM/yyyy', { locale: fr });
      }
    } catch (e) {
      return '';
    }
  };
  
  // Obtenir le nom de l'interlocuteur
  const getInterlocutor = (users: Array<{ id: number; name: string }>) => {
    return users.find(u => u.id !== currentUser?.id)?.name || 'Inconnu';
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col">
      <div className="p-4 border-b border-base-300">
        <h1 className="text-2xl font-bold">
          {conversationId ? 'Discussion' : 'Messages'}
        </h1>
        <div className="text-sm text-gray-500">
          {conversationId 
            ? participants.map(p => p.name).join(', ')
            : `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex">
      {!conversationId ? (
        <div className="w-full overflow-y-auto">
          {authLoading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : !currentUser ? (
            <div className="flex justify-center items-center h-screen">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Non connecté</h2>
                <p>Veuillez vous connecter pour accéder aux conversations</p>
              </div>
            </div>
          ) : (
            <div>
              <ul className="divide-y divide-base-200">
                {conversations.map((conversation) => {
                  const lastMessage = conversation.messages?.[0];
                  const interlocutor = getInterlocutor(conversation.users);
                  const hasUnread = conversation.unreadCount && conversation.unreadCount > 0;
                  
                  return (
                    <li key={conversation.id} className="hover:bg-base-100 transition-colors">
                      <button 
                        onClick={() => navigate(`/conversations?conversationId=${conversation.id}`)}
                        className="w-full text-left p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{interlocutor}</div>
                          <span className="text-xs text-gray-500">
                            {formatConversationDate(conversation.updatedAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className={`text-sm truncate max-w-[200px] ${hasUnread ? 'font-semibold' : 'text-gray-500'}`}>
                            {lastMessage?.content || 'Aucun message'}
                          </p>
                          {hasUnread && (
                            <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <p>Aucun message</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={message.id} className="message-container">
                      <div className={`flex ${message.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-xs p-3 rounded-lg ${
                            message.sender.id === currentUser?.id 
                              ? 'bg-primary text-white' 
                              : 'bg-base-300'
                          }`}
                        >
                          <div className="font-semibold">{message.sender.name}</div>
                          <div>{message.content}</div>
                          <div className="text-xs text-right opacity-75 mt-1">
                            {formatMessageDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="border-t border-base-300 p-4 bg-base-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Tapez votre message..."
                  className="input input-bordered flex-1"
                  disabled={sending}
                />
                <button 
                  onClick={sendMessage}
                  className={`btn btn-primary ${sending ? 'loading' : ''}`}
                  disabled={!input.trim() || sending}
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
