import { useState, useEffect } from 'react';
import { Radio, Eye, Flame } from 'lucide-react';

const LiveScoreboard = () => {
  const [matches, setMatches] = useState([
    {
      id: 1,
      player1: { name: 'ThunderSmash', score: 9 },
      player2: { name: 'ApexAttack', score: 7 },
      isLive: true,
      table: 'Table 1'
    },
    {
      id: 2,
      player1: { name: 'VortexViper', score: 11 },
      player2: { name: 'ShadowServe', score: 9 },
      isLive: false,
      table: 'Table 2',
      justEnded: true
    },
    {
      id: 3,
      player1: { name: 'SpinMaster', score: 5 },
      player2: { name: 'NeonNinja', score: 4 },
      isLive: true,
      table: 'Table 3'
    }
  ]);

  // Simulate live score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(match => {
        if (match.isLive && Math.random() > 0.7) {
          const scorePlayer = Math.random() > 0.5 ? 'player1' : 'player2';
          const newScore = match[scorePlayer].score + 1;
          
          // Check if match ends
          if (newScore >= 11) {
            return {
              ...match,
              [scorePlayer]: { ...match[scorePlayer], score: newScore },
              isLive: false,
              justEnded: true
            };
          }
          
          return {
            ...match,
            [scorePlayer]: { ...match[scorePlayer], score: newScore }
          };
        }
        return match;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const MatchCard = ({ match }) => (
    <div className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${
      match.isLive ? 'border-2 border-[#39FF14]/50' : ''
    }`}>
      {/* Live Badge */}
      {match.isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Just Ended Badge */}
      {match.justEnded && !match.isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Just Ended</span>
        </div>
      )}

      {/* Table Info */}
      <div className="mb-4">
        <span className="text-xs text-[#00D4FF] uppercase tracking-wider font-semibold">{match.table}</span>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between gap-4">
        {/* Player 1 */}
        <div className="flex-1 text-center">
          <p className={`text-lg md:text-xl font-bold mb-2 ${
            match.player1.score > match.player2.score ? 'text-[#39FF14]' : 'text-white'
          }`}>
            {match.player1.name}
          </p>
          <div className={`text-4xl md:text-6xl font-black ${
            match.player1.score > match.player2.score ? 'text-[#39FF14] neon-text' : 'text-white'
          }`}>
            {match.player1.score}
          </div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center px-4">
          <span className="text-2xl font-bold text-gray-500">VS</span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 text-center">
          <p className={`text-lg md:text-xl font-bold mb-2 ${
            match.player2.score > match.player1.score ? 'text-[#39FF14]' : 'text-white'
          }`}>
            {match.player2.name}
          </p>
          <div className={`text-4xl md:text-6xl font-black ${
            match.player2.score > match.player1.score ? 'text-[#39FF14] neon-text' : 'text-white'
          }`}>
            {match.player2.score}
          </div>
        </div>
      </div>

      {/* Progress Bar (for live matches) */}
      {match.isLive && (
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#39FF14] to-[#00D4FF] transition-all duration-500"
            style={{ 
              width: `${((match.player1.score + match.player2.score) / 22) * 100}%` 
            }}
          ></div>
        </div>
      )}
    </div>
  );

  const liveCount = matches.filter(m => m.isLive).length;

  return (
    <section className="py-16 px-4 bg-black/30" id="live">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-black gradient-text">LIVE SCOREBOARD</h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <p className="text-gray-400">
              <span className="text-[#39FF14] font-bold">{liveCount}</span> match{liveCount !== 1 ? 'es' : ''} in progress
            </p>
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {/* No Live Matches Fallback */}
        {liveCount === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No live matches right now</p>
            <p className="text-gray-600 text-sm mt-2">Check back soon for more action! 🏓</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveScoreboard;
