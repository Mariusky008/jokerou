import { useEffect, useState, useCallback, forwardRef, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlayerMessages from './PlayerMessages';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';

interface PlayerLocation {
  id: string;
  name: string;
  avatar: string;
  position: [number, number];
  role: 'grim' | 'hunter' | 'illusionist' | 'informer' | 'saboteur';
  isReady: boolean;
  level: number;
  health?: number;
  stamina?: number;
  powerCooldown?: number;
  lastAction?: string;
  killCount?: number;
  distanceTraveled?: number;
  isStreaming?: boolean;
  streamDuration?: number;
  streamPoints?: number;
  speed?: number;
}

interface MapProps {
  showGrim: boolean;
  onPlayerSelect: (player: PlayerLocation) => void;
  specialZones: SpecialZone[];
  isSpectator?: boolean;
  players?: PlayerLocation[];
  onToggleStream?: () => void;
  isStreaming?: boolean;
}

interface SpecialZone {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'recharge' | 'cover' | 'surveillance' | 'bonus' | 'danger';
  isActive: boolean;
  nextAppearance: number;
  position?: [number, number];
}

interface PowerSpot {
  id: string;
  type: 'power' | 'bonus' | 'trap' | 'teleport';
  position: [number, number];
  name: string;
  description: string;
  icon: string;
  availableIn: number;
  forRole?: 'grim' | 'hunter' | 'all';
}

// Styles CSS pour les marqueurs Leaflet
const markerStyle = `
  .custom-div-icon {
    background: none;
    border: none;
  }

  .marker-pin {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9));
    border: 3px solid white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .marker-pin:hover {
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 1001;
  }

  .marker-pin.grim {
    background: linear-gradient(45deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9));
  }

  .marker-pin.hunter {
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
  }

  .marker-pin.illusionist {
    background: linear-gradient(45deg, rgba(236, 72, 153, 0.9), rgba(139, 92, 246, 0.9));
    z-index: 998;
  }

  .marker-pin.informer {
    background: linear-gradient(45deg, rgba(6, 182, 212, 0.9), rgba(59, 130, 246, 0.9));
    z-index: 997;
  }

  .marker-pin.saboteur {
    background: linear-gradient(45deg, rgba(239, 68, 68, 0.9), rgba(249, 115, 22, 0.9));
    z-index: 996;
  }

  .marker-avatar {
    font-size: 20px;
    line-height: 1;
    z-index: 1002;
  }

  .marker-level {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1003;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
    }
  }
`;

// Styles CSS pour les zones spéciales
const specialZoneStyle = `
  .special-zone {
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .special-zone:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  }

  .special-zone.power {
    background: radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4));
    animation: glow 2s infinite alternate;
  }

  .special-zone.bonus {
    background: radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.4));
    animation: pulse-light 2s infinite;
  }

  .special-zone.trap {
    background: radial-gradient(circle, rgba(239, 68, 68, 0.4), rgba(185, 28, 28, 0.4));
    animation: warning 1.5s infinite;
  }

  .special-zone.teleport {
    background: radial-gradient(circle, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.4));
    animation: teleport-effect 3s infinite;
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.5),
                 0 0 20px rgba(236, 72, 153, 0.5);
    }
    to {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.7),
                 0 0 40px rgba(236, 72, 153, 0.7);
    }
  }

  @keyframes pulse-light {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  @keyframes warning {
    0% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0.7;
      transform: scale(1);
    }
  }

  @keyframes teleport-effect {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

// Import dynamique des composants Leaflet
const MapContainerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const MarkerDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const PopupDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const CircleDynamic = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Import dynamique de Leaflet
let leafletInstance: typeof import('leaflet');
if (typeof window !== 'undefined') {
  leafletInstance = require('leaflet');
  require('leaflet/dist/leaflet.css');
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

// Ajouter le composant ZoomControl avant le composant Map
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

const Map = forwardRef<LeafletMap, MapProps>(({ 
  showGrim, 
  onPlayerSelect, 
  specialZones: initialSpecialZones = [], 
  isSpectator = false,
  players: initialPlayers = [],
  onToggleStream,
  isStreaming = false 
}, ref) => {
  const [isClient, setIsClient] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<[number, number]>([48.8566, 2.3522]);
  const [selectedPlayerForChat, setSelectedPlayerForChat] = useState<PlayerLocation | null>(null);
  const [specialZones, setSpecialZones] = useState<SpecialZone[]>(initialSpecialZones);
  const [showVideoModal, setShowVideoModal] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [leafletInstance, setLeafletInstance] = useState<any>(null);
  const [playersState, setPlayersState] = useState<PlayerLocation[]>(initialPlayers);

  // Game zone definition
  const gameZone = {
    center: playerPosition,
    radius: 1000 // 1km in meters
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');
      
      // Définir l'icône par défaut de Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
        iconUrl: require('leaflet/dist/images/marker-icon.png').default,
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
      });
      
      setLeafletInstance(L);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = markerStyle + specialZoneStyle;
      style.id = 'map-custom-styles';
      document.head.appendChild(style);

      console.log("Leaflet initialized");
    }

    return () => {
      const existingStyle = document.getElementById('map-custom-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Update players when initialPlayers changes
  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      console.log("Updating players state with:", initialPlayers);
      setPlayersState(initialPlayers);
    }
  }, [initialPlayers]);

  // Créer une icône personnalisée pour les joueurs
  const createPlayerIcon = useCallback((player: PlayerLocation) => {
    if (!leafletInstance) {
      console.error("Leaflet instance not initialized");
      return null;
    }
    
    const validRoles = ['grim', 'hunter', 'illusionist', 'informer', 'saboteur'];
    if (!validRoles.includes(player.role)) {
      console.error("Invalid player role:", player.role);
      return null;
    }
    
    console.log("Creating icon for player:", player);
    const markerHtml = `
      <div class="marker-pin ${player.role}">
        <span class="marker-avatar">${player.avatar}</span>
        ${player.level ? `<span class="marker-level">Niv.${player.level}</span>` : ''}
      </div>
    `;

    try {
    return leafletInstance.divIcon({
      html: markerHtml,
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
    } catch (error) {
      console.error("Error creating player icon:", error);
      return null;
    }
  }, [leafletInstance]);

  // Effet pour simuler le mouvement des joueurs
  useEffect(() => {
    if (!mapInstance || !playersState || playersState.length === 0) return;

    const interval = setInterval(() => {
      setPlayersState(prevPlayers => 
        prevPlayers.map(player => ({
          ...player,
          position: [
            player.position[0] + (Math.random() - 0.5) * 0.0005,
            player.position[1] + (Math.random() - 0.5) * 0.0005
          ]
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [mapInstance, playersState]);

  const handlePositionChange = useCallback((newPosition: [number, number]) => {
    setPlayerPosition(newPosition);
  }, []);

  // Mettre à jour les temps de recharge des power spots
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayersState(prev => prev.map(player => ({
        ...player,
        powerCooldown: Math.max(0, player.powerCooldown ? player.powerCooldown - 1 : 0)
      })));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Créer une icône personnalisée pour les power spots
  const createPowerSpotIcon = (spot: PowerSpot) => {
    const markerHtml = `
      <div class="power-spot ${spot.availableIn > 0 ? 'cooldown' : ''} ${spot.type}">
        <span class="power-icon">${spot.icon}</span>
        ${spot.availableIn > 0 ? `<span class="cooldown-timer">${Math.floor(spot.availableIn / 60)}:${(spot.availableIn % 60).toString().padStart(2, '0')}</span>` : ''}
      </div>
    `;

    return leafletInstance.divIcon({
      html: markerHtml,
      className: 'power-spot-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  // Créer une icône personnalisée pour les zones spéciales
  const createSpecialZoneIcon = (zone: SpecialZone) => {
    const markerHtml = `
      <div class="special-zone ${zone.type} ${zone.isActive ? 'active' : ''}" style="transform: none;">
        <span class="zone-icon">${zone.icon}</span>
      </div>
    `;

    return leafletInstance.divIcon({
      html: markerHtml,
      className: 'special-zone-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  useEffect(() => {
    console.log("Initial players received:", initialPlayers);
    if (initialPlayers && initialPlayers.length > 0) {
      console.log("Number of players:", initialPlayers.length);
      initialPlayers.forEach(player => {
        console.log("Player data:", {
          id: player.id,
          name: player.name,
          role: player.role,
          position: player.position
        });
      });
    } else {
      console.log("No players received or empty players array");
    }
  }, [initialPlayers]);

  if (!isClient || !leafletInstance) {
    return (
      <div className="h-[600px] bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white text-xl">Chargement de la carte...</div>
      </div>
    );
  }

  console.log("Rendering Map component with players:", playersState);

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden relative">
      {/* Bouton de streaming (uniquement pour les joueurs) */}
      {!isSpectator && onToggleStream && (
        <>
          <button
            onClick={onToggleStream}
            className={`absolute top-4 right-4 z-[999] px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all ${
              isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <span>{isStreaming ? '🔴' : '📹'}</span>
            {isStreaming ? 'Arrêter' : 'Démarrer le direct'}
          </button>

          {/* Miniature vidéo */}
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 z-[999] w-64 bg-gray-900 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative aspect-video bg-black">
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>EN DIRECT</span>
                </div>
              </div>
              <div className="p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Votre flux</span>
                  <span className="text-gray-400">👁️ 0</span>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Modal pour les flux vidéo */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Flux vidéo en direct</h3>
                <button
                  onClick={() => setShowVideoModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-black rounded-xl relative">
                {/* Ici sera intégré le flux vidéo */}
                <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  EN DIRECT
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainerDynamic
        center={playerPosition}
        zoom={13}
        style={{ height: '600px', width: '100%', borderRadius: '1rem' }}
        ref={ref}
        whenReady={() => {
          console.log("Map is ready");
          if (ref && 'current' in ref) {
            const map = (ref as any).current;
            setMapInstance(map);
            setIsMapReady(true);
          }
        }}
      >
        <LocationUpdater onPositionChange={handlePositionChange} />
        
        <TileLayerDynamic
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="map-tiles"
        />
        
        {isMapReady && leafletInstance && (
          <>
        {/* Zone de jeu */}
        <CircleDynamic
          center={gameZone.center}
          radius={gameZone.radius}
          pathOptions={{
            color: '#8b5cf6',
            fillColor: '#8b5cf680',
            fillOpacity: 0.2,
            weight: 2
          }}
        />

            {/* Marqueurs des joueurs */}
            {playersState.map((player) => {
              if (!player || !player.position) {
                console.error("Invalid player data:", player);
                return null;
              }

              const icon = createPlayerIcon(player);
              if (!icon) {
                console.error("Failed to create icon for player:", player);
                return null;
              }

          return (
            <MarkerDynamic
                  key={`${player.id}-${player.position[0]}-${player.position[1]}`}
              position={player.position}
                  icon={icon}
              eventHandlers={{
                click: () => {
                      if (onPlayerSelect) {
                        onPlayerSelect(player);
                      }
                }
              }}
            >
              <PopupDynamic>
                <div className="text-center bg-gray-900 p-4 rounded-lg min-w-[250px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                      ${player.role === 'grim' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : player.role === 'illusionist' ? 'bg-gradient-to-br from-pink-600 to-purple-600'
                        : player.role === 'informer' ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                        : player.role === 'saboteur' ? 'bg-gradient-to-br from-red-600 to-orange-600'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      }`}
                    >
                      {player.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">{player.name}</div>
                      <div className="text-purple-400">Niveau {player.level}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-sm text-gray-400">Santé</div>
                      <div className="font-bold">{player.health}%</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-sm text-gray-400">Endurance</div>
                      <div className="font-bold">{player.stamina}%</div>
                    </div>
                  </div>

                  {player.killCount !== undefined && (
                    <div className="bg-gray-800 p-2 rounded mb-3">
                      <div className="text-sm text-gray-400">Éliminations</div>
                      <div className="font-bold">{player.killCount}</div>
                    </div>
                  )}

                  {player.distanceTraveled !== undefined && (
                    <div className="bg-gray-800 p-2 rounded mb-3">
                      <div className="text-sm text-gray-400">Distance parcourue</div>
                      <div className="font-bold">{player.distanceTraveled.toFixed(1)} km</div>
                    </div>
                  )}

                  <div className="text-sm text-gray-300 mb-3">
                    {player.role === 'grim' ? 'Grim' :
                     player.role === 'illusionist' ? 'Illusionniste' :
                     player.role === 'informer' ? 'Informateur' :
                     player.role === 'saboteur' ? 'Saboteur' :
                     'Chasseur'}
                  </div>

                  {player.lastAction && (
                    <div className="bg-gray-800 p-2 rounded mb-3">
                      <div className="text-sm text-gray-400">Dernière action</div>
                      <div className="text-sm">{player.lastAction}</div>
                    </div>
                  )}

                  {player.powerCooldown > 0 && (
                    <div className="bg-gray-800 p-2 rounded mb-3">
                      <div className="text-sm text-gray-400">Pouvoir disponible dans</div>
                      <div className="text-sm">{Math.ceil(player.powerCooldown / 60)}min</div>
                    </div>
                  )}

                  {player.isStreaming && (
                    <div className="bg-purple-900/30 p-2 rounded mb-3">
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse text-red-500">●</span>
                        <span className="text-purple-400">En direct</span>
                      </div>
                      {player.streamDuration && (
                        <div className="text-sm mt-1">
                          Durée: {Math.floor(player.streamDuration)} minutes
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onPlayerSelect(player)}
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
              </PopupDynamic>
            </MarkerDynamic>
          );
        })}

        {/* Points d'intérêt */}
            {/* Suppression de la section qui causait les erreurs */}

        {/* Zones spéciales */}
        {specialZones.map((zone) => (
          zone.isActive && zone.position && (
            <MarkerDynamic
              key={zone.id}
              position={zone.position}
              icon={createSpecialZoneIcon(zone)}
              eventHandlers={{
                add: (e) => {
                  const element = e.target.getElement();
                  if (element) {
                    element.style.transition = 'none';
                    element.style.transform = 'none';
                  }
                }
              }}
            >
              <PopupDynamic>
                <div className="text-center bg-gray-900 p-4 rounded-lg min-w-[200px]">
                  <div className="text-2xl mb-2">{zone.icon}</div>
                  <div className="font-bold text-white mb-1">{zone.name}</div>
                  <div className="text-sm text-gray-300 mb-2">{zone.description}</div>
                  <div className="text-xs text-purple-400">
                    Active pendant: {Math.floor(zone.nextAppearance / 60)}:{(zone.nextAppearance % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </PopupDynamic>
            </MarkerDynamic>
          )
        ))}
          </>
        )}

        <ZoomControl />
      </MapContainerDynamic>

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
          animation: zonePulse 2s infinite;
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
          font-size: 20px;
        }

        @keyframes zonePulse {
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
});

Map.displayName = 'Map';

// Export the Map component with dynamic import and SSR disabled
export default dynamic(() => Promise.resolve(Map), {
  ssr: false
}); 