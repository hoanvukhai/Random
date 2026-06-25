import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TeamId, GameConfig } from '../types';
import './FlipCard.css';

interface FlipCardProps {
  result: { playerNumber: number; team: TeamId } | null;
  config: GameConfig;
  isFlipping: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ result, config, isFlipping }) => {
  const teamConfig = result?.team === 'A' ? config.teamA : config.teamB;
  const teamColor = result ? teamConfig.color : '#888';

  return (
    <div className="flip-card-container">
      <motion.div
        className="flip-card"
        animate={{ rotateY: isFlipping ? 180 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front: Question face */}
        <div className="flip-card__face flip-card__front">
          <div className="flip-card__question">
            <span className="flip-card__q-mark">?</span>
            <p className="flip-card__hint">Nhấn để rút thăm</p>
          </div>
        </div>

        {/* Back: Result face */}
        <div
          className="flip-card__face flip-card__back"
          style={{ '--reveal-color': teamColor } as React.CSSProperties}
        >
          {result && (
            <div className="flip-card__result">
              <div className="flip-card__glow" style={{ background: teamColor }} />
              <p className="flip-card__player-label">NGƯỜI SỐ</p>
              <p className="flip-card__player-number">{result.playerNumber}</p>
              <div className="flip-card__divider" style={{ background: teamColor }} />
              <p className="flip-card__team-label">ĐỘI</p>
              <p className="flip-card__team-name" style={{ color: teamColor }}>
                {teamConfig.name}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
