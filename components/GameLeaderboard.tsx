import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  role: string;
  points: number;
  level: number;
  achievements: {
    kills: number;
    distance: number;
    powerUses: number;
  };
}

export default function GameLeaderboard() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Mettre à jour l'heure côté client uniquement
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const [players] = useState<Player[]>([
    {
      id: '1',
      name: 'Alex',
      role: 'hunter',
      points: 850,
      level: 12,
      achievements: { kills: 3, distance: 2.5, powerUses: 6 }
    },
    {
      id: '2',
      name: 'Sophie',
      role: 'informer',
      points: 720,
      level: 8,
      achievements: { kills: 2, distance: 1.8, powerUses: 4 }
    },
    {
      id: '3',
      name: 'Marcus',
      role: 'saboteur',
      points: 650,
      level: 15,
      achievements: { kills: 1, distance: 3.2, powerUses: 8 }
    }
  ]);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Classement en direct</h2>
        <div className="text-gray-400">{currentTime}</div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700/50 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <span>#{index + 1}</span>
                    <span>{player.name}</span>
                    <span className="text-sm px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                      {player.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">Niveau {player.level}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{player.points} pts</div>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span title="Éliminations">🎯 {player.achievements.kills}</span>
                <span title="Distance">🏃 {player.achievements.distance}km</span>
                <span title="Pouvoirs">⚡ {player.achievements.powerUses}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 