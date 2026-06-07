import React, { useState, useEffect } from 'react';
import type { Pet, UserStats, ShopItem, PetType } from '../types';
import { playSfx } from '../audioHelper';
import { Heart, Star, Coins, Sparkles, User, MessageSquare, Check } from 'lucide-react';

// Image assets imports
import eggImg from '../assets/egg.png';
import slimeBabyImg from '../assets/slime_baby.png';
import slimeAdultImg from '../assets/slime_adult.png';
import catBabyImg from '../assets/cat_baby.png';
import catAdultImg from '../assets/cat_adult.png';
import dogBabyImg from '../assets/dog_baby.png';
import dogAdultImg from '../assets/dog_adult.png';

interface PetRoomProps {
  pet: Pet | null;
  stats: UserStats;
  onUpdatePet: (updater: (prev: Pet | null) => Pet | null) => void;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onNavigate: (view: 'adventure' | 'mistakes' | 'analytics') => void;
}

// Simulated chats database
const SIMULATED_CHATS = [
  { sender: '阿杰', msg: '我的狗狗今天升到 Lv.8 了！學士帽超好看的 🎓' },
  { sender: '小晴', msg: '剛剛在扭蛋機一抽就中【冒險皇冠 👑】！人品爆發！' },
  { sender: '曉東', msg: '科技單字真的有難度，DDA 自動升級難度害我拼錯一次 😂' },
  { sender: '麗麗', msg: '大家今天簽到了嗎？連續第 5 天有送魔法星星糖喔 🍬' },
  { sender: '心怡', msg: '我的貓咪生病了😭 忘了登入餵牠，還好買了藥水治好了。' },
  { sender: '阿華', msg: '商務單字真的超有用，在學測歷屆試題常看到！' },
  { sender: '琪琪', msg: '有人抽到【溫馨寵物床 🛏️】嗎？好想布置牠的房間喔～' }
];

// Simulated neighbors list
const SIMULATED_NEIGHBORS = [
  { id: 'n1', name: '阿杰的柴犬房', type: 'dog', petName: '波比', level: 6, emoji: '🐶', acc: '🎓', furn: '📚 讀書小書桌' },
  { id: 'n2', name: '小晴的草莓貓房', type: 'cat', petName: '咪咪', level: 9, emoji: '🐱', acc: '👑', furn: '🛏️ 溫馨寵物床' },
  { id: 'n3', name: '曉東的史萊姆家', type: 'slime', petName: '小綠', level: 5, emoji: '🟢', acc: '👓', furn: '🪴 療癒植物' }
];

// Sign-in Calendar config
const SIGN_IN_REWARDS = [
  { day: 1, rewardText: '15 金幣', icon: '🪙', type: 'coins', value: 15 },
  { day: 2, rewardText: '25 金幣', icon: '🪙', type: 'coins', value: 25 },
  { day: 3, rewardText: '解毒藥水', icon: '🧪', type: 'item_potion', value: 1 },
  { day: 4, rewardText: '40 金幣', icon: '🪙', type: 'coins', value: 40 },
  { day: 5, rewardText: '星星糖', icon: '🍬', type: 'item_candy', value: 1 },
  { day: 6, rewardText: '60 金幣', icon: '🪙', type: 'coins', value: 60 },
  { day: 7, rewardText: '稀有飾品', icon: '👑', type: 'accessory', value: '👑' }
];

