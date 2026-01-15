import { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, Flame, Laugh, Skull, Zap } from 'lucide-react';

const TrashTalk = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'ThunderSmash',
      message: "ApexAttack, you're going DOWN in the finals! 🏓💀",
      time: '5 mins ago',
      reactions: { fire: 12, laugh: 5, skull: 3 }
    },
    {
      id: 2,
      user: 'ApexAttack',
      message: "Big words from someone who barely beat VortexViper 😏 See you on the table!",
      time: '3 mins ago',
      reactions: { fire: 8, laugh: 15, skull: 2 }
    },
    {
      id: 3,
      user: 'ShadowServe',
      message: "Both of you watch out... there's a new champion rising 👑",
      time: '2 mins ago',
      reactions: { fire: 20, laugh: 3, skull: 0 }
    },
    {
      id: 4,
      user: 'NeonNinja',
      message: "This tournament is INSANE! Best dorm event ever! 🎉",
      time: '1 min ago',
      reactions: { fire: 25, laugh: 8, skull: 0 }
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: 'Anonymous',
      message: newComment,
      time: 'Just now',
      reactions: { fire: 0, laugh: 0, skull: 0 }
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleReaction = (commentId, reactionType) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          reactions: {
            ...comment.reactions,
            [reactionType]: comment.reactions[reactionType] + 1
          }
        };
      }
      return comment;
    }));
  };

  const ReactionButton = ({ icon: Icon, count, type, commentId, color }) => (
    <button
      onClick={() => handleReaction(commentId, type)}
      className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors ${color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold">{count}</span>
    </button>
  );

  return (
    <section className="py-16 px-4" id="trashtalk">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-[#39FF14]" />
            <h2 className="text-3xl md:text-4xl font-black gradient-text">TRASH TALK ZONE</h2>
          </div>
          <p className="text-gray-400">Drop your hottest takes and hype up the competition 🔥</p>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-card p-4">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
                    <span className="text-black font-bold text-sm">{comment.user[0]}</span>
                  </div>
                  <span className="font-bold text-[#39FF14]">{comment.user}</span>
                </div>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>

              {/* Comment Body */}
              <p className="text-white mb-3 pl-10">{comment.message}</p>

              {/* Reactions */}
              <div className="flex items-center gap-2 pl-10">
                <ReactionButton
                  icon={Flame}
                  count={comment.reactions.fire}
                  type="fire"
                  commentId={comment.id}
                  color="text-orange-400"
                />
                <ReactionButton
                  icon={Laugh}
                  count={comment.reactions.laugh}
                  type="laugh"
                  commentId={comment.id}
                  color="text-yellow-400"
                />
                <ReactionButton
                  icon={Skull}
                  count={comment.reactions.skull}
                  type="skull"
                  commentId={comment.id}
                  color="text-gray-400"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Drop your trash talk here... 🎤"
              className="cyber-input flex-1"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`p-3 rounded-xl transition-all ${
                newComment.trim()
                  ? 'bg-[#39FF14] text-black hover:shadow-lg hover:shadow-[#39FF14]/30'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 pl-13">
            Keep it fun, keep it friendly! 🏓 {200 - newComment.length} characters left
          </p>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-600 mt-4">
          ⚠️ This is a placeholder. Comments are not saved between sessions.
        </p>
      </div>
    </section>
  );
};

export default TrashTalk;
