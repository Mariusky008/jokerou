function Map({ players, showGrim = true }) {
  return (
    <div className="map">
      {players.map((player) => (
        <Player key={player.id} player={player} />
      ))}
    </div>
  );
}

export default Map; 