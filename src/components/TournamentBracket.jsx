import { useState } from 'react';
import { Trophy, ChevronRight, Crown, Medal } from 'lucide-react';

const TournamentBracket = () => {
  // Sample tournament data for 16 players
  const [bracket] = useState({
    roundOf16: [
      { id: 1, player1: { name: 'ThunderSmash', score: 11 }, player2: { name: 'PingKing', score: 7 }, winner: 1 },
      { id: 2, player1: { name: 'SpinMaster', score: 11 }, player2: { name: 'NeonNinja', score: 9 }, winner: 1 },
      { id: 3, player1: { name: 'AceBlade', score: 8 }, player2: { name: 'SwiftStrike', score: 11 }, winner: 2 },
      { id: 4, player1: { name: 'VortexViper', score: 11 }, player2: { name: 'BlazeBall', score: 5 }, winner: 1 },
      { id: 5, player1: { name: 'ShadowServe', score: 11 }, player2: { name: 'CyberSpin', score: 10 }, winner: 1 },
      { id: 6, player1: { name: 'RocketRally', score: 6 }, player2: { name: 'TurboTwist', score: 11 }, winner: 2 },
      { id: 7, player1: { name: 'PhantomPong', score: 11 }, player2: { name: 'NitroNet', score: 8 }, winner: 1 },
      { id: 8, player1: { name: 'ZenithZone', score: 9 }, player2: { name: 'ApexAttack', score: 11 }, winner: 2 },
    ],
    quarterfinals: [
      { id: 9, player1: { name: 'ThunderSmash', score: 11 }, player2: { name: 'SpinMaster', score: 8 }, winner: 1 },
      { id: 10, player1: { name: 'SwiftStrike', score: 7 }, player2: { name: 'VortexViper', score: 11 }, winner: 2 },
      { id: 11, player1: { name: 'ShadowServe', score: 11 }, player2: { name: 'TurboTwist', score: 9 }, winner: 1 },
      { id: 12, player1: { name: 'PhantomPong', score: 10 }, player2: { name: 'ApexAttack', score: 11 }, winner: 2 },
    ],
    semifinals: [
      { id: 13, player1: { name: 'ThunderSmash', score: 11 }, player2: { name: 'VortexViper', score: 6 }, winner: 1 },
      { id: 14, player1: { name: 'ShadowServe', score: 9 }, player2: { name: 'ApexAttack', score: 11 }, winner: 2 },
    ],
    finals: [
      { id: 15, player1: { name: 'ThunderSmash', score: null }, player2: { name: 'ApexAttack', score: null }, winner: null },
    ]
  });

  const MatchCard = ({ match, roundName, isFinal = false }) => {
    const isComplete = match.winner !== null;
    
    return (
      <div className={`glass-card p-3 md:p-4 ${isFinal ? 'border-2 border-[#39FF14]/50 animate-pulse-neon' : ''}`}>
        {isFinal && (
          <div className="flex items-center justify-center gap-2 mb-2 pb-2 border-b border-white/10">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-xs uppercase tracking-wider text-yellow-400 font-bold">Finals</span>
          </div>
        )}
        
        {/* Player 1 */}
        <div className={`flex items-center justify-between p-2 rounded-lg mb-2 transition-all ${
          match.winner === 1 ? 'bg-[#39FF14]/20 border border-[#39FF14]/50' : 'bg-white/5'
        }`}>
          <span className={`text-sm font-semibold truncate max-w-[100px] md:max-w-[120px] ${
            match.winner === 1 ? 'text-[#39FF14]' : 'text-white'
          }`}>
            {match.player1.name}
          </span>
          <span className={`text-lg font-bold ${
            match.winner === 1 ? 'text-[#39FF14]' : 'text-gray-400'
          }`}>
            {match.player1.score ?? '-'}
          </span>
        </div>
        
        {/* VS Divider */}
        <div className="flex items-center justify-center my-1">
          <span className="text-xs text-gray-500 font-bold">VS</span>
        </div>
        
        {/* Player 2 */}
        <div className={`flex items-center justify-between p-2 rounded-lg transition-all ${
          match.winner === 2 ? 'bg-[#39FF14]/20 border border-[#39FF14]/50' : 'bg-white/5'
        }`}>
          <span className={`text-sm font-semibold truncate max-w-[100px] md:max-w-[120px] ${
            match.winner === 2 ? 'text-[#39FF14]' : 'text-white'
          }`}>
            {match.player2.name}
          </span>
          <span className={`text-lg font-bold ${
            match.winner === 2 ? 'text-[#39FF14]' : 'text-gray-400'
          }`}>
            {match.player2.score ?? '-'}
          </span>
        </div>
        
        {!isComplete && (
          <div className="mt-2 text-center">
            <span className="text-xs text-[#00D4FF] uppercase tracking-wider">Upcoming</span>
          </div>
        )}
      </div>
    );
  };

  const RoundColumn = ({ title, matches, isFinal = false }) => (
    <div className="flex flex-col gap-4">
      <h3 className={`text-center text-sm font-bold uppercase tracking-wider ${
        isFinal ? 'text-[#39FF14] neon-text' : 'text-[#00D4FF]'
      }`}>
        {title}
      </h3>
      <div className="flex flex-col gap-4 justify-around flex-1">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} roundName={title} isFinal={isFinal} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 px-4" id="bracket">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-[#39FF14]" />
            <h2 className="text-3xl md:text-5xl font-black gradient-text">TOURNAMENT BRACKET</h2>
          </div>
          <p className="text-gray-400">16 Players • Single Elimination • One Champion</p>
        </div>

        {/* Bracket Grid - Horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 md:gap-6 min-w-[900px] items-stretch">
            {/* Round of 16 */}
            <div className="flex-1 min-w-[180px]">
              <RoundColumn title="Round of 16" matches={bracket.roundOf16} />
            </div>
            
            {/* Arrow */}
            <div className="flex items-center">
              <ChevronRight className="w-6 h-6 text-[#39FF14]" />
            </div>
            
            {/* Quarterfinals */}
            <div className="flex-1 min-w-[180px]">
              <RoundColumn title="Quarterfinals" matches={bracket.quarterfinals} />
            </div>
            
            {/* Arrow */}
            <div className="flex items-center">
              <ChevronRight className="w-6 h-6 text-[#39FF14]" />
            </div>
            
            {/* Semifinals */}
            <div className="flex-1 min-w-[180px]">
              <RoundColumn title="Semifinals" matches={bracket.semifinals} />
            </div>
            
            {/* Arrow */}
            <div className="flex items-center">
              <ChevronRight className="w-6 h-6 text-[#39FF14]" />
            </div>
            
            {/* Finals */}
            <div className="flex-1 min-w-[180px]">
              <RoundColumn title="🏆 Finals" matches={bracket.finals} isFinal />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#39FF14]"></div>
            <span className="text-gray-400">Winner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#00D4FF]"></div>
            <span className="text-gray-400">Upcoming</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentBracket;
