import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Award, 
  Sparkles, 
  ShoppingBag, 
  Gift, 
  Lock
} from 'lucide-react';

// Mock Rewards Catalog
const rewardsCatalog = [
  { id: 'rew-1', name: '10% Off Eco Store', cost: 80, icon: ShoppingBag, desc: 'Receive a discount code valid at any certified green grocer.' },
  { id: 'rew-2', name: 'Free Home Compost Kit', cost: 200, icon: Gift, desc: 'A premium wooden backyard composting starter package.' },
  { id: 'rew-3', name: 'Reusable Canvas Tote', cost: 50, icon: ShoppingBag, desc: 'UWMP branded organic canvas shopping bag.' },
  { id: 'rew-4', name: 'City Green Park Tree Donation', cost: 300, icon: Award, desc: 'Plant a native tree in your name in the Municipal Park.' }
];

// Badge Criteria
const badgeTiers = [
  { id: 'tier-1', name: 'Bronze Recycler', points: 100, color: '#D97706', desc: 'Active citizen helping report baseline incidents.' },
  { id: 'tier-2', name: 'Silver Collector', points: 250, color: '#94A3B8', desc: 'Frequent reporter cleaning up neighborhoods.' },
  { id: 'tier-3', name: 'Gold Champion', points: 500, color: '#F59E0B', desc: 'Highly dedicated waste clearance advocate.' },
  { id: 'tier-4', name: 'Eco Hero', points: 1000, color: '#10B981', desc: 'Supreme status held by top municipal environmentalists.' }
];

