import React from 'react';
import { motion } from 'framer-motion';
import type { GameConfig, DrawResult } from '../types';
import { playWhistleSound } from '../utils/sounds';
import './SummaryScreen.css';

interface SummaryScreenProps {
  config: GameConfig;
  results: DrawResult[];
  onReset: () => void;
  onNewSetup: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({
  config,
  results,
  onReset,
  onNewSetup,
}) => {
  const teamAResults = results.filter((r) => r.team === 'A');
  const teamBResults = results.filter((r) => r.team === 'B');

  React.useEffect(() => {
    const timeout = setTimeout(() => playWhistleSound(), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      className="summary-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="summary-header">
        <span className="summary-trophy">🏆</span>
        <h1 className="summary-title">Kết quả chia đội</h1>
        <p className="summary-subtitle">
          {results.length} người — nhớ số của mình nhé!
        </p>
      </div>

      <div className="summary-teams">
        {/* Team A */}
        <motion.div
          className="summary-team-card"
          style={{ '--team-color': config.teamA.color } as React.CSSProperties}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="summary-team-card__header">
            <div className="summary-team-dot" />
            <h2 className="summary-team-name">{config.teamA.name}</h2>
            <span className="summary-team-count">{teamAResults.length}</span>
          </div>
          <div className="summary-players">
            {teamAResults.map((r, i) => (
              <motion.div
                key={r.playerNumber}
                className="summary-player"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <span className="summary-player__number">{r.playerNumber}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team B */}
        <motion.div
          className="summary-team-card"
          style={{ '--team-color': config.teamB.color } as React.CSSProperties}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="summary-team-card__header">
            <div className="summary-team-dot" />
            <h2 className="summary-team-name">{config.teamB.name}</h2>
            <span className="summary-team-count">{teamBResults.length}</span>
          </div>
          <div className="summary-players">
            {teamBResults.map((r, i) => (
              <motion.div
                key={r.playerNumber}
                className="summary-player"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                <span className="summary-player__number">{r.playerNumber}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="summary-actions">
        <motion.button
          className="summary-btn summary-btn--primary"
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          id="btn-chia-lai"
        >
          🔄 Chia lại (cùng cài đặt)
        </motion.button>
        <motion.button
          className="summary-btn summary-btn--secondary"
          onClick={onNewSetup}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          id="btn-cai-dat-moi"
        >
          ⚙️ Cài đặt mới
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SummaryScreen;
