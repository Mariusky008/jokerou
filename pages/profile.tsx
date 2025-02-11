import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import GameRules from '../components/GameRules';
import PlayerMessages from '../components/PlayerMessages';

// Types pour les données du profil
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProfileData {
  avatar: string;
  name: string;
  description: string;
  isImage?: boolean;
}

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  grimGames: number;
  hunterGames: number;
  captureRate: number;
  escapeRate: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface GameHistory {
  id: string;
  date: Date;
  role: 'grim' | 'hunter';
  result: 'victory' | 'defeat';
  duration: number;
  xpEarned: number;
  players: {
    id: string;
    name: string;
    avatar: string;
    role: 'grim' | 'hunter';
    level: number;
  }[];
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

// Ajouter les nouvelles interfaces pour les notifications
interface Notification {
  id: string;
  type: 'badge' | 'role' | 'power' | 'message' | 'level';
  title: string;
  description: string;
  icon: string;
  date: Date;
  read: boolean;
}

export default function Profile() {
  // Données simulées du profil
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: '👤',
    name: 'John Doe',
    description: 'Passionné de jeux urbains et d\'aventures en plein air.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>(profileData);

  const [stats] = useState<Stats>({
    gamesPlayed: 42,
    gamesWon: 28,
    grimGames: 15,
    hunterGames: 27,
    captureRate: 75,
    escapeRate: 60,
    level: 8,
    xp: 2400,
    nextLevelXp: 3000
  });

  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Grim Invincible',
      description: 'A survécu pendant 60 minutes en tant que Grim',
      icon: '🎭',
      rarity: 'legendary'
    },
    {
      id: '2',
      name: 'Chasseur Élite',
      description: 'A capturé le Grim en moins de 10 minutes',
      icon: '🎯',
      rarity: 'epic'
    },
    {
      id: '3',
      name: 'Stratège',
      description: 'A utilisé tous ses pouvoirs dans une partie',
      icon: '🧠',
      rarity: 'rare'
    },
    {
      id: '4',
      name: 'Premier Sang',
      description: 'Première capture en tant que chasseur',
      icon: '🏆',
      rarity: 'common'
    }
  ]);

  const [showRules, setShowRules] = useState(false);

  const [gameHistory] = useState<GameHistory[]>([
    {
      id: '1',
      date: new Date(Date.now() - 3600000), // 1 heure avant
      role: 'grim',
      result: 'victory',
      duration: 3600, // 60 minutes
      xpEarned: 1000,
      players: [
        { id: '1', name: 'Alex', avatar: '👤', role: 'hunter', level: 12 },
        { id: '2', name: 'Marie', avatar: '👤', role: 'hunter', level: 8 },
        { id: '3', name: 'Lucas', avatar: '👤', role: 'hunter', level: 15 }
      ]
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000), // 1 jour avant
      role: 'hunter',
      result: 'victory',
      duration: 1800, // 30 minutes
      xpEarned: 500,
      players: [
        { id: '4', name: 'Sophie', avatar: '👤', role: 'grim', level: 10 },
        { id: '5', name: 'Thomas', avatar: '👤', role: 'hunter', level: 7 },
        { id: '6', name: 'Julie', avatar: '👤', role: 'hunter', level: 9 }
      ]
    }
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-orange-500'
  };

  // Fonction pour formater la durée
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleAvatarChange = (value: string) => {
    setEditedData(prev => ({
      ...prev,
      avatar: value,
      isImage: value.startsWith('data:image')
    }));
  };

  // Ajout d'un state pour la navigation par onglets
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'badges'>('overview');

  // Ajouter le state pour les notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'badge',
      title: 'Nouveau badge débloqué !',
      description: 'Vous avez obtenu le badge "Chasseur Élite"',
      icon: '🏆',
      date: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '2',
      type: 'role',
      title: 'Nouveau rôle disponible',
      description: 'Le rôle "Illusionniste" est maintenant disponible',
      icon: '🎭',
      date: new Date(Date.now() - 7200000),
      read: false
    },
    {
      id: '3',
      type: 'power',
      title: 'Nouveau pouvoir débloqué',
      description: 'Vous avez débloqué le pouvoir "Vision Thermique"',
      icon: '🔥',
      date: new Date(Date.now() - 10800000),
      read: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Ajouter ces states en haut du composant avec les autres states
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<{
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    date: Date;
    read: boolean;
  }[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Alex',
      senderAvatar: '👤',
      content: 'Bien joué pour la dernière partie !',
      date: new Date(Date.now() - 1800000),
      read: false
    },
    {
      id: '2',
      senderId: '3',
      senderName: 'Marie',
      senderAvatar: '👤',
      content: 'On fait une partie ce soir ?',
      date: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  const unreadMessages = messages.filter(m => !m.read).length;

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const markAllMessagesAsRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Head>
        <title>Profil - Grim</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header avec navigation et notifications */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Bouton messagerie */}
            <div className="relative">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 relative"
              >
                <span>💬</span>
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              {/* Menu des messages */}
              {showMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 z-50"
                >
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold">Messages</h3>
                    {unreadMessages > 0 && (
                      <button
                        onClick={markAllMessagesAsRead}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                            !message.read ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => {
                            markMessageAsRead(message.id);
                            setSelectedPlayer({
                              id: message.senderId,
                              name: message.senderName,
                              avatar: message.senderAvatar
                            });
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                              {message.senderAvatar}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{message.senderName}</div>
                              <div className="text-sm text-gray-400 line-clamp-2">{message.content}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
                                  Math.floor((message.date.getTime() - Date.now()) / 3600000),
                                  'hour'
                                )}
                              </div>
                            </div>
                            {!message.read && (
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        Aucun message
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            {/* Bouton notifications existant */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 relative"
              >
                <span>🔔</span>
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Menu des notifications */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 z-50"
                >
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{notification.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-gray-400">{notification.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
                                  Math.floor((notification.date.getTime() - Date.now()) / 3600000),
                                  'hour'
                                )}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        Aucune notification
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            <button
              onClick={() => setShowRules(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <span>📜</span>
              Règles du jeu
            </button>
          </div>
        </div>

        {/* Section profil principale */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-purple-500/20">
          {!isEditing ? (
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 overflow-hidden">
                  {profileData.isImage ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profileData.avatar
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <button
                    onClick={() => {
                      setEditedData(profileData);
                      setIsEditing(true);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                    title="Modifier le profil"
                  >
                    ✏️
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {profileData.name}
                  </h1>
                  <span className="px-3 py-1 bg-purple-600/20 rounded-full text-purple-400 text-sm">
                    Niveau {stats.level}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{profileData.description}</p>
                
                {/* Barre XP améliorée */}
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-purple-400">XP: {stats.xp}</span>
                    <span className="text-gray-400">Prochain niveau: {stats.nextLevelXp}</span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>

                {/* Section des badges */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-medium text-gray-400">Badges obtenus</h3>
                    <span className="text-xs text-purple-400">({badges.length})</span>
                  </div>
                  <div className="flex gap-2">
                    {badges.slice(0, 4).map((badge) => (
                      <motion.button
                        key={badge.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab('badges');
                          const element = document.querySelector('.tabs-section');
                          if (element) {
                            window.scrollTo({ top: (element as HTMLElement).offsetTop, behavior: 'smooth' });
                          }
                        }}
                        className={`group relative w-12 h-12 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-xl shadow-lg hover:shadow-xl transition-shadow`}
                        title={`${badge.name} - ${badge.description}`}
                      >
                        {badge.icon}
                        <div className="absolute inset-0 rounded-xl bg-black opacity-0 group-hover:opacity-50 transition-opacity" />
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="px-2 py-1 bg-gray-900 rounded text-xs whitespace-nowrap">
                            {badge.name}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    {badges.length > 4 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab('badges');
                          const element = document.querySelector('.tabs-section');
                          if (element) {
                            window.scrollTo({ top: (element as HTMLElement).offsetTop, behavior: 'smooth' });
                          }
                        }}
                        className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
                      >
                        +{badges.length - 4}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="mb-8">
              <div className="flex items-start gap-6">
                <div>
                  <div>
                    <div className="w-32 h-32 bg-purple-600 rounded-2xl flex items-center justify-center text-5xl mb-4">
                      {editedData.avatar.startsWith('data:image') ? (
                        <img 
                          src={editedData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        editedData.avatar
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 bg-gray-800 p-3 rounded-lg">
                      {['👤', '🎭', '🦸', '🦹', '🎮', '🎯', '🎪', '🎨'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAvatarChange(emoji)}
                          className={`p-4 rounded-lg text-2xl hover:scale-110 transition-transform ${
                            editedData.avatar === emoji ? 'bg-purple-600' : 'hover:bg-gray-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center justify-center w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors">
                        <span className="mr-2">📷</span>
                        <span>Télécharger une photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleAvatarChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="name">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={editedData.description}
                      onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Navigation par onglets */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 tabs-section">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'history', label: 'Historique' },
            { id: 'badges', label: 'Badges' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'history' | 'badges')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-purple-400">{stats.gamesPlayed}</div>
                <div className="text-gray-400">Parties jouées</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-purple-400">{stats.gamesWon}</div>
                <div className="text-gray-400">Victoires</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-purple-400">{stats.captureRate}%</div>
                <div className="text-gray-400">Taux de capture</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
                <div className="text-3xl mb-2">🏃‍♂️</div>
                <div className="text-2xl font-bold text-purple-400">{stats.escapeRate}%</div>
                <div className="text-gray-400">Taux d'évasion</div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {gameHistory.map((game) => (
                <div key={game.id} className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        game.role === 'grim' 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                          : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      }`}>
                        {game.role === 'grim' ? '🎭' : '🎯'}
                      </div>
                      <div>
                        <div className="font-medium text-lg">
                          {game.role === 'grim' ? 'Grim' : 'Chasseur'}
                        </div>
                        <div className="text-gray-400 text-sm">{formatDate(game.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                        game.result === 'victory'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {game.result === 'victory' ? 'Victoire' : 'Défaite'}
                      </div>
                      <div className="bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-lg text-sm font-medium">
                        +{game.xpEarned} XP
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {game.players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                            {player.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-purple-400">Niveau {player.level}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedPlayer({
                            id: player.id,
                            name: player.name,
                            avatar: player.avatar
                          })}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Envoyer un message"
                        >
                          💬
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gray-800 rounded-xl p-6 border border-purple-500/20 flex items-center gap-6"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-3xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                    <p className="text-gray-400">{badge.description}</p>
                    <div className="mt-2">
                      <span className={`text-sm px-3 py-1 rounded-full bg-opacity-20 ${
                        badge.rarity === 'legendary' ? 'bg-yellow-500 text-yellow-400' :
                        badge.rarity === 'epic' ? 'bg-purple-500 text-purple-400' :
                        badge.rarity === 'rare' ? 'bg-blue-500 text-blue-400' :
                        'bg-gray-500 text-gray-400'
                      }`}>
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Fenêtre de messagerie */}
        {selectedPlayer && (
          <PlayerMessages
            currentPlayer={{
              id: 'current',
              name: 'Vous',
              avatar: '👤'
            }}
            selectedPlayer={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
} 