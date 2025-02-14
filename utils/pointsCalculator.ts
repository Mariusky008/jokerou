export interface PlayerAction {
  type: 'kill' | 'distance' | 'power_use' | 'stream' | 'objective';
  details: {
    targetLevel?: number;
    distance?: number;
    duration?: number;
    powerType?: string;
    objectiveType?: string;
    [key: string]: any;
  };
}

export const POINTS_CONFIG = {
  kill: {
    base: 100,
    levelMultiplier: 1.5
  },
  distance: {
    perKilometer: 50
  },
  power_use: {
    base: 25,
    success: 50
  },
  stream: {
    perMinute: 10
  },
  objective: {
    base: 75
  }
};

export function calculatePoints(action: PlayerAction): number {
  switch (action.type) {
    case 'kill':
      const baseKillPoints = POINTS_CONFIG.kill.base;
      if (action.details.targetLevel) {
        return baseKillPoints + (action.details.targetLevel * POINTS_CONFIG.kill.levelMultiplier);
      }
      return baseKillPoints;

    case 'distance':
      if (action.details.distance) {
        return Math.floor(action.details.distance * POINTS_CONFIG.distance.perKilometer);
      }
      return 0;

    case 'power_use':
      const basePowerPoints = POINTS_CONFIG.power_use.base;
      if (action.details.success) {
        return basePowerPoints + POINTS_CONFIG.power_use.success;
      }
      return basePowerPoints;

    case 'stream':
      if (action.details.duration) {
        return Math.floor(action.details.duration * POINTS_CONFIG.stream.perMinute);
      }
      return 0;

    case 'objective':
      return POINTS_CONFIG.objective.base;

    default:
      return 0;
  }
}

export function calculateTotalPoints(actions: PlayerAction[]): number {
  return actions.reduce((total, action) => total + calculatePoints(action), 0);
}

export function formatPoints(points: number): string {
  return points.toLocaleString('fr-FR');
} 