export default function Rewards() {
  const { user, token, updateUserLocal } = useAuth();
  const { showToast } = useToast();

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Confetti Animation trigger states
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeConfettiBadge, setActiveConfettiBadge] = useState('');

  // Fetch ranking list
  useEffect(() => {
    const fetchRanking = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          setLeaderboard(await response.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchRanking();
    }
  }, [token]);

  // Points calculation
  const points = user?.points || 0;
  
  // Find current tier & next tier
  const currentTierIndex = [...badgeTiers].reverse().findIndex(t => points >= t.points);
  const currentTier = currentTierIndex !== -1 ? badgeTiers[badgeTiers.length - 1 - currentTierIndex] : null;
  const nextTier = badgeTiers.find(t => points < t.points) || null;
  
  const progressToNext = nextTier 
    ? ((points - (currentTier?.points || 0)) / (nextTier.points - (currentTier?.points || 0))) * 100 
    : 100;

  // Redeem Reward action
  const handleRedeem = async (reward: any) => {
    if (points < reward.cost) {
      showToast('Insufficient recycle points.', 'error');
      return;
    }

    try {
      const remainingPoints = points - reward.cost;
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ points: remainingPoints })
      });

      if (response.ok) {
        showToast(`Redeemed ${reward.name}! Voucher sent to your email.`, 'success');
        updateUserLocal({ points: remainingPoints });
      } else {
        showToast('Error redeeming reward.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    }
  };

  // Click on unlocked badge for confetti pop
  const triggerConfetti = (badgeName: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      showToast('This badge is currently locked. Report more waste piles to unlock!', 'info');
      return;
    }
    setActiveConfettiBadge(badgeName);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-8 font-sans min-h-screen dark:bg-slate-950">
      
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Confetti particles */}
            {Array.from({ length: 30 }).map((_, i) => {
              const xStart = Math.random() * 100;
              const delay = Math.random() * 0.8;
              const rotate = Math.random() * 360;
              const size = Math.random() * 8 + 6;
              const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899'];
              const bg = colors[i % colors.length];

              return (
                <motion.div
                  key={i}
                  className="absolute rounded"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: bg,
                    left: `${xStart}%`,
                    top: '-10px',
                    transform: `rotate(${rotate}deg)`
                  }}
                  initial={{ top: '-10px', opacity: 1 }}
                  animate={{ 
                    top: '100vh', 
                    opacity: 0,
                    rotate: rotate + 360,
                    x: Math.random() * 100 - 50 
                  }}
                  transition={{ 
                    duration: 2.2, 
                    ease: 'easeOut',
                    delay 
                  }}
                />
              );
            })}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white font-extrabold text-sm px-6 py-3.5 rounded-3xl shadow-premium pointer-events-auto text-center flex flex-col items-center gap-1.5 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span>Unlocking {activeConfettiBadge}!</span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Rewards overview and progression banner */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 rounded-3xl shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-primary bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full uppercase tracking-wider">Rewards Ledger</span>
            <h2 className="text-2xl font-extrabold text-neutral-dark dark:text-white font-heading mt-2">Recycle Rewards Center</h2>
            <p className="text-xs text-neutral-muted dark:text-gray-400 mt-1">Divert waste, accumulate recycle points, and claim exclusive vouchers.</p>
          </div>

          <div className="bg-neutral-bg dark:bg-slate-800 p-4 rounded-2xl border dark:border-gray-700 text-center flex items-center space-x-3.5">
            <Award className="w-8 h-8 text-primary" />
            <div className="text-left">
              <span className="text-[9px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-wide">TOTAL REWARD BALANCE</span>
              <h3 className="text-xl font-extrabold text-neutral-dark dark:text-white mt-0.5">{points} Points</h3>
            </div>
          </div>
        </div>

        {/* Progress Bar to next tier */}
        {nextTier && (
          <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-gray-800">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-neutral-dark dark:text-white">Tier Rank: {currentTier?.name || 'Inception Recycler'}</span>
              <span className="text-neutral-muted dark:text-gray-400">Next Badge: {nextTier.name} ({nextTier.points - points} pts remaining)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent-lime"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Badge Tiers Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Unresolved Achievement Badges</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {badgeTiers.map((tier) => {
              const isUnlocked = points >= tier.points;
              
              return (
                <div 
                  key={tier.id}
                  onClick={() => triggerConfetti(tier.name, isUnlocked)}
                  className={`p-5 bg-white dark:bg-slate-900 border dark:border-gray-800 rounded-3xl shadow-soft flex items-center space-x-4 transition-all duration-300 cursor-pointer select-none ${
                    isUnlocked 
                      ? 'border-emerald-200 dark:border-emerald-800/40 hover:-translate-y-0.5 hover:shadow-premium ring-2 ring-emerald-500/5' 
                      : 'opacity-65'
                  }`}
                >
                  {/* Badge Icon circle */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden border"
                    style={{ 
                      borderColor: isUnlocked ? tier.color : '#E5E7EB',
                      backgroundColor: isUnlocked ? `${tier.color}15` : '#F3F4F6'
                    }}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-gray-150/40 dark:bg-black/30 flex items-center justify-center z-10">
                        <Lock className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                    )}
                    <Award className="w-7 h-7" style={{ color: isUnlocked ? tier.color : '#9CA3AF' }} />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-dark dark:text-white">{tier.name}</h4>
                    <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-0.5 leading-normal">{tier.desc}</p>
                    <span className="text-[9px] font-bold text-primary dark:text-emerald-500 mt-1 block">Threshold: {tier.points} Points</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redeemable Rewards list */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">Redeem Recycle Voucher Catalog</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rewardsCatalog.map((reward) => {
                const IconComponent = reward.icon;
                const canAfford = points >= reward.cost;

                return (
                  <div 
                    key={reward.id}
                    className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 rounded-3xl shadow-soft flex flex-col justify-between space-y-4"
                  >
                    <div className="flex space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-neutral-dark dark:text-white">{reward.name}</h4>
                        <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-1 leading-normal">{reward.desc}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-800">
                      <span className="text-[10px] font-black text-primary dark:text-emerald-500">{reward.cost} Points</span>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                          canAfford
                            ? 'bg-primary hover:bg-primary-light text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Redeem Voucher
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leaderboard panel */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-soft space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-dark dark:text-white font-heading uppercase tracking-wider">City Contributor Leaderboard</h3>
              <p className="text-[10px] text-neutral-muted dark:text-gray-400 mt-1">Real-time standings of top cleaning advocates.</p>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {leaderboard.map((item, idx) => {
                  const isCurrentUser = item._id === user?._id;
                  const rank = idx + 1;

                  return (
                    <div 
                      key={item._id}
                      className={`p-3.5 rounded-2xl border flex justify-between items-center transition-all ${
                        isCurrentUser 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/10' 
                          : 'border-gray-50 dark:border-gray-800 bg-gray-50/20 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                          rank === 1 ? 'bg-yellow-400 text-neutral-dark' :
                          rank === 2 ? 'bg-slate-300 text-neutral-dark' :
                          rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {rank}
                        </span>
                        
                        <div className="w-7 h-7 rounded-full overflow-hidden border bg-neutral-bg flex-shrink-0">
                          <img src={item.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>

                        <span className={`text-xs font-bold truncate max-w-[110px] ${isCurrentUser ? 'text-primary dark:text-emerald-500 font-extrabold' : 'text-neutral-dark dark:text-white'}`}>
                          {item.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-black text-neutral-dark dark:text-white">{item.points} pts</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-50 dark:border-gray-800 text-center">
            <span className="text-[9px] font-bold text-neutral-muted dark:text-gray-400 uppercase tracking-widest">HELP CLEAN YOUR LOCALITY TO ADVANCE STANDINGS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
