'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString());
    };
    
    // Mettre à jour immédiatement
    updateTime();
    
    // Mettre à jour chaque seconde
    const interval = setInterval(updateTime, 1000);
    
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval);
  }, []);

  // Ne rien rendre jusqu'à ce que le temps soit défini
  if (!time) return null;

  return <div className="text-gray-400">{time}</div>;
} 