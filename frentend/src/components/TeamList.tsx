import React from 'react';
import type { Team } from '../types/index';
import '../styles/TeamList.css';

interface TeamListProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  loading: boolean;
}

const TeamList: React.FC<TeamListProps> = ({ teams, selectedTeamId, onSelectTeam, loading }) => {
  if (loading) {
    return <div className="team-list">Loading teams...</div>;
  }

  if (teams.length === 0) {
    return <div className="team-list">No teams available</div>;
  }

  return (
    <div className="team-list">
      <h3 className="team-list-header">Teams</h3>
      <div className="team-list-items">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`team-item ${selectedTeamId === team.id ? 'selected' : ''}`}
            onClick={() => onSelectTeam(team.id)}
          >
            <div className="team-name">{team.name}</div>
            <div className={`team-pill ${team.isMember ? 'member' : 'view-only'}`}>
              {team.isMember ? 'Member' : 'No access'}
            </div>
            {team.description && (
              <div className="team-description">{team.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
