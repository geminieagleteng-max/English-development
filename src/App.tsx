import { useState, useEffect } from 'react';
import type { Pet, UserStats } from './types';
import { PetRoom } from './components/PetRoom';
import { Adventure } from './components/Adventure';
import { MistakeBook } from './components/MistakeBook';
import { Analytics } from './components/Analytics';
import { playSfx } from './audioHelper';
import { GraduationCap, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import './App.css';

const DEFAULT_STATS: UserStats = {
  coins: 80, // Starting coins
  streak: 1,
  lastActiveDate: new Date().toDateString(),
  totalAnswered: 0,
  correctAnswers: 0,
  masteredWords: [],
  wrongAttempts: {},
  dailyCheckInDate: '',
  consecutiveCheckIns: 0,
  accessoriesOwned: [],
  equippedAccessories: [],
  furnitureOwned: [],
  equippedFurniture: [],
  achievements: [],
  petDiary: ['寵物培育日記正式開啟！'],
  homeLevel: 1
};

function App() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [currentView, setCurrentView] = useState<'lobby' | 'adventure' | 'mistakes' | 'analytics'>('lobby');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPet = localStorage.getItem('vocabpet_pet_state');
    const savedStats = localStorage.getItem('vocabpet_stats_state');
    const savedSound = localStorage.getItem('vocabpet_sound_enabled');

    let loadedPet: Pet | null = null;
    if (savedPet) {
      try {
        loadedPet = JSON.parse(savedPet);
        setPet(loadedPet);
      } catch (e) {
        console.error('Error loading pet data:', e);
      }
    }

    if (savedStats) {
      try {
        const parsedStats: UserStats = JSON.parse(savedStats);
        
        // Fill default gamification fields if missing (for compatibility)
        const filledStats: UserStats = {
          ...DEFAULT_STATS,
          ...parsedStats,
          accessoriesOwned: parsedStats.accessoriesOwned || [],
          equippedAccessories: parsedStats.equippedAccessories || [],
          furnitureOwned: parsedStats.furnitureOwned || [],
          equippedFurniture: parsedStats.equippedFurniture || [],
          achievements: parsedStats.achievements || [],
          petDiary: parsedStats.petDiary || ['寵物培育日記正式開啟！'],
          homeLevel: parsedStats.homeLevel || 1
        };

        // Calculate daily login streak & satiety decay
        const today = new Date().toDateString();
        const lastActive = filledStats.lastActiveDate;

        if (lastActive !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          let newStreak = filledStats.streak;
          if (lastActive === yesterdayStr) {
            newStreak += 1;
          } else {
            // Streak broken
            newStreak = 1;
          }

          // Pet satiety decay calculation
          if (loadedPet) {
            const lastActiveDateObj = new Date(lastActive);
            const todayDateObj = new Date(today);
            const diffTime = Math.abs(todayDateObj.getTime() - lastActiveDateObj.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
              const decayAmount = diffDays * 20;
              const newSatiety = Math.max(0, loadedPet.satiety - decayAmount);
              const isNowSick = newSatiety === 0;

              const updatedPet: Pet = {
                ...loadedPet,
                satiety: newSatiety,
                isSick: loadedPet.isSick || isNowSick
              };

              if (isNowSick && !loadedPet.isSick) {
                filledStats.petDiary?.unshift(
                  `${today}: ${loadedPet.name} 因為太久沒吃飽生病了😭，需要購買魔法藥水治療！`
                );
              }

              setPet(updatedPet);
              localStorage.setItem('vocabpet_pet_state', JSON.stringify(updatedPet));
            }
          }

          const updatedStats = {
            ...filledStats,
            streak: newStreak,
            lastActiveDate: today
          };
          setStats(updatedStats);
          localStorage.setItem('vocabpet_stats_state', JSON.stringify(updatedStats));
        } else {
          setStats(filledStats);
        }
      } catch (e) {
        console.error('Error loading stats data:', e);
      }
    } else {
      // Initialize stats active date
      setStats({
        ...DEFAULT_STATS,
        lastActiveDate: new Date().toDateString()
      });
    }

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  // Save pet to localStorage when modified
  const updatePet = (updater: (prev: Pet | null) => Pet | null) => {
    setPet((prev) => {
      const next = updater(prev);
      if (next) {
        localStorage.setItem('vocabpet_pet_state', JSON.stringify(next));
      } else {
        localStorage.removeItem('vocabpet_pet_state');
      }
      return next;
    });
  };

  const updatePetNonNullable = (updater: (prev: Pet) => Pet) => {
    setPet((prev) => {
      if (!prev) return null;
      const next = updater(prev);
      localStorage.setItem('vocabpet_pet_state', JSON.stringify(next));
      return next;
    });
  };

  // Save stats to localStorage when modified
  const updateStats = (updater: (prev: UserStats) => UserStats) => {
    setStats((prev) => {
      const next = updater(prev);
      localStorage.setItem('vocabpet_stats_state', JSON.stringify(next));
      return next;
    });
  };

  // Achievement unlock system
  useEffect(() => {
    if (!pet) return;

    const existingAchievements = stats.achievements || [];
    const newlyUnlocked: string[] = [];

    const addAchievement = (id: string, name: string) => {
      if (!existingAchievements.includes(id)) {
        newlyUnlocked.push(id);
        alert(`🎉 恭喜解鎖成就：【${name}】！獲得 100 金幣 🪙！`);
      }
    };

    // Achievements Conditions
    addAchievement('hatch', '領養新手：孵化第一隻萌寵');
    
    if (pet.level >= 5) {
      addAchievement('evolve_teen', '初露鋒芒：萌寵進化至青年體');
    }
    if (pet.level >= 10) {
      addAchievement('evolve_adult', '獨當一面：萌寵進化至終極體');
    }

    if (stats.masteredWords.length >= 1) {
      addAchievement('first_word', '踏出第一步：掌握第一個單字');
    }
    if (stats.masteredWords.length >= 15) {
      addAchievement('vocab_master_15', '博聞強記：累計掌握 15 個單字');
    }
    if (stats.masteredWords.length >= 35) {
      addAchievement('vocab_master_35', '學貫中西：累計掌握 35 個單字');
    }

    const totalAccessories = (stats.accessoriesOwned?.length || 0) + (stats.equippedAccessories?.length || 0);
    if (totalAccessories >= 3) {
      addAchievement('fashion_pet', '潮流達人：收集 3 件萌寵裝扮');
    }

    if (stats.coins >= 500) {
      addAchievement('coin_collector', '金幣大亨：累積擁有 500 金幣');
    }

    if (stats.streak >= 7) {
      addAchievement('streak_hero', '持之以恆：連續學習達 7 天');
    }

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...existingAchievements, ...newlyUnlocked];
      const updatedDiary = [...(stats.petDiary || [])];
      newlyUnlocked.forEach((id) => {
        const titleMap: Record<string, string> = {
          hatch: '領養了第一隻可愛萌寵！',
          evolve_teen: '萌寵順利進化到了青年體！',
          evolve_adult: '萌寵達成了終極體進化！',
          first_word: '掌握了第一個英文單字！',
          vocab_master_15: '已累計掌握了 15 個高中單字！',
          vocab_master_35: '已累計掌握了 35 個高中單字！',
          fashion_pet: '為萌寵集齊了 3 件時尚配飾！',
          coin_collector: '累積金幣首次突破 500 枚！',
          streak_hero: '堅持每日學習，達成了 7 天連續登入！'
        };
        updatedDiary.unshift(`${new Date().toLocaleDateString()}: 解鎖成就「${titleMap[id] || id}」⭐`);
      });

      const updatedStats = {
        ...stats,
        coins: stats.coins + newlyUnlocked.length * 100,
        achievements: updatedAchievements,
        petDiary: updatedDiary
      };

      setStats(updatedStats);
      localStorage.setItem('vocabpet_stats_state', JSON.stringify(updatedStats));
    }
  }, [pet?.level, stats.masteredWords.length, stats.coins, stats.streak, stats.accessoriesOwned?.length]);

  // Toggle Sound sfx
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem('vocabpet_sound_enabled', String(nextState));
    // Hack: if disabled, playSfx does nothing or audioContext is muted
    // We can check soundEnabled inside playSfx, but since we are import/calling playSfx,
    // let's store sound toggle in global window for audioHelper to read! This is very simple and robust.
    (window as any).soundEnabled = nextState;
    playSfx('click');
  };

  // Bind sound status to window on load
  useEffect(() => {
    (window as any).soundEnabled = soundEnabled;
  }, [soundEnabled]);

  // Reset Game Data
  const handleResetGame = () => {
    if (window.confirm('您確定要重置所有遊戲進度、金幣及寵物資料嗎？此動作無法復原喔！')) {
      playSfx('wrong');
      localStorage.removeItem('vocabpet_pet_state');
      localStorage.removeItem('vocabpet_stats_state');
      setPet(null);
      setStats({
        ...DEFAULT_STATS,
        lastActiveDate: new Date().toDateString()
      });
      setCurrentView('lobby');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      {/* Top Header Navigation */}
      <header className="bg-white border-b-4 border-[#e9eff5] py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => { playSfx('click'); setCurrentView('lobby'); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-pink-100 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-700 tracking-wider flex items-center gap-1">
                VocabPet <span className="text-xs font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">單字萌寵</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold">高中英文單字養成學習網頁遊戲</p>
            </div>
          </div>

          {/* Quick Header status & controls */}
          <div className="flex items-center gap-4">
            {stats.streak > 1 && (
              <span className="hidden sm:flex items-center gap-1 text-sm bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full font-bold">
                🔥 連續 {stats.streak} 天
              </span>
            )}
            
            {/* Sound Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
              title={soundEnabled ? '關閉音效' : '開啟音效'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Reset Game button */}
            <button
              onClick={handleResetGame}
              className="p-2.5 bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-pink-500 rounded-xl transition-colors"
              title="重置遊戲數據"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto py-8 px-4">
        {currentView === 'lobby' && (
          <PetRoom
            pet={pet}
            stats={stats}
            onUpdatePet={updatePet}
            onUpdateStats={updateStats}
            onNavigate={(view) => {
              playSfx('click');
              setCurrentView(view);
            }}
          />
        )}

        {currentView === 'adventure' && pet && (
          <Adventure
            pet={pet}
            stats={stats}
            onBack={() => setCurrentView('lobby')}
            onUpdateStats={updateStats}
            onUpdatePet={updatePetNonNullable}
          />
        )}

        {currentView === 'mistakes' && (
          <MistakeBook
            stats={stats}
            onBack={() => setCurrentView('lobby')}
            onUpdateStats={updateStats}
          />
        )}

        {currentView === 'analytics' && (
          <Analytics
            stats={stats}
            onBack={() => setCurrentView('lobby')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white mt-12">
        <p className="font-bold flex items-center justify-center gap-1 mb-1">
          VocabPet © 2026. Made for High School English Vocabulary Learning.
        </p>
        <p>配合教育部高中 7000 單字主題式精選，結合萌寵養成伴你前行 💖</p>
      </footer>
    </div>
  );
}

export default App;
