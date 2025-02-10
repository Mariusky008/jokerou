import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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
          timestamp: new Date(Date.now() - 300000),
          type: 'text'
        },
        {
          id: '2',
          senderId: selectedPlayer.id,
          receiverId: currentPlayer.id,
          content: 'Hey ! Oui, je suis dans le coin nord.',
          timestamp: new Date(Date.now() - 240000),
          type: 'text'
        }
      ]);
    }
  }, [selectedPlayer, currentPlayer.id]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Démarrer le timer pour la durée d'enregistrement
      let duration = 0;
      recordingTimerRef.current = setInterval(() => {
        duration += 1;
        setRecordingDuration(duration);
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob && selectedPlayer) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentPlayer.id,
        receiverId: selectedPlayer.id,
        content: 'Message vocal',
        timestamp: new Date(),
        type: 'voice',
        audioUrl,
        duration: recordingDuration
      };

      setMessages(prev => [...prev, message]);
      setAudioBlob(null);
      setRecordingDuration(0);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPlayer) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentPlayer.id,
      receiverId: selectedPlayer.id,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
              {message.type === 'text' ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <audio src={message.audioUrl} controls className="h-8 w-32" />
                  <span className="text-xs opacity-75">{formatDuration(message.duration || 0)}</span>
                </div>
              )}
              <p className="text-xs text-gray-300 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input et contrôles d'enregistrement */}
      <div className="p-3 bg-gray-800">
        {isRecording ? (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-700 rounded-lg p-2 flex items-center gap-2">
              <span className="animate-pulse text-red-500">⚪</span>
              <span className="text-sm text-gray-300">
                {formatDuration(recordingDuration)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
              title="Arrêter l'enregistrement"
            >
              ✓
            </button>
            <button
              onClick={cancelRecording}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
              title="Annuler l'enregistrement"
            >
              ✕
            </button>
          </div>
        ) : audioBlob ? (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-700 rounded-lg p-2 flex items-center gap-2">
              <audio src={URL.createObjectURL(audioBlob)} controls className="w-full h-8" />
            </div>
            <button
              onClick={sendVoiceMessage}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
              title="Envoyer le message vocal"
            >
              ↑
            </button>
            <button
              onClick={() => setAudioBlob(null)}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
              title="Supprimer l'enregistrement"
            >
              ✕
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={startRecording}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Enregistrer un message vocal"
            >
              🎤
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 