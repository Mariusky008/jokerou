import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlayerMessages from './PlayerMessages';

// Styles CSS pour les marqueurs Leaflet
const markerStyle = `
  .custom-div-icon {
    background: none;
    border: none;
  }
  .marker-pin {
    width: 40px;
    height: 40px;
    border-radius: 50% 50% 50% 50%;
    background: #1a1a1a;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 2px solid white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .marker-pin.joker {
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
  }
  .marker-pin.hunter {
    background: linear-gradient(45deg, #3b82f6, #10b981);
  }
  .marker-avatar {
    font-size: 18px;
    margin-bottom: 2px;
  }
  .marker-level {
    font-size: 9px;
    background: rgba(0, 0, 0, 0.5);
    padding: 0px 4px;
    border-radius: 8px;
    color: white;
  }
`;

// Ajouter les styles au head du document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = markerStyle;
  document.head.appendChild(style);
}

interface MapProps {
  showJoker: boolean;
  onPlayerSelect: (player: any) => void;
}

interface PlayerLocation {
  id: string;
  name: string;
  avatar: string;
  position: [number, number];
  role: 'joker' | 'hunter';
  isReady: boolean;
  level: number;
  gamesPlayed: number;
  winRate: number;
}

interface PowerSpot {
  id: string;
  type: 'power' | 'bonus' | 'trap' | 'teleport';
  position: [number, number];
  name: string;
  description: string;
  icon: string;
  availableIn: number; // Temps en secondes avant disponibilité
  forRole?: 'joker' | 'hunter' | 'all';
}

// Composant pour mettre à jour la position du joueur et la carte
function LocationUpdater({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      // Suivre la position en temps réel
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          map.setView(newPos, map.getZoom());
          onPositionChange(newPos);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [map, onPositionChange]);

  return null;
}

