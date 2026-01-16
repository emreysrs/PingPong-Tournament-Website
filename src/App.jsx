import { useState, useEffect } from 'react';
import { supabase } from './supabase';

/**
 * Main Application Component
 * 
 * A real-time ping pong tournament management system with:
 * - Player registration
 * - Live match scoring
 * - Admin panel for tournament management
 * - Real-time updates via Supabase subscriptions
 */
function App() {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data state
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState('home');
  const [message, setMessage] = useState('');
  
  // Registration form state
  const [regName, setRegName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  
  // Admin state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editScore1, setEditScore1] = useState('');
  const [editScore2, setEditScore2] = useState('');

  /**
   * Fetch all players and matches from Supabase
   */
  const fetchData = async () => {
    try {
      const [playersRes, matchesRes] = await Promise.all([
        supabase.from('players').select('*').order('wins', { ascending: false }),
        supabase.from('matches').select('*').order('created_at', { ascending: false })
      ]);
      
      if (playersRes.data) setPlayers(playersRes.data);
      if (matchesRes.data) setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is admin by looking up admins table
   */
  const checkAdminStatus = async (userId) => {
    try {
      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .single();
      return !!data;
    } catch (err) {
      console.warn('Admin check failed:', err);
      return false;
    }
  };

  /**
   * Initialize app: check auth session, fetch data, setup real-time subscriptions
   */
  useEffect(() => {
    // Check for existing Supabase auth session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const isAdminUser = await checkAdminStatus(session.user.id);
          setIsAdmin(isAdminUser);
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
      }
    };
    initAuth();

    // Restore player session from localStorage
    const savedUser = localStorage.getItem('ppUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ppUser');
      }
    }
    
    // Initial data fetch
    fetchData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdminUser = await checkAdminStatus(session.user.id);
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    });

    // Real-time subscription for matches table
    const matchesChannel = supabase
      .channel('matches-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          console.log('Match update received:', payload);
          if (payload.eventType === 'INSERT') {
            setMatches(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMatches(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
          } else if (payload.eventType === 'DELETE') {
            setMatches(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Real-time subscription for players table
    const playersChannel = supabase
      .channel('players-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        (payload) => {
          console.log('Player update received:', payload);
          if (payload.eventType === 'INSERT') {
            setPlayers(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
          } else if (payload.eventType === 'DELETE') {
            setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(playersChannel);
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Display a temporary success/info message
   */
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  /**
   * Handle player registration or login
   * If player exists with same name + room, log them in. If not, create new player.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const name = regName.trim();
    const room = regNickname.trim() || null;
    
    if (!name) return;
    if (!room) {
      alert('Please enter your room number');
      return;
    }
    
    try {
      // Check if player already exists with same name AND room
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('*')
        .ilike('name', name)
        .ilike('nickname', room)
        .single();
      
      if (existingPlayer) {
        // Player exists - log them in
        setCurrentUser(existingPlayer);
        localStorage.setItem('ppUser', JSON.stringify(existingPlayer));
        setRegName('');
        setRegNickname('');
        return;
      }
      
      // Check if this exact name+room combo is new
      // Player doesn't exist - create new one
      const { data, error } = await supabase
        .from('players')
        .insert([{ 
          name: name, 
          nickname: room,
          wins: 0,
          losses: 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
        return;
      }
      
      // Save user session
      setCurrentUser(data);
      localStorage.setItem('ppUser', JSON.stringify(data));
      
      // Reset form
      setRegName('');
      setRegNickname('');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Connection error. Please try again.');
    }
  };

  /**
   * Handle admin login via Supabase Auth
   */
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      console.log('Attempting login with:', adminEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      
      console.log('Auth response:', { data, error });
      
      if (error) {
        alert('Login failed: ' + error.message);
        setAuthLoading(false);
        return;
      }
      
      // Check if user is in admins table
      const isAdminUser = await checkAdminStatus(data.user.id);
      if (!isAdminUser) {
        await supabase.auth.signOut();
        alert('You are not authorized as admin');
        setAuthLoading(false);
        return;
      }
      
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.message || 'Unknown error'));
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Handle user/admin logout
   */
  const handleLogout = async () => {
    // Sign out from Supabase Auth (for admins)
    await supabase.auth.signOut();
    
    // Clear local state
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('ppUser');
  };

  /**
   * Update match score (Admin only)
   * Automatically determines winner when match ends
   */
  const handleUpdateScore = async (matchId) => {
    const score1 = parseInt(editScore1) || 0;
    const score2 = parseInt(editScore2) || 0;
    
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    let updateData = { 
      player1_score: score1, 
      player2_score: score2,
      status: 'live'
    };
    
    // Check for match completion (first to 11, win by 2)
    const isComplete = (score1 >= 11 || score2 >= 11) && Math.abs(score1 - score2) >= 2;
    
    if (isComplete) {
      updateData.status = 'finished';
      updateData.winner_id = score1 > score2 ? match.player1_id : match.player2_id;
      
      // Update player statistics
      const winnerId = updateData.winner_id;
      const loserId = winnerId === match.player1_id ? match.player2_id : match.player1_id;
      
      const winner = players.find(p => p.id === winnerId);
      const loser = players.find(p => p.id === loserId);
      
      if (winner) {
        await supabase.from('players').update({ wins: (winner.wins || 0) + 1 }).eq('id', winnerId);
      }
      if (loser) {
        await supabase.from('players').update({ losses: (loser.losses || 0) + 1 }).eq('id', loserId);
      }
    }
    
    const { error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId);
    
    if (error) {
      console.error('Error updating score:', error);
      return;
    }
    
    // Reset edit state
    setEditingMatch(null);
    setEditScore1('');
    setEditScore2('');
    showMessage('✓ Score updated!');
  };

  /**
   * Create a new match between two players (Admin only)
   */
  const handleCreateMatch = async (player1Id, player2Id) => {
    if (!player1Id || !player2Id || player1Id === player2Id) {
      alert('Please select two different players');
      return;
    }
    
    const { error } = await supabase
      .from('matches')
      .insert([{
        player1_id: player1Id,
        player2_id: player2Id,
        player1_score: 0,
        player2_score: 0,
        status: 'upcoming'
      }]);
    
    if (error) {
      console.error('Error creating match:', error);
      return;
    }
    showMessage('✓ Match created!');
  };

  /**
   * Delete a player (Admin only)
   */
  const handleDeletePlayer = async (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    if (!confirm(`Delete ${player.name}?`)) return;
    
    const { error } = await supabase.from('players').delete().eq('id', playerId);
    if (error) {
      console.error('Error deleting player:', error);
      return;
    }
    showMessage('✓ Player deleted!');
  };

  /**
   * Delete a match (Admin only)
   */
  const handleDeleteMatch = async (matchId) => {
    if (!confirm('Delete this match?')) return;
    
    const { error } = await supabase.from('matches').delete().eq('id', matchId);
    if (error) {
      console.error('Error deleting match:', error);
      return;
    }
    showMessage('✓ Match deleted!');
  };

  /**
   * Get player name by ID
   */
  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Registration gate for new users
  if (!currentUser && !isAdmin) {
    return (
      <div className="gate-container">
        <div className="gate-card">
          <h1>Ping Pong Tournament</h1>
          <p>Enter your name and room number to join or sign back in</p>
          
          <form onSubmit={handleRegister} className="gate-form">
            <input
              type="text"
              placeholder="Your Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
              autoComplete="name"
            />
            <input
              type="text"
              placeholder="Room Number"
              value={regNickname}
              onChange={(e) => setRegNickname(e.target.value)}
              required
              autoComplete="off"
            />
            <button type="submit" className="gate-submit">
              Continue
            </button>
          </form>
          
          <div className="gate-divider">
            <span>or</span>
          </div>
          
          {!showAdminLogin ? (
            <button 
              className="admin-link"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin Login
            </button>
          ) : (
            <form onSubmit={handleAdminLogin} className="admin-form">
              <input
                type="email"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="admin-buttons">
                <button type="submit" disabled={authLoading}>
                  {authLoading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" onClick={() => setShowAdminLogin(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        
        <p className="gate-footer">EDGE Berlin © Edge Student Hub GmbH 2026</p>
      </div>
    );
  }

  // Admin Panel
  if (isAdmin && activeTab === 'admin') {
    return (
      <div className="container">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => setActiveTab('home')}>
              View Site
            </button>
            <button className="nav-link logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <main className="main-content">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="section-desc">Manage players and matches</p>
          
          {message && <div className="success-message">{message}</div>}

          {/* Statistics */}
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="stat-number">{players.length}</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="admin-stat">
              <span className="stat-number">{matches.filter(m => m.status === 'live').length}</span>
              <span className="stat-label">Live Matches</span>
            </div>
          </div>

          {/* Live Matches */}
          <h2 className="admin-subtitle">Live Matches</h2>
          <div className="matches-list">
            {matches.filter(m => m.status === 'live').map(match => (
              <div key={match.id} className="match-card live">
                <div className="match-players">
                  <span>{getPlayerName(match.player1_id)}</span>
                  <span className="vs">vs</span>
                  <span>{getPlayerName(match.player2_id)}</span>
                </div>
                {editingMatch === match.id ? (
                  <div className="match-edit">
                    <input
                      type="number"
                      value={editScore1}
                      onChange={(e) => setEditScore1(e.target.value)}
                      placeholder="0"
                      min="0"
                      inputMode="numeric"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={editScore2}
                      onChange={(e) => setEditScore2(e.target.value)}
                      placeholder="0"
                      min="0"
                      inputMode="numeric"
                    />
                    <button onClick={() => handleUpdateScore(match.id)}>Save</button>
                    <button onClick={() => setEditingMatch(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="match-score">
                    <span className="score">{match.player1_score} - {match.player2_score}</span>
                    <button onClick={() => {
                      setEditingMatch(match.id);
                      setEditScore1(match.player1_score.toString());
                      setEditScore2(match.player2_score.toString());
                    }}>Edit</button>
                    <button className="delete" onClick={() => handleDeleteMatch(match.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
            {matches.filter(m => m.status === 'live').length === 0 && (
              <p className="no-data">No live matches</p>
            )}
          </div>

          {/* Upcoming Matches */}
          <h2 className="admin-subtitle">Upcoming Matches</h2>
          <div className="matches-list">
            {matches.filter(m => m.status === 'upcoming').map(match => (
              <div key={match.id} className="match-card">
                <div className="match-players">
                  <span>{getPlayerName(match.player1_id)}</span>
                  <span className="vs">vs</span>
                  <span>{getPlayerName(match.player2_id)}</span>
                </div>
                <div className="match-actions">
                  <button onClick={() => {
                    setEditingMatch(match.id);
                    setEditScore1('0');
                    setEditScore2('0');
                  }}>Start Match</button>
                  <button className="delete" onClick={() => handleDeleteMatch(match.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Match */}
          <h2 className="admin-subtitle">Create Match</h2>
          <div className="create-match">
            <select id="player1" aria-label="Select Player 1">
              <option value="">Select Player 1</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <span>vs</span>
            <select id="player2" aria-label="Select Player 2">
              <option value="">Select Player 2</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button onClick={() => {
              const p1 = document.getElementById('player1').value;
              const p2 = document.getElementById('player2').value;
              handleCreateMatch(p1, p2);
            }}>Create</button>
          </div>

          {/* Players Table */}
          <h2 className="admin-subtitle">All Players</h2>
          <div className="admin-table">
            <div className="table-header">
              <span>Name</span>
              <span>Room</span>
              <span>W/L</span>
              <span>Actions</span>
            </div>
            {players.map(player => (
              <div key={player.id} className="table-row">
                <span>{player.name}</span>
                <span>{player.nickname || '-'}</span>
                <span>{player.wins || 0}/{player.losses || 0}</span>
                <span className="actions">
                  <button className="delete" onClick={() => handleDeletePlayer(player.id)}>
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Main Site
  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand"></div>
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button 
            className={`nav-link ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            Players
          </button>
          {isAdmin && (
            <button 
              className="nav-link admin-nav"
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          )}
          <button className="nav-link logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            <section className="hero">
              <h1>Ping Pong<br />Tournament</h1>
              <p className="hero-subtitle">
                Welcome back, <strong>{currentUser?.name || 'Admin'}</strong>!
              </p>
              <div className="hero-details">
                <div className="detail-card">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">Jan 20</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">18:00</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">Ground Floor</span>
                </div>
              </div>
            </section>

            {/* Live Matches */}
            <section className="live-section">
              <h2>🔴 Live Matches</h2>
              <div className="live-matches">
                {matches.filter(m => m.status === 'live').map(match => (
                  <div key={match.id} className="live-match-card">
                    <div className="live-players">
                      <div className="player-side">
                        <span className="player-name">{getPlayerName(match.player1_id)}</span>
                        <span className="player-score">{match.player1_score}</span>
                      </div>
                      <span className="live-vs">VS</span>
                      <div className="player-side">
                        <span className="player-score">{match.player2_score}</span>
                        <span className="player-name">{getPlayerName(match.player2_id)}</span>
                      </div>
                    </div>
                    <span className="live-badge">LIVE</span>
                  </div>
                ))}
                {matches.filter(m => m.status === 'live').length === 0 && (
                  <p className="no-live">No live matches right now</p>
                )}
              </div>
            </section>

            {/* Statistics */}
            <section className="stats-section">
              <div className="stat-box">
                <span className="stat-number">{players.length}</span>
                <span className="stat-label">Players</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{matches.filter(m => m.status === 'finished').length}</span>
                <span className="stat-label">Matches Played</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{matches.filter(m => m.status === 'upcoming').length}</span>
                <span className="stat-label">Upcoming</span>
              </div>
            </section>

            {/* Leaderboard */}
            <section className="leaderboard-preview">
              <div className="section-header">
                <h2>Leaderboard</h2>
                <button className="text-link" onClick={() => setActiveTab('players')}>
                  View all →
                </button>
              </div>
              <div className="leader-list">
                {players
                  .sort((a, b) => (b.wins || 0) - (a.wins || 0))
                  .slice(0, 5)
                  .map((player, index) => (
                    <div key={player.id} className="leader-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <div className="leader-info">
                        <span className="leader-name">{player.name}</span>
                        <span className="leader-room">{player.nickname || 'No room'}</span>
                      </div>
                      <span className="leader-score">{player.wins || 0}W / {player.losses || 0}L</span>
                    </div>
                  ))}
              </div>
            </section>
          </>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <section className="matches-section">
            <h2>All Matches</h2>
            
            <h3>Live</h3>
            <div className="matches-grid">
              {matches.filter(m => m.status === 'live').map(match => (
                <div key={match.id} className="match-card-full live">
                  <div className="match-status">🔴 LIVE</div>
                  <div className="match-content">
                    <span>{getPlayerName(match.player1_id)}</span>
                    <span className="match-score-big">{match.player1_score} - {match.player2_score}</span>
                    <span>{getPlayerName(match.player2_id)}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3>Upcoming</h3>
            <div className="matches-grid">
              {matches.filter(m => m.status === 'upcoming').map(match => (
                <div key={match.id} className="match-card-full">
                  <div className="match-status">⏳ Upcoming</div>
                  <div className="match-content">
                    <span>{getPlayerName(match.player1_id)}</span>
                    <span className="vs">vs</span>
                    <span>{getPlayerName(match.player2_id)}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3>Finished</h3>
            <div className="matches-grid">
              {matches.filter(m => m.status === 'finished').map(match => (
                <div key={match.id} className="match-card-full finished">
                  <div className="match-status">✓ Finished</div>
                  <div className="match-content">
                    <span className={match.winner_id === match.player1_id ? 'winner' : ''}>
                      {getPlayerName(match.player1_id)}
                    </span>
                    <span className="match-score-big">{match.player1_score} - {match.player2_score}</span>
                    <span className={match.winner_id === match.player2_id ? 'winner' : ''}>
                      {getPlayerName(match.player2_id)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <section className="players-section">
            <h2>All Players</h2>
            <p className="section-desc">
              {players.length} players in the tournament
            </p>
            <div className="players-grid">
              {players
                .sort((a, b) => (b.wins || 0) - (a.wins || 0))
                .map((player, index) => (
                  <div key={player.id} className="player-card">
                    <div className="player-rank">#{index + 1}</div>
                    <div className="player-avatar">
                      {player.name.charAt(0)}
                    </div>
                    <h3>{player.name}</h3>
                    <p>{player.nickname || 'No room'}</p>
                    <div className="player-score">{player.wins || 0}W / {player.losses || 0}L</div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© Edge Student Hub GmbH 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
