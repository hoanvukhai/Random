import { useState, useCallback } from 'react';
import type { GameState, GameConfig } from '../types';
import { DEFAULT_CONFIG } from '../types';
import { buildShuffledQueue } from '../utils/shuffle';

const GAME_KEY = 'football-randomizer-state';
const CONFIG_KEY = 'football-randomizer-config';

// ── Config persistence (survives full reset) ──────────────────────────────────

function loadSavedConfig(): GameConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: GameConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch { /* ignore */ }
}

// ── Game state persistence ────────────────────────────────────────────────────

function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

function saveGameState(state: GameState) {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function clearGameState() {
  try {
    localStorage.removeItem(GAME_KEY);
  } catch { /* ignore */ }
}

// ── Initial state ─────────────────────────────────────────────────────────────

function createFreshState(config?: GameConfig): GameState {
  return {
    phase: 'setup',
    config: config ?? loadSavedConfig(),
    shuffledQueue: [],
    results: [],
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, setStateRaw] = useState<GameState>(() => {
    return loadGameState() ?? createFreshState();
  });

  const setState = useCallback((updater: (prev: GameState) => GameState) => {
    setStateRaw((prev) => {
      const next = updater(prev);
      saveGameState(next);
      return next;
    });
  }, []);

  /** Start the game with a given config (also persists config). */
  const startGame = useCallback((config: GameConfig) => {
    saveConfig(config);
    const queue = buildShuffledQueue(config.totalPlayers);
    setState(() => ({
      phase: 'action',
      config,
      shuffledQueue: queue,
      results: [],
    }));
  }, [setState]);

  /** Draw next player from queue. */
  const drawNext = useCallback(() => {
    setState((prev) => {
      if (prev.shuffledQueue.length === 0) return prev;
      const [team, ...rest] = prev.shuffledQueue;
      const playerNumber = prev.results.length + 1;
      const newResults = [...prev.results, { playerNumber, team }];
      const newPhase = rest.length === 0 ? 'summary' : 'action';
      return { ...prev, phase: newPhase, shuffledQueue: rest, results: newResults };
    });
  }, [setState]);

  /** Redo with same config — goes back to action screen with fresh shuffle. */
  const resetKeepConfig = useCallback(() => {
    setState((prev) => {
      const queue = buildShuffledQueue(prev.config.totalPlayers);
      return { phase: 'action', config: prev.config, shuffledQueue: queue, results: [] };
    });
  }, [setState]);

  /** Go back to setup screen, keeping config pre-filled but clearing game progress. */
  const goToSetup = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'setup', shuffledQueue: [], results: [] }));
  }, [setState]);

  /** Full reset — goes back to setup with last saved config (names/colors preserved). */
  const resetFull = useCallback(() => {
    clearGameState();
    const fresh = createFreshState();
    setStateRaw(fresh);
  }, []);

  /** Jump directly to summary (e.g. view results again). */
  const goToSummary = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'summary' }));
  }, [setState]);

  return { state, startGame, drawNext, resetKeepConfig, goToSetup, resetFull, goToSummary };
}
