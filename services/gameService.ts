import { GameRecord, GamePlayerRecord, GameEvent } from '../types/database';
import { PlayerAction } from '../utils/pointsCalculator';

class GameService {
  private currentGame: GameRecord | null = null;

  async startGame(position: [number, number]) {
    this.currentGame = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      winner: 'none',
      players: [],
      events: [],
      mapData: {
        center: position,
        radius: 1000
      }
    };
    return this.currentGame;
  }

  async endGame() {
    if (this.currentGame) {
      this.currentGame.endTime = new Date();
      this.currentGame.duration = 
        (this.currentGame.endTime.getTime() - this.currentGame.startTime.getTime()) / 1000;
      // Ici, vous pourriez sauvegarder la partie dans une base de données
      const gameRecord = { ...this.currentGame };
      this.currentGame = null;
      return gameRecord;
    }
    return null;
  }

  async recordPlayerAction(playerId: string, action: PlayerAction) {
    if (!this.currentGame) return null;
    
    const player = this.currentGame.players.find(p => p.id === playerId);
    if (!player) return null;

    const event: GameEvent = {
      id: Date.now().toString(),
      type: action.type,
      timestamp: new Date(),
      players: {
        actorId: playerId
      },
      details: {
        actionType: action.type,
        points: 0, // Sera calculé
        ...action.details
      }
    };

    this.currentGame.events.push(event);
    return event;
  }

  getCurrentGame() {
    return this.currentGame;
  }
}

export const gameService = new GameService(); 