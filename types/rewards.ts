export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  value: number;
  type: 'amazon' | 'local' | 'game';
  icon: string;
  partner?: string;
  available: boolean;
  discount?: number;
  expiresIn?: number;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  rewardId: string;
  points: number;
  timestamp: Date;
  code?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserReward {
  id: string;
  userId: string;
  reward: Reward;
  purchaseDate: Date;
  expirationDate?: Date;
  code?: string;
  used: boolean;
} 