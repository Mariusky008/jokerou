'use client';

import { useState, useEffect } from 'react';

interface GameDateProps {
  date: Date;
  duration: number;
}

export default function GameDate({ date, duration }: GameDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const d = new Date(date);
    setFormattedDate(d.toLocaleDateString());
    setFormattedTime(d.toLocaleTimeString());
  }, [date]);

  if (!formattedDate || !formattedTime) return null;

  return (
    <>
      <h3 className="font-bold text-lg">
        Partie du {formattedDate}
      </h3>
      <p className="text-sm text-gray-400">
        {formattedTime} - Durée: {Math.floor(duration / 60)}min
      </p>
    </>
  );
} 