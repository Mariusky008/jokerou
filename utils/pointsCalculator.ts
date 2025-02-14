export interface PlayerAction {
  type: 'stream' | 'kill' | 'escape' | 'power' | 'distance';
  value?: number;
  duration?: number;
}

export const calculatePoints = (action: PlayerAction): number => {
  switch (action.type) {
    case 'stream':
      return (action.duration || 0) * 10; // 10 points par minute de stream
    case 'kill':
      return 100; // 100 points par élimination
    case 'escape':
      return 150; // 150 points par évasion
    case 'power':
      return 50; // 50 points par utilisation de pouvoir
    case 'distance':
      return Math.floor((action.value || 0) * 0.1); // 0.1 point par mètre parcouru
    default:
      return 0;
  }
};

export function calculateTotalPoints(actions: PlayerAction[]): number {
  return actions.reduce((total, action) => total + calculatePoints(action), 0);
}

export function formatPoints(points: number): string {
  return points.toLocaleString('fr-FR');
} 