export default function Map({ showJoker, onPlayerSelect }: MapProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([48.8566, 2.3522]);
  const [selectedPlayerForChat, setSelectedPlayerForChat] = useState<PlayerLocation | null>(null);
  const [players, setPlayers] = useState<PlayerLocation[]>([
    {
      id: '1',
      name: 'Joker',
      avatar: '🎭',
      position: [48.8566, 2.3522],
      role: 'joker',
      isReady: true,
      level: 15,
      gamesPlayed: 42,
      winRate: 75
    },
    {
      id: '2',
      name: 'Alex',
      avatar: '👤',
      position: [48.8576, 2.3532],
      role: 'hunter',
      isReady: true,
      level: 8,
      gamesPlayed: 23,
      winRate: 65
    },
    {
      id: '3',
      name: 'Marie',
      avatar: '👤',
      position: [48.8556, 2.3512],
      role: 'hunter',
      isReady: true,
      level: 12,
      gamesPlayed: 35,
      winRate: 80
    },
    {
      id: '4',
      name: 'Lucas',
      avatar: '👤',
      position: [48.8586, 2.3542],
      role: 'hunter',
      isReady: true,
      level: 10,
      gamesPlayed: 28,
      winRate: 70
    }
  ]);

  const [powerSpots, setPowerSpots] = useState<PowerSpot[]>([
    {
      id: 'power1',
      type: 'power',
      position: [48.8576, 2.3542],
      name: 'Zone Fantôme',
      description: 'Invisibilité pendant 45 secondes',
      icon: '👻',
      availableIn: 0,
      forRole: 'joker'
    },
    {
      id: 'power2',
      type: 'power',
      position: [48.8556, 2.3502],
      name: 'Super Radar',
      description: 'Détection précise pendant 30 secondes',
      icon: '🎯',
      availableIn: 120,
      forRole: 'hunter'
    },
    {
      id: 'bonus1',
      type: 'bonus',
      position: [48.8586, 2.3522],
      name: 'Bonus XP',
      description: '+500 XP',
      icon: '⭐',
      availableIn: 0,
      forRole: 'all'
    },
    {
      id: 'trap1',
      type: 'trap',
      position: [48.8546, 2.3532],
      name: 'Piège',
      description: 'Ralentit les chasseurs pendant 20 secondes',
      icon: '⚡',
      availableIn: 60,
      forRole: 'joker'
    },
    {
      id: 'teleport1',
      type: 'teleport',
      position: [48.8566, 2.3502],
      name: 'Téléporteur',
      description: 'Téléportation vers un point aléatoire de la carte',
      icon: '🌀',
      availableIn: 180,
      forRole: 'all'
    }
  ]);

  const handlePositionChange = useCallback((newPosition: [number, number]) => {
    setCurrentPosition(newPosition);
    
    // Mettre à jour les positions des autres joueurs autour de la position actuelle
    setPlayers(prev => prev.map(player => ({
      ...player,
      position: player.id === '1' ? newPosition : [
        newPosition[0] + (Math.random() - 0.5) * 0.005, // Réduit la dispersion
        newPosition[1] + (Math.random() - 0.5) * 0.005
      ]
    })));
  }, []);

  // Mettre à jour les temps de recharge des power spots
  useEffect(() => {
    const timer = setInterval(() => {
      setPowerSpots(prev => prev.map(spot => ({
        ...spot,
        availableIn: Math.max(0, spot.availableIn - 1)
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Modifier la création des icônes personnalisées
  const createCustomIcon = (player: PlayerLocation) => {
    const markerHtml = `
      <div class="marker-pin ${player.role === 'joker' ? 'joker' : 'hunter'}">
        <span class="marker-avatar">${player.avatar}</span>
        <span class="marker-level">Niv.${player.level}</span>
      </div>
    `;

    return L.divIcon({
      html: markerHtml,
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  // Créer une icône personnalisée pour les power spots
  const createPowerSpotIcon = (spot: PowerSpot) => {
    const markerHtml = `
      <div class="power-spot ${spot.availableIn > 0 ? 'cooldown' : ''} ${spot.type}">
        <span class="power-icon">${spot.icon}</span>
        ${spot.availableIn > 0 ? `<span class="cooldown-timer">${Math.floor(spot.availableIn / 60)}:${(spot.availableIn % 60).toString().padStart(2, '0')}</span>` : ''}
      </div>
    `;

    return L.divIcon({
      html: markerHtml,
      className: 'power-spot-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  // Zone de jeu
  const gameZone = {
    center: currentPosition,
    radius: 1000 // 1km en mètres
  };

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden relative">
      <MapContainer
        center={currentPosition}
        zoom={16}
        className="h-full w-full"
        style={{ background: '#1a1a1a' }}
        zoomControl={false} // Désactiver les contrôles de zoom par défaut
      >
        <LocationUpdater onPositionChange={handlePositionChange} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="map-tiles"
        />
        
        {/* Zone de jeu */}
        <Circle
          center={gameZone.center}
          radius={gameZone.radius}
          pathOptions={{
            color: '#8b5cf6',
            fillColor: '#8b5cf680',
            fillOpacity: 0.2,
            weight: 2
          }}
        />

        {/* Marqueur de votre position */}
        <Marker
          position={currentPosition}
          icon={createCustomIcon({
            id: 'you',
            name: 'Vous',
            avatar: '📍',
            position: currentPosition,
            role: 'hunter',
            isReady: true,
            level: 1,
            gamesPlayed: 0,
            winRate: 0
          })}
        >
          <Popup>
            <div className="text-center bg-gray-900 p-3 rounded-lg">
              <div className="text-2xl mb-2">📍</div>
              <div className="font-bold text-white">Votre position</div>
            </div>
          </Popup>
        </Marker>

        {/* Marqueurs des autres joueurs */}
        {players.map((player) => {
          if (player.role === 'joker' && !showJoker) return null;

          return (
            <Marker
              key={player.id}
              position={player.position}
              icon={createCustomIcon(player)}
              eventHandlers={{
                click: () => {
                  onPlayerSelect({
                    id: player.id,
                    name: player.name,
                    avatar: player.avatar,
                    role: player.role,
                    description: `${player.role === 'joker' ? 'Joker' : 'Chasseur'} expérimenté - Niveau ${player.level}`,
                    stats: {
                      gamesPlayed: player.gamesPlayed,
                      winRate: player.winRate,
                      level: player.level,
                      xp: player.level * 1000
                    }
                  });
                }
              }}
            >
              <Popup>
                <div className="text-center bg-gray-900 p-4 rounded-lg min-w-[250px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                      {player.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">{player.name}</div>
                      <div className="text-purple-400">Niveau {player.level}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-sm text-gray-400">Parties</div>
                      <div className="font-bold">{player.gamesPlayed}</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-sm text-gray-400">Victoires</div>
                      <div className="font-bold">{player.winRate}%</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 mb-3">
                    {player.role === 'joker' ? 'Joker' : 'Chasseur'} expérimenté
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onPlayerSelect({
                        id: player.id,
                        name: player.name,
                        avatar: player.avatar,
                        role: player.role,
                        description: `${player.role === 'joker' ? 'Joker' : 'Chasseur'} expérimenté - Niveau ${player.level}`,
                        stats: {
                          gamesPlayed: player.gamesPlayed,
                          winRate: player.winRate,
                          level: player.level,
                          xp: player.level * 1000
                        }
                      })}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors w-full"
                    >
                      Voir profil complet
                    </button>
                    <button 
                      onClick={() => setSelectedPlayerForChat(player)}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors w-full"
                    >
                      Message privé
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Points d'intérêt */}
        {powerSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.position}
            icon={createPowerSpotIcon(spot)}
          >
            <Popup>
              <div className="text-center bg-gray-900 p-4 rounded-lg min-w-[200px]">
                <div className="text-2xl mb-2">{spot.icon}</div>
                <div className="font-bold text-white mb-1">{spot.name}</div>
                <div className="text-sm text-gray-300 mb-2">{spot.description}</div>
                {spot.forRole !== 'all' && (
                  <div className="text-xs text-purple-400 mb-2">
                    Exclusif {spot.forRole === 'joker' ? 'au Joker' : 'aux Chasseurs'}
                  </div>
                )}
                {spot.availableIn > 0 ? (
                  <div className="text-sm text-gray-400">
                    Disponible dans {Math.floor(spot.availableIn / 60)}:{(spot.availableIn % 60).toString().padStart(2, '0')}
                  </div>
                ) : (
                  <button 
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors w-full"
                    onClick={() => {
                      // Logique pour activer le power-up
                      setPowerSpots(prev => prev.map(s => 
                        s.id === spot.id 
                          ? { ...s, availableIn: s.type === 'bonus' ? 300 : 600 }
                          : s
                      ));
                    }}
                  >
                    Activer
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Contrôles de zoom personnalisés */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-[1000]">
          <button 
            onClick={() => map.zoomIn()}
            className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            +
          </button>
          <button 
            onClick={() => map.zoomOut()}
            className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            -
          </button>
        </div>
      </MapContainer>

      {/* Fenêtre de messagerie privée */}
      {selectedPlayerForChat && (
        <PlayerMessages
          currentPlayer={{
            id: 'current-player',
            name: 'Vous',
            avatar: '📍'
          }}
          selectedPlayer={{
            id: selectedPlayerForChat.id,
            name: selectedPlayerForChat.name,
            avatar: selectedPlayerForChat.avatar
          }}
          onClose={() => setSelectedPlayerForChat(null)}
        />
      )}

      <style jsx global>{`
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }

        .leaflet-container {
          background: #1a1a1a;
        }

        .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          border: none;
        }

        .leaflet-popup-tip {
          background: #1a1a1a;
        }

        .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }

        .leaflet-popup-close-button {
          color: white !important;
        }

        /* Animation de pulsation pour les marqueurs */
        .marker-pin {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          70% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }

        /* Styles pour les power spots */
        .power-spot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(26, 26, 26, 0.9);
          border: 2px solid white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .power-spot.power {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
        }

        .power-spot.bonus {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
        }

        .power-spot.trap {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }

        .power-spot.teleport {
          background: linear-gradient(45deg, #3b82f6, #2563eb);
        }

        .power-spot.cooldown {
          opacity: 0.6;
        }

        .power-icon {
          font-size: 18px;
        }

        .cooldown-timer {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          color: white;
          white-space: nowrap;
        }

        /* Animation de pulsation pour les power spots disponibles */
        .power-spot:not(.cooldown) {
          animation: powerPulse 2s infinite;
        }

        @keyframes powerPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }
      `}</style>
    </div>
  );
} 