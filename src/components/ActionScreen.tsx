import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameConfig, DrawResult } from '../types';
import FlipCard from './FlipCard';
import TeamBadge from './TeamBadge';
import { playFlipSound, playRevealSound, resumeAudio } from '../utils/sounds';
import './ActionScreen.css';

interface ActionScreenProps {
  config: GameConfig;
  results: DrawResult[];
  totalPlayers: number;
  onDraw: () => void;
  onViewSummary: () => void;
  onGoToSetup: () => void;
  onReshuffle: () => void;
}

type CardPhase = 'idle' | 'flipping' | 'revealed';

const ActionScreen: React.FC<ActionScreenProps> = ({
  config,
  results,
  totalPlayers,
  onDraw,
  onViewSummary,
  onGoToSetup,
  onReshuffle,
}) => {
  const [cardPhase, setCardPhase] = useState<CardPhase>('idle');
  // The result currently shown on the flipped card
  const [shownResult, setShownResult] = useState<DrawResult | null>(null);
  // The result shown as "previous" chip
  const [prevResult, setPrevResult] = useState<DrawResult | null>(null);

  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drawn = results.length;
  const isAllDone = drawn === totalPlayers && cardPhase === 'revealed';

  // Calculate if we actually have different cards left to shuffle
  const halfA = Math.ceil(totalPlayers / 2);
  const halfB = Math.floor(totalPlayers / 2);
  const drawnA = results.filter((r) => r.team === 'A').length;
  const drawnB = results.filter((r) => r.team === 'B').length;
  const remainingA = halfA - drawnA;
  const remainingB = halfB - drawnB;
  const canShuffle = remainingA > 0 && remainingB > 0;

  const teamACount = results.filter((r) => r.team === 'A').length;
  const teamBCount = results.filter((r) => r.team === 'B').length;

  /** User pressed the big draw button. */
  const handleDraw = useCallback(() => {
    if (cardPhase !== 'idle' || isAllDone) return;
    resumeAudio();

    setCardPhase('flipping');
    playFlipSound();

    // Draw the result at mid-flip (150 ms)
    flipTimerRef.current = setTimeout(() => {
      onDraw();
    }, 150);

    // Show result after flip completes (350 ms)
    flipTimerRef.current = setTimeout(() => {
      setCardPhase('revealed');
    }, 350);
  }, [cardPhase, isAllDone, onDraw]);

  // Sync shown result when card reaches "revealed" phase
  React.useEffect(() => {
    if (cardPhase === 'revealed' && results.length > 0) {
      const last = results[results.length - 1];
      setShownResult(last);
      playRevealSound(last.team === 'A');
    }
  }, [cardPhase, results]);

  /** User pressed "Tiếp tục" — reset card for next person. */
  const handleContinue = useCallback(() => {
    if (cardPhase !== 'revealed') return;
    setPrevResult(shownResult);
    setShownResult(null);
    setCardPhase('idle');
  }, [cardPhase, shownResult]);

  const teamConfig = (team: 'A' | 'B') => team === 'A' ? config.teamA : config.teamB;

  return (
    <motion.div
      className="action-screen"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* ── Top bar ── */}
      <div className="action-topbar">
        <button className="back-btn" onClick={onGoToSetup} id="btn-back-to-setup" title="Quay lại cài đặt">
          ← Cài đặt
        </button>
        <div className="action-teams">
          <TeamBadge team="A" config={config.teamA} count={teamACount} size="sm" />
          <span className="action-teams__vs">VS</span>
          <TeamBadge team="B" config={config.teamB} count={teamBCount} size="sm" />
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="action-progress-wrap">
        <div className="action-progress">
          <div
            className="action-progress__bar"
            style={{ width: `${(drawn / totalPlayers) * 100}%` }}
          />
        </div>
        <p className="action-counter">
          {isAllDone
            ? '🎉 Đã rút xong!'
            : cardPhase === 'revealed'
              ? `✅ Người số ${shownResult?.playerNumber} đã rút`
              : `Người thứ ${drawn + 1} / ${totalPlayers}`}
        </p>
      </div>

      {/* ── Previous result chip ── */}
      <div className="prev-result-row">
        <AnimatePresence mode="wait">
          {prevResult && cardPhase === 'idle' && (
            <motion.div
              key={prevResult.playerNumber}
              className="prev-chip"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{ '--prev-color': teamConfig(prevResult.team).color } as React.CSSProperties}
            >
              <span className="prev-chip__label">Lượt trước:</span>
              <span className="prev-chip__dot" />
              <span className="prev-chip__text">
                Người {prevResult.playerNumber} → {teamConfig(prevResult.team).name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Card area ── */}
      <div className="action-card-area">
        <AnimatePresence mode="wait">
          {isAllDone && cardPhase === 'idle' ? (
            <motion.div
              key="done"
              className="action-done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="action-done__emoji">🏆</span>
              <p className="action-done__text">Tất cả đã rút xong!</p>
            </motion.div>
          ) : (
            <motion.div key="card">
              <FlipCard
                result={shownResult}
                config={config}
                isFlipping={cardPhase === 'flipping' || cardPhase === 'revealed'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action buttons ── */}
      <div className="action-bottom">
        <AnimatePresence mode="wait">
          {isAllDone ? (
            <motion.button
              key="summary-btn"
              className="draw-btn draw-btn--summary"
              onClick={onViewSummary}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              id="btn-view-summary"
            >
              📋 Xem kết quả đầy đủ
            </motion.button>
          ) : cardPhase === 'revealed' ? (
            <motion.button
              key="continue-btn"
              className="draw-btn draw-btn--continue"
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              id="btn-continue"
            >
              Tiếp tục ▶
            </motion.button>
          ) : (
            <motion.div
              key="draw-group"
              className="draw-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <motion.button
                className="draw-btn"
                onClick={handleDraw}
                disabled={cardPhase === 'flipping'}
                whileHover={cardPhase === 'idle' ? { scale: 1.03 } : {}}
                whileTap={cardPhase === 'idle' ? { scale: 0.96 } : {}}
                animate={cardPhase === 'idle' ? {
                  boxShadow: [
                    '0 8px 30px rgba(99,102,241,0.4)',
                    '0 8px 50px rgba(99,102,241,0.65)',
                    '0 8px 30px rgba(99,102,241,0.4)',
                  ],
                } : {}}
                transition={cardPhase === 'idle' ? {
                  boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                } : {}}
                id="btn-draw"
              >
                {cardPhase === 'flipping' ? (
                  <span>✨ Đang rút...</span>
                ) : (
                  <>
                    <span className="draw-btn__icon">🎲</span>
                    Nhấn để rút thăm
                  </>
                )}
              </motion.button>
              
              <AnimatePresence>
                {canShuffle && cardPhase === 'idle' && (
                  <motion.button
                    key="shuffle-btn"
                    className="shuffle-btn"
                    onClick={() => {
                      onReshuffle();
                      // Optional: play a fast sound or just let it happen silently
                    }}
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="shuffle-btn__icon">🔀</span> Xào lại bài
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActionScreen;
