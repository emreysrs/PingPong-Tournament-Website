import { useState } from 'react';
import { UserPlus, Home, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const PlayerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    dormRoom: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.dormRoom.trim()) {
      newErrors.dormRoom = 'Dorm room is required';
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    } else if (formData.nickname.length < 3) {
      newErrors.nickname = 'Nickname must be at least 3 characters';
    } else if (formData.nickname.length > 15) {
      newErrors.nickname = 'Nickname must be 15 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({ name: '', dormRoom: '', nickname: '' });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-4" id="register">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 bg-[#39FF14]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#39FF14]" />
            </div>
            <h3 className="text-2xl font-bold text-[#39FF14] mb-2">You're In! 🎉</h3>
            <p className="text-gray-400 mb-6">
              Welcome to DORM WARS, <span className="text-white font-semibold">{formData.nickname}</span>!
              <br />Get ready to smash your way to victory.
            </p>
            <button
              onClick={resetForm}
              className="electric-button text-sm"
            >
              Register Another Player
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4" id="register">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UserPlus className="w-8 h-8 text-[#39FF14]" />
            <h2 className="text-3xl md:text-4xl font-black gradient-text">JOIN THE BATTLE</h2>
          </div>
          <p className="text-gray-400">Register now and claim your spot in the tournament</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`cyber-input ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Dorm Room Field */}
          <div className="mb-6">
            <label htmlFor="dormRoom" className="block text-sm font-semibold text-gray-300 mb-2">
              <Home className="w-4 h-4 inline mr-1" />
              Dorm Room Number
            </label>
            <input
              type="text"
              id="dormRoom"
              name="dormRoom"
              value={formData.dormRoom}
              onChange={handleChange}
              placeholder="e.g., A-204"
              className={`cyber-input ${errors.dormRoom ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.dormRoom && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.dormRoom}</span>
              </div>
            )}
          </div>

          {/* Nickname Field */}
          <div className="mb-8">
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-300 mb-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Battle Nickname
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="e.g., ThunderSmash"
              className={`cyber-input ${errors.nickname ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.nickname && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.nickname}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">This is how you'll appear on the leaderboard!</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`neon-button w-full text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              '🏓 Register Now'
            )}
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By registering, you agree to show up and play fair. No rage quitting! 😤
          </p>
        </form>
      </div>
    </section>
  );
};

export default PlayerRegistration;