export const PetRoom: React.FC<PetRoomProps> = ({
  pet,
  stats,
  onUpdatePet,
  onUpdateStats,
  onNavigate
}) => {
  // Local state for UI
  const [pettingHearts, setPettingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activeTab, setActiveTab] = useState<'care' | 'shop' | 'gacha' | 'wardrobe' | 'diary'>('care');
  const [newPetName, setNewPetName] = useState<string>('');
  const [selectedPetType, setSelectedPetType] = useState<PetType>('slime');
  const [petActionState, setPetActionState] = useState<'idle' | 'jump' | 'sad' | 'evolve'>('idle');

  // Gacha states
  const [isGachaDrawing, setIsGachaDrawing] = useState<boolean>(false);
  const [gachaResult, setGachaResult] = useState<{ name: string; icon: string; type: string } | null>(null);

  // Sign-in states
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  // Neighbors states
  const [visitingNeighbor, setVisitingNeighbor] = useState<any | null>(null);
  const [likedNeighbors, setLikedNeighbors] = useState<string[]>([]);

  // Simulated Chat feed state
  const [chatFeed, setChatFeed] = useState<{ id: number; sender: string; msg: string }[]>([]);

  // Shop Items definition
  const shopItems: ShopItem[] = [
    {
      id: 'food_1',
      name: '小蘇打餅乾',
      price: 15,
      satietyRestore: 15,
      affectionIncrease: 5,
      description: '香脆可口的小點心，稍微墊墊肚子。',
      icon: '🍪',
      type: 'food'
    },
    {
      id: 'food_2',
      name: '草莓奶油蛋糕',
      price: 35,
      satietyRestore: 35,
      affectionIncrease: 15,
      description: '滿滿鮮奶油與草莓，吃了會非常高興！',
      icon: '🍰',
      type: 'food'
    },
    {
      id: 'food_3',
      name: '特製肉罐頭',
      price: 50,
      satietyRestore: 55,
      affectionIncrease: 20,
      description: '高營養價值的特製寵物罐頭，飽食度大增。',
      icon: '🥫',
      type: 'food'
    },
    {
      id: 'food_4',
      name: '魔法星星糖',
      price: 100,
      satietyRestore: 10,
      affectionIncrease: 45,
      description: '稀有星星糖，能提升 30 點經驗值與大量好感！',
      icon: '🍬',
      type: 'food'
    },
    {
      id: 'potion_1',
      name: '魔法解毒藥水',
      price: 60,
      satietyRestore: 30,
      affectionIncrease: 10,
      description: '治好萌寵生病狀態，恢復正常的學習經驗獲取！',
      icon: '🧪',
      type: 'potion'
    }
  ];

  // Auto trigger Sign-in modal on load if not checked in today
  useEffect(() => {
    if (pet) {
      const today = new Date().toDateString();
      if (stats.dailyCheckInDate !== today) {
        // Delay slightly for smooth pop-in
        const timer = setTimeout(() => setShowSignInModal(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [pet, stats.dailyCheckInDate]);

  // World chat simulated updates
  useEffect(() => {
    // Initial chats
    setChatFeed([
      { id: 1, sender: '小晴', msg: '剛領養了櫻花貓，超可愛的，叫粉粉 💖' },
      { id: 2, sender: '阿杰', msg: '連續第 3 天簽到，拿到了好多金幣，爽！' },
      { id: 3, sender: '曉東', msg: '科技單字真的有難度，DDA 自動升級難度害我拼錯一次 😂' }
    ]);

    const interval = setInterval(() => {
      const randomChat = SIMULATED_CHATS[Math.floor(Math.random() * SIMULATED_CHATS.length)];
      setChatFeed((prev) => {
        const next = [...prev, { id: Date.now(), sender: randomChat.sender, msg: randomChat.msg }];
        if (next.length > 5) next.shift(); // Keep last 5
        return next;
      });
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  // Get current pet image
  const getPetImage = () => {
    if (!pet) return eggImg;
    if (pet.appearance === 'egg') return eggImg;
    if (pet.type === 'slime') {
      return pet.level >= 5 ? slimeAdultImg : slimeBabyImg;
    } else if (pet.type === 'cat') {
      return pet.level >= 5 ? catAdultImg : catBabyImg;
    } else {
      return pet.level >= 5 ? dogAdultImg : dogBabyImg;
    }
  };

  // Hatching pet
  const handleHatchPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    playSfx('evolve');
    setPetActionState('evolve');

    setTimeout(() => {
      onUpdatePet(() => ({
        name: newPetName.trim(),
        type: selectedPetType,
        level: 1,
        exp: 0,
        maxExp: 100,
        satiety: 80,
        affection: 50,
        appearance: 'baby',
        isSick: false
      }));
      onUpdateStats((prev) => ({
        ...prev,
        petDiary: [`${new Date().toLocaleDateString()}: 孵化了可愛的萌寵 ${newPetName.trim()}！🐾`, ...(prev.petDiary || [])]
      }));
      setPetActionState('idle');
    }, 1200);
  };

  // Pet interaction (petting)
  const handlePetInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pet) return;
    if (pet.isSick) {
      playSfx('wrong');
      alert('萌寵現在生病不舒服，撫摸牠沒有反應...趕快去商店買魔法解毒藥水吧！');
      return;
    }

    playSfx('bubble');
    setPetActionState('jump');

    // Hearts animations
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const heartId = Date.now();

    setPettingHearts((prev) => [...prev, { id: heartId, x, y }]);
    setTimeout(() => {
      setPettingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1000);

    setTimeout(() => setPetActionState('idle'), 800);

    // Update pet values
    onUpdatePet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        affection: Math.min(100, prev.affection + 2)
      };
    });
  };

  // Regular Shop Buy and Feed
  const handleBuyAndFeed = (item: ShopItem) => {
    if (!pet) return;
    if (stats.coins < item.price) {
      playSfx('wrong');
      alert('金幣不足！快去關卡冒險回答單字賺取金幣吧！');
      return;
    }

    // Potion check
    if (item.type === 'potion') {
      if (!pet.isSick) {
        playSfx('wrong');
        alert('寵物目前很健康，不需要喝解毒藥水喔！');
        return;
      }
      playSfx('evolve');
      setPetActionState('evolve');
      setTimeout(() => setPetActionState('idle'), 1200);

      onUpdateStats((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
        petDiary: [`${new Date().toLocaleDateString()}: 餵食了解毒藥水，治好了 ${pet.name} 的感冒！🧪`, ...(prev.petDiary || [])]
      }));

      onUpdatePet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isSick: false,
          satiety: Math.min(100, prev.satiety + item.satietyRestore),
          affection: Math.min(100, prev.affection + item.affectionIncrease)
        };
      });
      return;
    }

    // Food check (if sick, cannot gain exp from candy)
    playSfx('feed');
    setPetActionState('jump');
    setTimeout(() => setPetActionState('idle'), 800);

    onUpdateStats((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      petDiary: [`${new Date().toLocaleDateString()}: 餵食了美味的 ${item.name}！${item.icon}`, ...(prev.petDiary || [])]
    }));

    onUpdatePet((prev) => {
      if (!prev) return null;
      
      let extraExp = item.id === 'food_4' && !prev.isSick ? 30 : 0;
      let newExp = prev.exp + extraExp;
      let newLevel = prev.level;
      let didLevelUp = false;

      while (newExp >= prev.maxExp) {
        newExp -= prev.maxExp;
        newLevel += 1;
        didLevelUp = true;
      }

      if (didLevelUp) {
        setTimeout(() => playSfx('levelup'), 600);
      }

      const newStage = newLevel >= 10 ? 'adult' : newLevel >= 5 ? 'teen' : 'baby';

      return {
        ...prev,
        satiety: Math.min(100, prev.satiety + item.satietyRestore),
        affection: Math.min(100, prev.affection + item.affectionIncrease),
        level: newLevel,
        exp: newExp,
        maxExp: newLevel * 80 + 100,
        appearance: prev.appearance === 'egg' ? 'baby' : (newStage as any)
      };
    });
  };

  // Draw Gacha (30 coins)
  const drawGacha = () => {
    if (!pet) return;
    if (stats.coins < 30) {
      playSfx('wrong');
      alert('金幣不足以啟動扭蛋機！需要 30 金幣。');
      return;
    }

    playSfx('evolve');
    setIsGachaDrawing(true);
    setGachaResult(null);

    // Deduct coins first
    onUpdateStats((prev) => ({
      ...prev,
      coins: prev.coins - 30
    }));

    setTimeout(() => {
      // Resolve reward
      const rand = Math.random();
      let name = '';
      let icon = '';
      let type = '';

      if (rand < 0.45) {
        // Common Food
        const foods = [
          { name: '特製肉罐頭', icon: '🥫' },
          { name: '草莓奶油蛋糕', icon: '🍰' },
          { name: '小蘇打餅乾', icon: '🍪' }
        ];
        const chosen = foods[Math.floor(Math.random() * foods.length)];
        name = chosen.name;
        icon = chosen.icon;
        type = 'food';

        // Add food effect directly as satiety restore / affection (instant feed reward!)
        onUpdatePet((prevPet) => {
          if (!prevPet) return null;
          return {
            ...prevPet,
            satiety: Math.min(100, prevPet.satiety + 25),
            affection: Math.min(100, prevPet.affection + 10)
          };
        });

      } else if (rand < 0.65) {
        // Stars Candy
        name = '魔法星星糖';
        icon = '🍬';
        type = 'food';

        onUpdatePet((prevPet) => {
          if (!prevPet) return null;
          return {
            ...prevPet,
            satiety: Math.min(100, prevPet.satiety + 10),
            affection: Math.min(100, prevPet.affection + 30),
            exp: prevPet.exp + 20
          };
        });

      } else if (rand < 0.85) {
        // Accessories
        const accs = [
          { name: '俏皮粉蝴蝶結', icon: '🎀' },
          { name: '學士博士帽', icon: '🎓' },
          { name: '知性黑框眼鏡', icon: '👓' },
          { name: '黃金冒險皇冠', icon: '👑' }
        ];
        const chosen = accs[Math.floor(Math.random() * accs.length)];
        name = chosen.name;
        icon = chosen.icon;
        type = 'accessory';

        onUpdateStats((prev) => {
          const owned = prev.accessoriesOwned || [];
          if (!owned.includes(chosen.icon)) {
            return {
              ...prev,
              accessoriesOwned: [...owned, chosen.icon],
              petDiary: [`${new Date().toLocaleDateString()}: 扭蛋抽到了裝扮【${chosen.name} ${chosen.icon}】！👔`, ...(prev.petDiary || [])]
            };
          }
          return prev; // Duplicate does nothing, or gives refund 10 coins
        });

      } else {
        // Room Furniture
        const furns = [
          { name: '溫馨寵物床', icon: '🛏️' },
          { name: '讀書小書桌', icon: '📚' },
          { name: '療癒空氣植物', icon: '🪴' },
          { name: '趴趴泰迪熊', icon: '🧸' }
        ];
        const chosen = furns[Math.floor(Math.random() * furns.length)];
        name = chosen.name;
        icon = chosen.icon;
        type = 'furniture';

        onUpdateStats((prev) => {
          const owned = prev.furnitureOwned || [];
          if (!owned.includes(chosen.icon)) {
            return {
              ...prev,
              furnitureOwned: [...owned, chosen.icon],
              petDiary: [`${new Date().toLocaleDateString()}: 扭蛋抽到了家具【${chosen.name} ${chosen.icon}】！🖼️`, ...(prev.petDiary || [])]
            };
          }
          return prev;
        });
      }

      setGachaResult({ name, icon, type });
      setIsGachaDrawing(false);
      playSfx('levelup');
    }, 1200);
  };

  // Sign In reward claiming
  const claimSignIn = () => {
    const consecutive = (stats.consecutiveCheckIns || 0) % 7;
    const reward = SIGN_IN_REWARDS[consecutive];
    const today = new Date().toDateString();

    playSfx('levelup');

    onUpdateStats((prev) => {
      let coinsBonus = reward.type === 'coins' ? (reward.value as number) : 0;
      let ownedAcc = prev.accessoriesOwned || [];

      if (reward.type === 'accessory' && !ownedAcc.includes(reward.value as string)) {
        ownedAcc = [...ownedAcc, reward.value as string];
      }

      const updatedDiary = [
        `${new Date().toLocaleDateString()}: 完成每日簽到，領取了 ${reward.rewardText} ${reward.icon}！📅`,
        ...(prev.petDiary || [])
      ];

      return {
        ...prev,
        coins: prev.coins + coinsBonus,
        dailyCheckInDate: today,
        consecutiveCheckIns: (prev.consecutiveCheckIns || 0) + 1,
        accessoriesOwned: ownedAcc,
        petDiary: updatedDiary
      };
    });

    // Special items direct feed in check-in
    if (reward.type === 'item_candy') {
      onUpdatePet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          affection: Math.min(100, prev.affection + 35),
          satiety: Math.min(100, prev.satiety + 10)
        };
      });
    } else if (reward.type === 'item_potion') {
      onUpdatePet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isSick: false,
          satiety: Math.min(100, prev.satiety + 20)
        };
      });
    }

    setShowSignInModal(false);
    alert(`📅 簽到成功！您已獲得：${reward.rewardText} ${reward.icon}！`);
  };

  // Wear accessory toggle
  const toggleAccessory = (accIcon: string) => {
    playSfx('click');
    onUpdateStats((prev) => {
      const equipped = prev.equippedAccessories || [];
      const newEquipped = equipped.includes(accIcon)
        ? equipped.filter((a) => a !== accIcon)
        : [...equipped, accIcon];
      return {
        ...prev,
        equippedAccessories: newEquipped
      };
    });
  };

  // Toggle Furniture toggle
  const toggleFurniture = (furnIcon: string) => {
    playSfx('click');
    onUpdateStats((prev) => {
      const equipped = prev.equippedFurniture || [];
      const newEquipped = equipped.includes(furnIcon)
        ? equipped.filter((f) => f !== furnIcon)
        : [...equipped, furnIcon];
      return {
        ...prev,
        equippedFurniture: newEquipped
      };
    });
  };

  // Visit neighbor
  const visitNeighbor = (neighbor: any) => {
    playSfx('bubble');
    setVisitingNeighbor(neighbor);
  };

  // Give like to neighbor
  const likeNeighbor = (neighborId: string) => {
    if (likedNeighbors.includes(neighborId)) {
      playSfx('wrong');
      alert('今天已經幫這個鄰居點讚過囉！');
      return;
    }

    playSfx('correct');
    setLikedNeighbors((prev) => [...prev, neighborId]);

    // Reward player 5 coins
    onUpdateStats((prev) => ({
      ...prev,
      coins: prev.coins + 5,
      petDiary: [`${new Date().toLocaleDateString()}: 拜訪鄰居獲得了 5 枚金幣點讚禮 🪙`, ...(prev.petDiary || [])]
    }));

    alert('👍 點讚成功！獲得 5 金幣 🪙！');
  };

  // Hatching Selection View
  if (!pet) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 animate-pop-in">
        <div className="game-card border-pink-200 py-10 px-8 text-center">
          <div className="w-28 h-28 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-pink-100">
            <img src={eggImg} alt="Egg" className="w-20 h-20 object-contain animate-bounce" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-700 mb-2">領養你的第一隻萌寵</h2>
          <p className="text-slate-400 mb-8">答題獲取經驗讓牠成長進化，並照顧牠的日常生活！</p>

          <form onSubmit={handleHatchPet} className="flex flex-col gap-6 max-w-md mx-auto">
            {/* Pet Type Select */}
            <div>
              <span className="text-sm text-slate-400 font-bold block text-left mb-2">選擇萌寵類型：</span>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'slime', name: '史萊姆', emoji: '🟢', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
                  { id: 'cat', name: '櫻花貓', emoji: '🐱', color: 'border-pink-300 bg-pink-50 text-pink-800' },
                  { id: 'dog', name: '學士狗', emoji: '🐶', color: 'border-amber-300 bg-amber-50 text-amber-800' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => { playSfx('click'); setSelectedPetType(type.id as PetType); }}
                    className={`py-3 px-2 border-4 rounded-2xl font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedPetType === type.id
                        ? `${type.color} transform scale-[1.04] shadow-md`
                        : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <span className="text-sm">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Name input */}
            <div>
              <label htmlFor="petName" className="text-sm text-slate-400 font-bold block text-left mb-2">
                為你的萌寵取個名字：
              </label>
              <input
                id="petName"
                type="text"
                required
                maxLength={10}
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="例如：小綠、粉紅棉花、波比"
                className="w-full border-4 border-slate-200 focus:border-pink-300 outline-none rounded-2xl py-3 px-4 text-center font-bold text-lg text-slate-700 transition-colors"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!newPetName.trim()}
              className="btn-bubble btn-primary py-4 text-lg w-full mt-2"
            >
              <Sparkles className="w-5 h-5" /> 孵化寵物蛋！
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-pop-in relative">
      {/* Sickness Banner warning */}
      {pet.isSick && (
        <div className="bg-red-50 border-4 border-red-200 rounded-3xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left animate-shake">
          <div>
            <h4 className="font-extrabold text-red-700 text-lg">🤢 {pet.name} 生病了！</h4>
            <p className="text-sm text-red-500 font-medium">
              因為飽食度歸零，寵物現在肚子太餓而感冒了。在治好前牠將無法獲得學習經驗值！請至商店購買【魔法解毒藥水 🧪】治好牠！
            </p>
          </div>
          <button
            onClick={() => { playSfx('click'); setActiveTab('shop'); }}
            className="btn-bubble btn-accent py-2 px-6 text-sm"
          >
            前往商店
          </button>
        </div>
      )}

      {/* Main Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Pet Room & Custom wallpaper (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className="game-card border-pink-100 flex flex-col items-center justify-center py-12 relative overflow-hidden select-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,245,247,1) 0%, rgba(240,244,248,1) 100%)'
            }}
          >
            {/* Interactive petting hint */}
            <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 bg-white/80 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              點擊寵物可以觸摸互動！
            </div>

            {/* Render equipped furniture items row visually at the bottom */}
            <div className="absolute bottom-4 left-6 flex gap-3 text-4xl bg-white/40 px-4 py-2 rounded-2xl border border-white/60 pointer-events-none">
              <span className="text-xs font-bold text-slate-400 self-center mr-1">家具：</span>
              {(stats.equippedFurniture || []).length === 0 ? (
                <span className="text-xs text-slate-400 italic font-bold">空空如也 📦</span>
              ) : (
                stats.equippedFurniture?.map((furn) => (
                  <span key={furn} className="filter drop-shadow-sm animate-floating">{furn}</span>
                ))
              )}
            </div>

            {/* Pet Sprite Box */}
            <div
              onClick={handlePetInteraction}
              className="w-64 h-64 flex items-center justify-center mb-6 relative cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={getPetImage()}
                alt="Pet Sprite"
                className={`w-52 h-52 object-contain transition-all duration-100 ${
                  pet.isSick
                    ? 'animate-pet-sad filter saturate-50'
                    : petActionState === 'idle'
                    ? 'animate-pet-idle'
                    : petActionState === 'jump'
                    ? 'animate-pet-jump'
                    : petActionState === 'evolve'
                    ? 'animate-pet-evolve'
                    : 'animate-pet-sad'
                }`}
              />

              {/* Floating accessories */}
              <div className="absolute -top-4 right-6 text-4xl animate-floating flex gap-1 pointer-events-none">
                {stats.equippedAccessories?.map((acc) => (
                  <span key={acc} className="filter drop-shadow">{acc}</span>
                ))}
              </div>

              {/* Floating hearts petting */}
              {pettingHearts.map((heart) => (
                <div
                  key={heart.id}
                  className="absolute pointer-events-none text-2xl"
                  style={{
                    left: heart.x,
                    top: heart.y - 45,
                    animation: 'float-number-up 0.8s ease-out forwards'
                  }}
                >
                  💖
                </div>
              ))}
            </div>

            {/* Name & Title */}
            <h3 className="text-3xl font-extrabold text-slate-700 mb-1 flex items-center gap-2">
              {pet.name}
              {pet.isSick ? (
                <span className="text-xs font-bold bg-red-400 text-white px-2.5 py-0.5 rounded-full">
                  生病中
                </span>
              ) : pet.level >= 10 ? (
                <span className="text-xs font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" /> 終極體
                </span>
              ) : pet.level >= 5 ? (
                <span className="text-xs font-bold bg-purple-400 text-white px-2 py-0.5 rounded-full">
                  青年體
                </span>
              ) : (
                <span className="text-xs font-bold bg-blue-400 text-white px-2 py-0.5 rounded-full">
                  幼年體
                </span>
              )}
            </h3>

            {/* Level and Exp bar */}
            <div className="flex flex-col items-center w-full max-w-sm px-6 mb-6">
              <div className="flex justify-between w-full text-xs font-bold text-slate-500 mb-1">
                <span>Lv. {pet.level}</span>
                <span>EXP: {pet.exp} / {pet.maxExp}</span>
              </div>
              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="h-full bg-pink-400 rounded-full transition-all duration-300"
                  style={{ width: `${(pet.exp / pet.maxExp) * 100}%` }}
                />
              </div>
            </div>

            {/* Status Gauges */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-3 flex flex-col">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
                  🥐 飽食度
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-extrabold text-slate-600">{pet.satiety}%</span>
                  <span className="text-xs text-slate-400">
                    {pet.satiety < 30 ? '餓肚子啦😭' : '飽飽的🥰'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pet.satiety < 30 ? 'bg-pink-400 animate-pulse' : 'bg-secondary'
                    }`}
                    style={{ width: `${pet.satiety}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/80 border border-slate-100 rounded-2xl p-3 flex flex-col">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  好感度
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-extrabold text-slate-600">{pet.affection}%</span>
                  <span className="text-xs text-slate-400">
                    {pet.affection < 40 ? '冷淡中😥' : '親密💖'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full bg-pink-400 transition-all duration-300"
                    style={{ width: `${pet.affection}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* World Chat simulated Box & Visit friends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* World chat feed */}
            <div className="game-card border-blue-100 p-4 flex flex-col h-60">
              <h4 className="text-sm font-extrabold text-slate-500 mb-3 flex items-center gap-1.5">
                <MessageSquare className="text-blue-400 w-4 h-4" />
                世界廣播頻道 (模擬在線)
              </h4>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 text-xs">
                {chatFeed.map((chat) => (
                  <div key={chat.id} className="chat-message-item bg-blue-50/50 border border-blue-100/50 p-2 rounded-xl">
                    <span className="font-extrabold text-blue-600 mr-1.5">[{chat.sender}]</span>
                    <span className="text-slate-600 font-medium">{chat.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visit Friends list */}
            <div className="game-card border-emerald-100 p-4 flex flex-col h-60">
              <h4 className="text-sm font-extrabold text-slate-500 mb-3 flex items-center gap-1.5">
                <User className="text-emerald-400 w-4 h-4" />
                參觀鄰居房 (關係感互讚)
              </h4>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 text-xs">
                {SIMULATED_NEIGHBORS.map((neigh) => {
                  const hasLiked = likedNeighbors.includes(neigh.id);
                  return (
                    <div key={neigh.id} className="flex justify-between items-center bg-emerald-50/30 border border-emerald-100/40 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg bg-emerald-100 p-1 rounded-lg">{neigh.emoji}</span>
                        <div>
                          <p className="font-extrabold text-slate-600">{neigh.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">寵物：{neigh.petName} (Lv.{neigh.level})</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => visitNeighbor(neigh)}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold rounded-lg"
                        >
                          參觀
                        </button>
                        <button
                          disabled={hasLiked}
                          onClick={() => likeNeighbor(neigh.id)}
                          className={`px-2 py-1 font-bold rounded-lg flex items-center gap-0.5 ${
                            hasLiked 
                              ? 'bg-slate-100 text-slate-400 border border-slate-200'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          👍 {hasLiked ? '已讚' : '點讚'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Tab panels - Shop, Gacha, Wardrobe, Decor (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Gold coins wallet */}
          <div className="game-card border-amber-200 bg-amber-50/50 flex items-center justify-between p-4">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Coins className="text-amber-500 w-5 h-5" />
              目前擁有金幣
            </span>
            <span className="text-3xl font-extrabold text-amber-600">{stats.coins}</span>
          </div>

          {/* Menu / Nav Tabs */}
          <div className="game-card border-slate-200 p-4">
            {/* Grid Header tabs */}
            <div className="grid grid-cols-5 gap-1.5 border-b-2 border-slate-100 pb-3 mb-4 bg-slate-100/50 p-1 rounded-2xl">
              <button
                onClick={() => { playSfx('click'); setActiveTab('care'); }}
                className={`py-2 rounded-xl font-bold transition-all text-center text-xs ${
                  activeTab === 'care' ? 'bg-white text-pink-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="日常培育"
              >
                培育
              </button>
              <button
                onClick={() => { playSfx('click'); setActiveTab('shop'); }}
                className={`py-2 rounded-xl font-bold transition-all text-center text-xs ${
                  activeTab === 'shop' ? 'bg-white text-amber-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="點心商店"
              >
                商店
              </button>
              <button
                onClick={() => { playSfx('click'); setActiveTab('gacha'); }}
                className={`py-2 rounded-xl font-bold transition-all text-center text-xs ${
                  activeTab === 'gacha' ? 'bg-white text-purple-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="扭蛋抽獎"
              >
                扭蛋
              </button>
              <button
                onClick={() => { playSfx('click'); setActiveTab('wardrobe'); }}
                className={`py-2 rounded-xl font-bold transition-all text-center text-xs ${
                  activeTab === 'wardrobe' ? 'bg-white text-blue-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="裝扮配飾"
              >
                穿扮
              </button>
              <button
                onClick={() => { playSfx('click'); setActiveTab('diary'); }}
                className={`py-2 rounded-xl font-bold transition-all text-center text-xs ${
                  activeTab === 'diary' ? 'bg-white text-emerald-500 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="成長日記"
              >
                日記
              </button>
            </div>

            {/* Tab care: Routine care */}
            {activeTab === 'care' && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { playSfx('click'); onNavigate('adventure'); }}
                  className="w-full btn-bubble btn-secondary py-3 text-base"
                >
                  ⚔️ 前往單字關卡冒險
                </button>
                <button
                  onClick={() => { playSfx('click'); onNavigate('mistakes'); }}
                  className="w-full btn-bubble btn-gray py-2.5 text-sm"
                >
                  📖 前往錯題本溫習
                </button>
                <button
                  onClick={() => { playSfx('click'); onNavigate('analytics'); }}
                  className="w-full btn-bubble btn-blue py-2.5 text-sm"
                >
                  📊 查看學習統計圖表
                </button>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed font-semibold">
                  <p className="text-slate-500 font-bold mb-1">💡 學習成癮指南：</p>
                  <p>1. 每日登入可自動觸發簽到，簽到連續天數越高獎勵越豐厚！</p>
                  <p>2. 答題能賺取金幣，金幣可以用於在商店購買點心或抽扭蛋 🎰</p>
                  <p>3. 扭蛋機有隨機配飾 🎀 與家具 🛏️，可前往「穿扮」分頁進行搭配與布置！</p>
                </div>
              </div>
            )}

            {/* Tab shop: Food store */}
            {activeTab === 'shop' && (
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                {shopItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-slate-100 rounded-xl p-3 flex flex-col justify-between gap-2 bg-slate-50 hover:bg-slate-100/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl bg-white p-1 rounded-xl shadow-sm border border-slate-100">{item.icon}</span>
                        <div>
                          <p className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                            {item.name}
                            {item.type === 'potion' && (
                              <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">解毒</span>
                            )}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5 leading-snug">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-2 text-xs">
                      <div className="flex gap-2 text-slate-500 font-medium">
                        {item.satietyRestore > 0 && <span>飽食度 +{item.satietyRestore}</span>}
                        {item.affectionIncrease > 0 && <span>好感度 +{item.affectionIncrease}</span>}
                      </div>
                      <button
                        onClick={() => handleBuyAndFeed(item)}
                        className="btn-bubble btn-accent py-1.5 px-3 text-xs font-extrabold flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3" /> {item.price} 購買
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab gacha: Gacha Lucky Machine */}
            {activeTab === 'gacha' && (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div 
                  className={`w-32 h-32 bg-purple-50 rounded-full border-4 border-purple-200 flex items-center justify-center mb-4 text-6xl shadow-inner ${
                    isGachaDrawing ? 'animate-gacha-shake' : 'animate-floating'
                  }`}
                >
                  🎰
                </div>
                <h4 className="font-bold text-slate-700 mb-1">幸運萌寵扭蛋機</h4>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed font-semibold">
                  花費 30 金幣，隨機抽出一件限定寵物裝扮配飾、稀有家具或魔法食物！
                </p>

                <button
                  disabled={isGachaDrawing || stats.coins < 30}
                  onClick={drawGacha}
                  className="btn-bubble btn-accent w-full py-3"
                >
                  {isGachaDrawing ? '🎰 搖晃扭蛋中...' : '🪙 30 金幣啟動扭蛋'}
                </button>

                {/* Gacha result popup within tab */}
                {gachaResult && (
                  <div className="mt-4 p-3 bg-purple-50 border-2 border-purple-200 rounded-2xl w-full animate-pop-in">
                    <span className="text-xs font-bold text-purple-600 block mb-1">✨ 扭蛋獲得！ ✨</span>
                    <span className="text-3xl block mb-1">{gachaResult.icon}</span>
                    <span className="font-bold text-slate-700 text-sm block">{gachaResult.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {gachaResult.type === 'food' ? '已自動餵食並提升數值！' : '已加入到您的衣櫥中，快去穿扮吧！'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tab wardrobe: Customise accessories & furniture */}
            {activeTab === 'wardrobe' && (
              <div className="flex flex-col gap-4">
                {/* Accessories Wardrobe */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">穿戴飾品 (Accessories)</h4>
                  {(stats.accessoriesOwned || []).length === 0 ? (
                    <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-semibold">
                      您還沒有飾品喔，快去扭蛋吧！ 🎰
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {stats.accessoriesOwned?.map((acc) => {
                        const isEquipped = stats.equippedAccessories?.includes(acc);
                        return (
                          <button
                            key={acc}
                            onClick={() => toggleAccessory(acc)}
                            className={`p-3 border-4 rounded-xl text-2xl transition-all ${
                              isEquipped 
                                ? 'border-blue-400 bg-blue-50 scale-105' 
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white'
                            }`}
                            title={isEquipped ? '脫下' : '穿上'}
                          >
                            {acc}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Furniture decoration */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">擺設家具 (Furniture)</h4>
                  {(stats.furnitureOwned || []).length === 0 ? (
                    <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-semibold">
                      您還沒有擺設家具喔，快去扭蛋吧！ 🎰
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {stats.furnitureOwned?.map((furn) => {
                        const isEquipped = stats.equippedFurniture?.includes(furn);
                        return (
                          <button
                            key={furn}
                            onClick={() => toggleFurniture(furn)}
                            className={`p-3 border-4 rounded-xl text-2xl transition-all ${
                              isEquipped 
                                ? 'border-emerald-400 bg-emerald-50 scale-105' 
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 bg-white'
                            }`}
                            title={isEquipped ? '收回' : '擺設'}
                          >
                            {furn}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab diary: Growth diary & Achievements list */}
            {activeTab === 'diary' && (
              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
                {/* Achievements medals row */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">已解鎖成就 (Medals)</h4>
                  {(stats.achievements || []).length === 0 ? (
                    <span className="text-xs text-slate-400 font-semibold italic">尚未解鎖任何成就。加油！</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {stats.achievements?.map((achId) => {
                        const nameMap: Record<string, string> = {
                          hatch: '🐾 領養新手',
                          evolve_teen: '⭐ 初露鋒芒',
                          evolve_adult: '👑 獨當一面',
                          first_word: '📝 第一步',
                          vocab_master_15: '📚 博聞強記',
                          vocab_master_35: '🎓 學貫中西',
                          fashion_pet: '👔 潮流達人',
                          coin_collector: '🪙 金幣大亨',
                          streak_hero: '🔥 持之以恆'
                        };
                        return (
                          <span 
                            key={achId}
                            className="bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5"
                          >
                            {nameMap[achId] || achId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pet Diary list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">萌寵成長日誌 (Pet Diary)</h4>
                  <div className="flex flex-col gap-2 border-l-2 border-slate-100 pl-3 text-xs leading-relaxed">
                    {(stats.petDiary || []).map((log, idx) => (
                      <div key={idx} className="relative mb-1">
                        <div className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 bg-pink-400 rounded-full border-2 border-white shadow-sm" />
                        <p className="text-slate-500 font-medium">{log}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Daily Sign-In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-pop-in">
          <div className="game-card max-w-lg w-full border-pink-200 p-6 relative bg-white text-center">
            <h2 className="text-2xl font-extrabold text-slate-700 mb-1 flex items-center justify-center gap-2">
              📅 每日學習簽到
            </h2>
            <p className="text-xs text-slate-400 mb-6 font-semibold">養成每日複習單字好習慣，獲取豐富好禮！</p>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
              {SIGN_IN_REWARDS.map((reward, idx) => {
                const consecutive = (stats.consecutiveCheckIns || 0) % 7;
                const isClaimed = idx < consecutive;
                const isTodayActive = idx === consecutive;

                return (
                  <div 
                    key={reward.day}
                    className={`border-4 rounded-xl p-2 flex flex-col items-center justify-between text-center transition-all ${
                      isClaimed 
                        ? 'border-slate-200 bg-slate-100 text-slate-400' 
                        : isTodayActive 
                        ? 'border-pink-400 bg-pink-50 text-pink-700 scale-105 shadow-md' 
                        : 'border-slate-100 bg-white text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">D{reward.day}</span>
                    <span className="text-2xl my-1 block">{reward.icon}</span>
                    <span className="text-[9px] font-extrabold block leading-tight">{reward.rewardText}</span>
                    {isClaimed && (
                      <div className="mt-1 bg-slate-400 text-white p-0.5 rounded-full">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={claimSignIn}
              className="w-full btn-bubble btn-primary py-3.5 text-base"
            >
              簽到領取獎勵！
            </button>
          </div>
        </div>
      )}

      {/* Neighbor Visiting Modal */}
      {visitingNeighbor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-pop-in">
          <div className="game-card max-w-md w-full border-emerald-200 p-6 relative bg-white text-center">
            {/* Header */}
            <h3 className="text-xl font-extrabold text-slate-700 mb-1">
              🏡 正在參觀：{visitingNeighbor.name}
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">觀看鄰居的裝扮，並送花給予點讚回饋！</p>

            {/* Mock Room Container */}
            <div 
              className="border-4 border-slate-100 rounded-3xl p-8 mb-6 relative overflow-hidden flex flex-col items-center justify-center"
              style={{ background: 'radial-gradient(circle, rgba(235,255,247,1) 0%, rgba(240,244,248,1) 100%)' }}
            >
              <div className="absolute top-2 right-4 text-3xl animate-floating filter drop-shadow">
                {visitingNeighbor.acc}
              </div>
              <div className="text-6xl mb-4 animate-pet-idle">{visitingNeighbor.emoji}</div>
              <h4 className="font-extrabold text-slate-700 text-lg">{visitingNeighbor.petName}</h4>
              <p className="text-xs text-slate-400 font-bold mt-1">等級：Lv. {visitingNeighbor.level}</p>

              <div className="mt-6 text-xs bg-white/70 border border-slate-100 rounded-xl px-3 py-1.5 text-slate-500 font-medium">
                擺設家具：{visitingNeighbor.furn}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={likedNeighbors.includes(visitingNeighbor.id)}
                onClick={() => likeNeighbor(visitingNeighbor.id)}
                className={`flex-1 btn-bubble py-3 text-sm ${
                  likedNeighbors.includes(visitingNeighbor.id)
                    ? 'btn-gray'
                    : 'btn-secondary'
                }`}
              >
                👍 {likedNeighbors.includes(visitingNeighbor.id) ? '今天已讚過' : '送花點讚 (+5 🪙)'}
              </button>
              <button
                onClick={() => setVisitingNeighbor(null)}
                className="btn-bubble btn-gray py-3 text-sm"
              >
                關閉返回
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
