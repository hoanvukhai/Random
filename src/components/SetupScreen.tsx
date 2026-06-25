import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameConfig, TeamId } from '../types';
import { DEFAULT_CONFIG, PRESET_COLORS } from '../types';
import { saveConfig } from '../hooks/useGameState';
import './SetupScreen.css';

interface SetupScreenProps {
  initialConfig?: GameConfig;
  onStart: (config: GameConfig) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ initialConfig, onStart }) => {
  const [config, setConfig] = useState<GameConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [editingTeam, setEditingTeam] = useState<TeamId | null>(null);
  const [editingName, setEditingName] = useState('');

  // Auto-save config to localStorage on every change
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const teamACount = Math.ceil(config.totalPlayers / 2);
  const teamBCount = Math.floor(config.totalPlayers / 2);
  const isOdd = config.totalPlayers % 2 !== 0;

  const updateTotal = (delta: number) => {
    setConfig((c) => ({
      ...c,
      totalPlayers: Math.min(30, Math.max(2, c.totalPlayers + delta)),
    }));
  };

  const startEditName = (team: TeamId) => {
    setEditingTeam(team);
    setEditingName(team === 'A' ? config.teamA.name : config.teamB.name);
  };

  const commitEditName = () => {
    if (!editingTeam) return;
    const key = editingTeam === 'A' ? 'teamA' : 'teamB';
    const fallback = editingTeam === 'A' ? 'Đội A' : 'Đội B';
    const name = editingName.trim() || fallback;
    setConfig((c) => ({ ...c, [key]: { ...c[key], name } }));
    setEditingTeam(null);
  };

  const setTeamColor = (team: TeamId, color: string) => {
    const key = team === 'A' ? 'teamA' : 'teamB';
    setConfig((c) => ({ ...c, [key]: { ...c[key], color } }));
  };

  return (
    <motion.div
      className="setup-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="setup-screen__header">
        <div className="setup-screen__icon">⚽</div>
        <h1 className="setup-screen__title">Chia Đội</h1>
        <p className="setup-screen__subtitle">Xếp hàng — mỗi người bấm một lần</p>
      </div>

      {/* Player count */}
      <div className="setup-section">
        <label className="setup-label">Số người tham gia</label>
        <div className="player-counter">
          <button
            className="counter-btn"
            onClick={() => updateTotal(-1)}
            disabled={config.totalPlayers <= 2}
            aria-label="Giảm số người"
            id="btn-decrease-players"
          >
            −
          </button>
          <div className="counter-display">
            <span className="counter-number">{config.totalPlayers}</span>
            <span className="counter-unit">người</span>
          </div>
          <button
            className="counter-btn"
            onClick={() => updateTotal(1)}
            disabled={config.totalPlayers >= 30}
            aria-label="Tăng số người"
            id="btn-increase-players"
          >
            +
          </button>
        </div>

        <div className="split-info">
          <span className="split-chip" style={{ '--chip-color': config.teamA.color } as React.CSSProperties}>
            {config.teamA.name}: {teamACount}
          </span>
          <span className="split-separator">vs</span>
          <span className="split-chip" style={{ '--chip-color': config.teamB.color } as React.CSSProperties}>
            {config.teamB.name}: {teamBCount}
          </span>
          {isOdd && <span className="split-odd-note">⚠ Số lẻ</span>}
        </div>
      </div>

      {/* Team configuration */}
      <div className="setup-section">
        <label className="setup-label">Cài đặt đội</label>
        <div className="teams-grid">
          {(['A', 'B'] as TeamId[]).map((team) => {
            const tc = team === 'A' ? config.teamA : config.teamB;
            return (
              <div
                key={team}
                className="team-card"
                style={{ '--team-color': tc.color } as React.CSSProperties}
              >
                <div className="team-card__color-bar" />
                <div className="team-card__body">
                  {editingTeam === team ? (
                    <input
                      className="team-name-input"
                      value={editingName}
                      autoFocus
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={commitEditName}
                      onKeyDown={(e) => e.key === 'Enter' && commitEditName()}
                      maxLength={20}
                      id={`input-team-${team}-name`}
                    />
                  ) : (
                    <button
                      className="team-name-btn"
                      onClick={() => startEditName(team)}
                      title="Nhấn để đổi tên"
                      id={`btn-edit-team-${team}`}
                    >
                      {tc.name}
                      <span className="edit-icon">✏️</span>
                    </button>
                  )}
                  <div className="color-picker">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.value}
                        className={`color-dot ${tc.color === preset.value ? 'color-dot--active' : ''}`}
                        style={{ background: preset.value }}
                        onClick={() => setTeamColor(team, preset.value)}
                        title={preset.label}
                        aria-label={`Chọn màu ${preset.label} cho đội ${tc.name}`}
                        id={`btn-color-${team}-${preset.label}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        className="start-btn"
        onClick={() => onStart(config)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        id="btn-start-game"
      >
        <span className="start-btn__icon">🎲</span>
        Bắt đầu rút thăm
      </motion.button>
    </motion.div>
  );
};

export default SetupScreen;
