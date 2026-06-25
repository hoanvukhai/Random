export type TeamId = 'A' | 'B';
export type GamePhase = 'setup' | 'action' | 'summary';

export interface TeamConfig {
  name: string;
  color: string; // hex color
}

export interface GameConfig {
  totalPlayers: number;
  teamA: TeamConfig;
  teamB: TeamConfig;
}

export interface DrawResult {
  playerNumber: number; // 1-indexed
  team: TeamId;
}

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  shuffledQueue: TeamId[]; // remaining draws
  results: DrawResult[];   // completed draws
}

export const PRESET_COLORS = [
  { label: 'Đỏ', value: '#e94560' },
  { label: 'Xanh dương', value: '#3b82f6' },
  { label: 'Xanh lá', value: '#22c55e' },
  { label: 'Vàng', value: '#eab308' },
  { label: 'Cam', value: '#f97316' },
  { label: 'Tím', value: '#a855f7' },
  { label: 'Hồng', value: '#ec4899' },
  { label: 'Trắng', value: '#e5e7eb' },
];

export const DEFAULT_CONFIG: GameConfig = {
  totalPlayers: 10,
  teamA: { name: 'Áo Xanh', color: '#3b82f6' },
  teamB: { name: 'Áo Đỏ', color: '#e94560' },
};
