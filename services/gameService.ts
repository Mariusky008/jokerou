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

  async recordPlayerAction(playerId: string, action: PlayerAction): Promise<number> {
    try {
      // Ici, vous pouvez ajouter l'appel à votre API si nécessaire
      // Pour l'instant, on retourne simplement true pour simuler le succès
      return Promise.resolve(1);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'action:', error);
      return Promise.reject(error);
    }
  }

  getCurrentGame() {
    return this.currentGame;
  }

  async initGame(players: any[]): Promise<boolean> {
    try {
      // Initialisation du jeu
      return Promise.resolve(true);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du jeu:', error);
      return Promise.reject(error);
    }
  }

  async endGame(gameId: string): Promise<boolean> {
    try {
      // Fin du jeu
      return Promise.resolve(true);
    } catch (error) {
      console.error('Erreur lors de la fin du jeu:', error);
      return Promise.reject(error);
    }
  }
}

export const gameService = new GameService(); 