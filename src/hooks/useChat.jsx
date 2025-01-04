import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "https://serveur-avatar.hexadecaedre.com:8443";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  // Fonction pour envoyer un message au backend
  const chat = async (message) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      // Vérifier si la requête est réussie
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Vérifier que la réponse contient les messages attendus
      if (!data || !data.messages) {
        throw new Error("Invalid response format");
      }

      // Ajouter les nouveaux messages à la liste des messages existants
      setMessages((prevMessages) => [...prevMessages, ...data.messages]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  
  // Fonction appelée lorsque le message a été joué
  const onMessagePlayed = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  // Mettre à jour l'état `message` chaque fois que `messages` change
  useEffect(() => {
    setMessage(messages[0] || null);
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        messages, // Rendre les messages disponibles via useChat
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook pour utiliser le contexte de chat
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  // Retourner toutes les valeurs nécessaires depuis le contexte
  return {
    chat: context.chat,
    message: context.message,
    messages: context.messages, // Assurez-vous que les messages sont renvoyés
    onMessagePlayed: context.onMessagePlayed,
    loading: context.loading,
    cameraZoomed: context.cameraZoomed,
    setCameraZoomed: context.setCameraZoomed,
  };
};
