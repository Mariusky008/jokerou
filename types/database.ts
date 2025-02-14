import { PlayerAction } from '../utils/pointsCalculator';

export interface GameRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  winner: string;
  players: GamePlayerRecord[];
  events: GameEvent[];
  mapData: {
    center: [number, number];
    radius: number;
  };
}

export interface GamePlayerRecord {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: 'hunter' | 'grim';
  level: number;
  position: [number, number];
  actions: GameEvent[];
  totalPoints: number;
}

export interface GameEvent {
  id: string;
  type: string;
  timestamp: Date;
  players: {
    actorId: string;
    targetId?: string;
  };
  details: {
    actionType: string;
    points: number;
    [key: string]: any;
  };
}

export interface LeaderboardEntry {
  userId: string;
  gameId: string;
  position: number;
  points: number;
  achievements: GamePlayerRecord['achievements'];
  timestamp: Date;
}

export interface UserStats {
  userId: string;
  totalGames: number;
  wins: number;
  totalPoints: number;
  highestPoints: number;
  favoriteRole: string;
  playtime: number;
  achievements: {
    total: number;
    [key: string]: number;
  };
  recentGames: {
    gameId: string;
    points: number;
    position: number;
    timestamp: Date;
  }[];
} 