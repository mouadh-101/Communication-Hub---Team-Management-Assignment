import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TeamList from './TeamList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { Team, Message } from '../types/index';
import { getTeams, getTeamMessages, sendMessage, createTeam, addTeamMember, getTeamMembers, getTenantUsers } from '../api/teamApi';
import type { UserSummary } from '../types/index';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserSummary[]>([]);
  const [tenantUsers, setTenantUsers] = useState<UserSummary[]>([]);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || null;

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId && selectedTeam?.isMember) {
      loadMessages(selectedTeamId);
      loadMembers(selectedTeamId);
      const interval = setInterval(() => {
        loadMessages(selectedTeamId);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
      setTeamMembers([]);
    }
  }, [selectedTeamId, selectedTeam?.isMember]);

  useEffect(() => {
    loadTenantUsers();
  }, []);

  const loadTeams = async () => {
    setTeamsLoading(true);
    setError('');
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setTeamsLoading(false);
    }
  };

  const loadMessages = async (teamId: string) => {
    setMessagesLoading(true);
    setError('');
    try {
      const data = await getTeamMessages(teamId);
      setMessages(data);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('No access to this team');
      } else {
        setError('Failed to load messages');
      }
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedTeamId || !selectedTeam?.isMember) {
      setError('No access to this team');
      return;
    }
    try {
      await sendMessage(selectedTeamId, content);
      await loadMessages(selectedTeamId);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('No access to this team');
      } else {
        setError('Failed to send message');
      }
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    setCreatingTeam(true);
    setError('');
    try {
      const created = await createTeam(newTeamName.trim(), newTeamDescription.trim() || undefined);
      setTeams((prev) => [created, ...prev]);
      setSelectedTeamId(created.id);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (err) {
      setError('Failed to create team');
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedTeamId || !userId || !selectedTeam?.isMember) return;
    setAddingMember(true);
    setError('');
    try {
      await addTeamMember(selectedTeamId, userId);
      await loadMembers(selectedTeamId);
    } catch (err) {
      setError('Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const loadMembers = async (teamId: string) => {
    try {
      const members = await getTeamMembers(teamId);
      setTeamMembers(members);
    } catch (err) {
      // silent; shown when opening modal
    }
  };

  const loadTenantUsers = async () => {
    try {
      const users = await getTenantUsers();
      setTenantUsers(users);
    } catch (err) {
      // ignore for now
    }
  };

  const nonMemberUsers = tenantUsers.filter((u) => !teamMembers.some((m) => m.id === u.id));

  const openMembersModal = () => {
    if (selectedTeamId && selectedTeam?.isMember) {
      loadMembers(selectedTeamId);
      setMembersModalOpen(true);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Communication Hub</h2>
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      {error && <div className="error-message">{error}</div>}
      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h4 className="sidebar-title">Create Team</h4>
            <input
              className="input"
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Description (optional)"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
            />
            <button
              className="primary-button"
              onClick={handleCreateTeam}
              disabled={creatingTeam || !newTeamName.trim()}
            >
              {creatingTeam ? 'Creating...' : 'Create Team'}
            </button>
          </div>
          <TeamList
            teams={teams}
            selectedTeamId={selectedTeamId}
            onSelectTeam={setSelectedTeamId}
            loading={teamsLoading}
          />
        </aside>
        <div className="dashboard-content">
          {selectedTeamId ? (
            <>
              <div className="message-header">
                <h3 className="team-title">
                  {selectedTeam?.name}
                </h3>
                {selectedTeam?.isMember && (
                  <button onClick={openMembersModal} className="refresh-button">
                    Members
                  </button>
                )}
              </div>
              {selectedTeam?.isMember ? (
                <>
                  <MessageList messages={messages} loading={messagesLoading} />
                  <MessageInput onSend={handleSendMessage} disabled={false} />
                </>
              ) : (
                <div className="no-access">You don't have access to this team's messages.</div>
              )}
            </>
          ) : (
            <div className="empty-state">Select a team to view messages</div>
          )}
        </div>
      </div>

      {membersModalOpen && (
        <div className="modal-overlay" onClick={() => setMembersModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Team Members</h3>
              <button className="close-button" onClick={() => setMembersModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Current members</h4>
                {teamMembers.length === 0 ? (
                  <p className="muted">No members yet.</p>
                ) : (
                  <ul className="list">
                    {teamMembers.map((m) => (
                      <li key={m.id} className="list-item">
                        <div>
                          <div className="name">{m.name}</div>
                          <div className="muted">{m.email}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="modal-section">
                <h4>Add member (same tenant)</h4>
                {nonMemberUsers.length === 0 ? (
                  <p className="muted">No additional users available.</p>
                ) : (
                  <ul className="list">
                    {nonMemberUsers.map((u) => (
                      <li key={u.id} className="list-item">
                        <div>
                          <div className="name">{u.name}</div>
                          <div className="muted">{u.email}</div>
                        </div>
                        <button
                          className="secondary-button"
                          onClick={() => handleAddMember(u.id)}
                          disabled={addingMember}
                        >
                          {addingMember ? 'Adding...' : 'Add'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
