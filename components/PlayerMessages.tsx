import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface PlayerMessagesProps {
  currentPlayer: Player;
  selectedPlayer: Player | null;
  onClose: () => void;
}

export default function PlayerMessages({ currentPlayer, selectedPlayer, onClose }: PlayerMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simuler le chargement des messages
  useEffect(() => {
    if (selectedPlayer) {
      // Ici, vous devriez charger les vrais messages depuis votre backend
      setMessages([
        {
          id: '1',
          senderId: currentPlayer.id,
          receiverId: selectedPlayer.id,
          content: 'Salut ! Je t\'ai repéré sur la carte.',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: '2',
          senderId: selectedPlayer.id,
          receiverId: currentPlayer.id,
          content: 'Hey ! Oui, je suis dans le coin nord.',
          timestamp: new Date(Date.now() - 240000)
        }
      ]);
    }
  }, [selectedPlayer, currentPlayer.id]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPlayer) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentPlayer.id,
      receiverId: selectedPlayer.id,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (!selectedPlayer) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-gray-900 rounded-lg shadow-xl overflow-hidden z-[2000]">
      {/* Header */}
      <div className="bg-gray-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            {selectedPlayer.avatar}
          </div>
          <span className="font-medium text-white">{selectedPlayer.name}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentPlayer.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.senderId === currentPlayer.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-300 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
} 