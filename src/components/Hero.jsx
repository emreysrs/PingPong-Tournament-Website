import { useState, useEffect } from 'react';
import { Trophy, Zap, Timer } from 'lucide-react';

const Hero = ({ onJoinClick }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Event date: January 20, 2026 at 18:00
    const eventDate = new Date('2026-01-20T18:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="glass-card px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
        <span className="text-3xl md:text-5xl font-bold gradient-text">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#39FF14]/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#00D4FF]/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-[#39FF14]" />
            <Zap className="absolute -top-2 -right-2 w-8 h-8 text-[#00D4FF] animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tight">
          <span className="gradient-text">DORM WARS</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
          Table Tennis <span className="text-[#39FF14]">Championship</span>
        </h2>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-md mx-auto">
          🏓 Smash your way to glory. Dominate the dorms. Become the legend.
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-[#00D4FF]" />
            <span className="text-sm md:text-base text-[#00D4FF] uppercase tracking-widest font-semibold">Tournament Starts In</span>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <TimeBlock value={timeLeft.days} label="Days" />
            <span className="text-3xl md:text-5xl font-bold text-[#39FF14] mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <span className="text-3xl md:text-5xl font-bold text-[#39FF14] mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.minutes} label="Mins" />
            <span className="text-3xl md:text-5xl font-bold text-[#39FF14] mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={onJoinClick}
          className="neon-button text-lg md:text-xl px-8 py-4 md:px-12 md:py-5 uppercase tracking-wider font-black"
        >
          🎯 Join the Tournament
        </button>

        {/* Stats Preview */}
        <div className="flex items-center justify-center gap-8 mt-12 text-gray-400">
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-bold text-[#39FF14]">16</span>
            <span className="text-xs uppercase tracking-wider">Players</span>
          </div>
          <div className="w-px h-10 bg-gray-700"></div>
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-bold text-[#00D4FF]">4</span>
            <span className="text-xs uppercase tracking-wider">Rounds</span>
          </div>
          <div className="w-px h-10 bg-gray-700"></div>
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-bold text-[#39FF14]">1</span>
            <span className="text-xs uppercase tracking-wider">Champion</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
