import { useState } from 'react';
import { BarChart3, TrendingUp, Medal, Crown, Award, ChevronUp, ChevronDown } from 'lucide-react';

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState('wins');
  const [sortOrder, setSortOrder] = useState('desc');

  const players = [
    { rank: 1, name: 'ThunderSmash', wins: 7, losses: 0, points: 77, streak: 7, dormRoom: 'A-204' },
    { rank: 2, name: 'ApexAttack', wins: 6, losses: 1, points: 66, streak: 4, dormRoom: 'B-112' },
    { rank: 3, name: 'VortexViper', wins: 5, losses: 2, points: 55, streak: 2, dormRoom: 'C-305' },
    { rank: 4, name: 'ShadowServe', wins: 5, losses: 2, points: 52, streak: 1, dormRoom: 'A-108' },
    { rank: 5, name: 'SpinMaster', wins: 4, losses: 3, points: 44, streak: 0, dormRoom: 'D-201' },
    { rank: 6, name: 'PhantomPong', wins: 4, losses: 3, points: 42, streak: 2, dormRoom: 'B-303' },
    { rank: 7, name: 'TurboTwist', wins: 3, losses: 4, points: 33, streak: 0, dormRoom: 'C-110' },
    { rank: 8, name: 'SwiftStrike', wins: 3, losses: 4, points: 31, streak: 1, dormRoom: 'A-405' },
    { rank: 9, name: 'NeonNinja', wins: 2, losses: 5, points: 22, streak: 0, dormRoom: 'D-102' },
    { rank: 10, name: 'CyberSpin', wins: 1, losses: 6, points: 11, streak: 0, dormRoom: 'B-208' },
  ];

  const sortedPlayers = [...players].sort((a, b) => {
    const multiplier = sortOrder === 'desc' ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'desc' 
      ? <ChevronDown className="w-4 h-4 inline" /> 
      : <ChevronUp className="w-4 h-4 inline" />;
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-gray-500 font-bold">{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-500/10 border-l-4 border-yellow-400';
      case 2: return 'bg-gray-400/10 border-l-4 border-gray-400';
      case 3: return 'bg-amber-600/10 border-l-4 border-amber-600';
      default: return 'border-l-4 border-transparent';
    }
  };

  return (
    <section className="py-16 px-4 bg-black/20" id="leaderboard">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-[#39FF14]" />
            <h2 className="text-3xl md:text-5xl font-black gradient-text">LEADERBOARD</h2>
          </div>
          <p className="text-gray-400">Top players ranked by total wins</p>
        </div>

        {/* Top 3 Cards (Mobile) */}
        <div className="grid grid-cols-3 gap-3 mb-8 md:hidden">
          {players.slice(0, 3).map((player, index) => (
            <div 
              key={player.name}
              className={`glass-card p-4 text-center ${index === 0 ? 'border-2 border-yellow-400/50' : ''}`}
            >
              <div className="mb-2">{getRankIcon(index + 1)}</div>
              <p className="text-sm font-bold text-white truncate">{player.name}</p>
              <p className="text-xs text-gray-400">{player.wins}W - {player.losses}L</p>
              <p className="text-lg font-bold text-[#39FF14] mt-1">{player.points} pts</p>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/10 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Player</div>
            <div 
              className="col-span-2 text-center cursor-pointer hover:text-[#39FF14] transition-colors"
              onClick={() => handleSort('wins')}
            >
              Wins <SortIcon column="wins" />
            </div>
            <div 
              className="col-span-2 text-center cursor-pointer hover:text-[#39FF14] transition-colors"
              onClick={() => handleSort('losses')}
            >
              Losses <SortIcon column="losses" />
            </div>
            <div 
              className="col-span-2 text-center cursor-pointer hover:text-[#39FF14] transition-colors"
              onClick={() => handleSort('points')}
            >
              Points <SortIcon column="points" />
            </div>
            <div className="col-span-1 text-center">
              <TrendingUp className="w-4 h-4 inline" />
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.name}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${getRankClass(player.rank)}`}
              >
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 flex justify-center">
                  {getRankIcon(player.rank)}
                </div>
                
                {/* Player Name */}
                <div className="col-span-6 md:col-span-4">
                  <p className={`font-bold ${player.rank <= 3 ? 'text-[#39FF14]' : 'text-white'}`}>
                    {player.name}
                  </p>
                  <p className="text-xs text-gray-500">{player.dormRoom}</p>
                </div>
                
                {/* Wins */}
                <div className="col-span-2 md:col-span-2 text-center">
                  <span className="text-[#39FF14] font-bold">{player.wins}</span>
                  <span className="md:hidden text-gray-500 text-xs">W</span>
                </div>
                
                {/* Losses */}
                <div className="hidden md:block md:col-span-2 text-center">
                  <span className="text-red-400 font-bold">{player.losses}</span>
                </div>
                
                {/* Points */}
                <div className="col-span-2 md:col-span-2 text-center">
                  <span className="text-[#00D4FF] font-bold">{player.points}</span>
                  <span className="md:hidden text-gray-500 text-xs">pts</span>
                </div>
                
                {/* Streak */}
                <div className="hidden md:flex md:col-span-1 justify-center">
                  {player.streak > 0 && (
                    <span className="flex items-center gap-1 text-xs text-orange-400">
                      🔥 {player.streak}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#39FF14]">47</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Matches</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-[#00D4FF]">483</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Points</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">7</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Best Streak</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
