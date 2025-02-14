import React, { useEffect, useState } from 'react';
import Map from './components/Map';

const App = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch players data from API
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <div className="App">
      <Map players={players} showGrim={true} />
    </div>
  );
};

export default App; 