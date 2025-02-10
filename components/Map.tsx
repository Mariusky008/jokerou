import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlayerMessages from './PlayerMessages';
import { motion } from 'framer-motion';

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

  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.2);
    }
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
  }

  .special-zone {
    transition: all 0.3s ease;
  }

  .special-zone.active .zone-icon {
    transform: none !important;
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
  specialZones?: SpecialZone[];
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

interface SpecialZone {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'recharge' | 'cover' | 'surveillance' | 'bonus';
  isActive: boolean;
  nextAppearance: number;
  position?: [number, number];
}

// Composant pour mettre à jour la position du joueur et la carte
function LocationUpdater({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    // Options de configuration pour la géolocalisation
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,        // 10 secondes de timeout
      maximumAge: 0         // Toujours obtenir une position fraîche
    };

    // Gestionnaire de succès
    const successHandler = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      onPositionChange([latitude, longitude]);
    };

    // Gestionnaire d'erreur amélioré
    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = '';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'L\'accès à la géolocalisation a été refusé';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'La position n\'est pas disponible';
          break;
        case error.TIMEOUT:
          errorMessage = 'La demande de géolocalisation a expiré';
          // En cas de timeout, on utilise une position par défaut
          onPositionChange([48.8566, 2.3522]); // Position par défaut : Paris
          break;
        default:
          errorMessage = 'Une erreur inconnue est survenue';
      }
      console.error('Erreur de géolocalisation:', errorMessage);
    };

    // Démarrer le suivi de position
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    );

    // Nettoyage
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onPositionChange]);

  return null;
}

// Ajouter ce nouveau composant pour les contrôles de zoom
function ZoomControl() {
  const map = useMap();
  
  return (
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
  );
}

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

export default function Map({ showJoker, onPlayerSelect, specialZones: initialSpecialZones = [] }: MapProps) {
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

  const [specialZones, setSpecialZones] = useState<SpecialZone[]>(initialSpecialZones);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Mettre à jour la création des icônes de zones spéciales
  const createSpecialZoneIcon = (zone: SpecialZone) => {
    return new L.DivIcon({
      className: 'special-zone-icon',
      html: `<div class="special-zone-marker ${zone.isActive ? 'active' : ''}">${zone.icon}</div>`,
      iconSize: zone.isActive ? [100, 100] : [80, 80],
      iconAnchor: zone.isActive ? [50, 50] : [40, 40],
      popupAnchor: [0, zone.isActive ? -50 : -40]
    });
  };

  // Gérer le chargement du son
  useEffect(() => {
    const loadAudio = async () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/zone-activation.mp3');
          audioRef.current.volume = 0.5;
          
          // Ajouter des gestionnaires d'événements pour mieux gérer le chargement
          audioRef.current.addEventListener('canplaythrough', () => {
            console.log('Audio chargé avec succès');
          });
          
          audioRef.current.addEventListener('error', (e) => {
            console.error('Erreur lors du chargement de l\'audio:', e);
          });
          
          await audioRef.current.load();
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'audio:', error);
      }
    };
    loadAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Gérer les zones spéciales
  useEffect(() => {
    if (initialSpecialZones.length > 0) {
      setSpecialZones(prevZones => {
        return initialSpecialZones.map(zone => {
          const existingZone = prevZones.find(z => z.id === zone.id);
          
          // Si la zone devient active
          if (zone.isActive && (!existingZone || !existingZone.isActive)) {
            // Jouer le son
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(error => {
                console.error('Erreur de lecture audio:', error);
              });
            }

            // Créer une notification
            const notification = document.createElement('div');
            notification.className = 'zone-notification';
            notification.innerHTML = `
              <div class="flex items-center gap-3">
                <span class="text-2xl">${zone.icon}</span>
                <div>
                  <div class="font-bold">${zone.name}</div>
                  <div class="text-sm opacity-80">Zone spéciale activée !</div>
                </div>
              </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
          }

          // Générer une position si nécessaire
          const position = existingZone?.position || [
            currentPosition[0] + (Math.random() - 0.5) * 0.005,
            currentPosition[1] + (Math.random() - 0.5) * 0.005
          ];

          return {
            ...zone,
            position
          };
        });
      });
    }
  }, [initialSpecialZones, currentPosition]);

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
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <ZoomControl />
        
        {/* Rendu des zones spéciales */}
        {specialZones.map((zone) => (
          zone.position && (
            <Marker
              key={zone.id}
              position={zone.position}
              icon={createSpecialZoneIcon(zone)}
            >
              <Popup>
                <div className="bg-gray-900 p-4 rounded-lg min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      zone.isActive 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                        : 'bg-gray-800'
                    }`}>
                      {zone.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                        {zone.name}
                      </h3>
                      {zone.isActive && (
                        <span className="text-green-400 text-sm">Active</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{zone.description}</p>
                  {zone.isActive ? (
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Zone active pour {Math.floor(zone.nextAppearance / 60)}:{(zone.nextAppearance % 60).toString().padStart(2, '0')}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Prochaine activation dans {Math.floor(zone.nextAppearance / 60)}:{(zone.nextAppearance % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Rendu des power spots */}
        {powerSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.position}
            icon={createPowerSpotIcon(spot)}
          >
            <Popup>
              <div className="bg-gray-900 p-3 rounded-lg">
                <h3 className="text-lg font-bold text-purple-400">{spot.name}</h3>
                <p className="text-sm text-gray-300">{spot.description}</p>
                {spot.availableIn > 0 ? (
                  <div className="mt-2 text-yellow-400 text-sm">
                    Disponible dans {spot.availableIn}s
                  </div>
                ) : (
                  <div className="mt-2 text-green-400 text-sm">
                    Disponible maintenant !
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rendu des joueurs */}
        {players.map((player) => (
          <Marker
            key={player.id}
            position={player.position}
            icon={createCustomIcon(player)}
          >
            <Popup>
              <div className="bg-gray-900 p-4 rounded-lg shadow-lg min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    player.role === 'joker' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-blue-600 to-green-600'
                  }`}>
                    {player.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                      {player.name}
                    </h3>
                    <p className="text-sm text-purple-400">Niveau {player.level}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Parties</p>
                    <p className="text-lg font-bold text-white">{player.gamesPlayed}</p>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Victoires</p>
                    <p className="text-lg font-bold text-white">{player.winRate}%</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlayerForChat(player);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  Envoyer un message
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationUpdater onPositionChange={handlePositionChange} />
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

        /* Styles pour les zones spéciales */
        .special-zone {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(26, 26, 26, 0.9);
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .special-zone.active {
          animation: zoneActivation 0.5s ease-out;
        }

        .special-zone.recharge {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
        }

        .special-zone.cover {
          background: linear-gradient(45deg, #10b981, #3b82f6);
        }

        .special-zone.surveillance {
          background: linear-gradient(45deg, #f59e0b, #ef4444);
        }

        .special-zone.bonus {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
        }

        .zone-icon {
          font-size: 24px;
          transition: transform 0.3s ease;
        }

        .special-zone.active .zone-icon {
          transform: scale(1.2);
        }

        .pulse-effect {
          animation: pulse 2s infinite;
        }

        @keyframes zoneActivation {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
} 