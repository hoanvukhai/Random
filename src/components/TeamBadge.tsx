import React from 'react';
import type { TeamId, TeamConfig } from '../types';
import './TeamBadge.css';

interface TeamBadgeProps {
  team: TeamId;
  config: TeamConfig;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const TeamBadge: React.FC<TeamBadgeProps> = ({ team, config, count, size = 'md' }) => {
  return (
    <div className={`team-badge team-badge--${size}`} style={{ '--team-color': config.color } as React.CSSProperties}>
      <div className="team-badge__dot" />
      <span className="team-badge__name">{config.name}</span>
      {count !== undefined && (
        <span className="team-badge__count">{count}</span>
      )}
    </div>
  );
};

export default TeamBadge;
