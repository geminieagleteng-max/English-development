import React, { useState } from 'react';
import type { Word, UserStats, Pet } from '../types';
import { wordDatabase } from '../wordData';
import { playSfx, speakWord } from '../audioHelper';
import { Sparkles, Trophy, Star, Volume2, Coins, ArrowRight, Check, Play } from 'lucide-react';

// Image assets imports
import eggImg from '../assets/egg.png';
import slimeBabyImg from '../assets/slime_baby.png';
import slimeAdultImg from '../assets/slime_adult.png';
import catBabyImg from '../assets/cat_baby.png';
import catAdultImg from '../assets/cat_adult.png';
import dogBabyImg from '../assets/dog_baby.png';
import dogAdultImg from '../assets/dog_adult.png';

const themeBossMap: Record<string, { name: string, maxHp: number, emoji: string }> = {
  '科技與資訊': { name: '科技鐵甲魔龍', maxHp: 500, emoji: '🤖🐉' },
  '醫療與健康': { name: '病毒變異幽靈', maxHp: 500, emoji: '🦠👻' },
  '商業與經濟': { name: '金融吞噬魔王', maxHp: 500, emoji: '🪙👿' },
  '日常生活與休閒': { name: '慵懶時間泥怪', maxHp: 500, emoji: '💤🛡️' },
  '學術與教育': { name: '考試重壓魔物', maxHp: 500, emoji: '📝👾' },
  '自然與環境': { name: '氣候崩塌巨獸', maxHp: 500, emoji: '🌋👹' },
  '餐飲與文化': { name: '美食暴食惡魔', maxHp: 500, emoji: '🍕☠️' }
};

interface AdventureProps {
  pet: Pet;
  stats: UserStats;
  onBack: () => void;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onUpdatePet: (updater: (prev: Pet) => Pet) => void;
}

export const Adventure: React.FC<AdventureProps> = ({
  pet,
  stats,
  onBack,
  onUpdateStats,
  onUpdatePet
}) => {
  // Game states
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [gameMode, setGameMode] = useState<'mc' | 'spelling' | 'mix'>('mix');
  
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'summary'>('lobby');
  const [questWords, setQuestWords] = useState<Word[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [spellingInput, setSpellingInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [petAnimation, setPetAnimation] = useState<'idle' | 'jump' | 'sad'>('idle');

  // Gamification states
  const [bossHp, setBossHp] = useState<number>(500);
  const [bossMaxHp, setBossMaxHp] = useState<number>(500);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [floatTexts, setFloatTexts] = useState<{ id: number; text: string; type: 'damage' | 'reward'; style: React.CSSProperties }[]>([]);

  // Stats earned this session
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [expEarned, setExpEarned] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // List unique themes
  const themes = Array.from(new Set(wordDatabase.map((w) => w.theme)));

  // Get current pet image
  const getPetImage = () => {
    if (pet.appearance === 'egg') return eggImg;
    if (pet.type === 'slime') {
      return pet.level >= 5 ? slimeAdultImg : slimeBabyImg;
    } else if (pet.type === 'cat') {
      return pet.level >= 5 ? catAdultImg : catBabyImg;
    } else {
      return pet.level >= 5 ? dogAdultImg : dogBabyImg;
    }
  };

  // Helper to count words mastered in a theme
  const getMasteredCount = (themeName: string) => {
    return wordDatabase.filter(
      (w) => w.theme === themeName && stats.masteredWords.includes(w.id)
    ).length;
  };

  const getThemeTotal = (themeName: string) => {
    return wordDatabase.filter((w) => w.theme === themeName).length;
  };

  // Set up the adventure words
  const startAdventure = () => {
    if (!selectedTheme) return;
    playSfx('bubble');

    const bossInfo = themeBossMap[selectedTheme] || { name: '未知魔王', maxHp: 500 };
    setBossHp(bossInfo.maxHp);
    setBossMaxHp(bossInfo.maxHp);
    setCorrectStreak(0);
    setFloatTexts([]);

    // Filter words by theme
    const themeWords = wordDatabase.filter((w) => w.theme === selectedTheme);
    // Shuffle and pick questionCount
    const selected = [...themeWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(questionCount, themeWords.length));

    setQuestWords(selected);
    setCurrentIdx(0);
    setCoinsEarned(0);
    setExpEarned(0);
    setCorrectCount(0);
    setGameState('playing');
    setIsAnswered(false);
    setSelectedOption(null);
    setSpellingInput('');
    setPetAnimation('idle');

    // Generate first question's options if needed
    prepareQuestion(selected[0]);
  };

  const triggerFloatText = (text: string, type: 'damage' | 'reward') => {
    const id = Date.now() + Math.random();
    // Random position offsets
    const leftOffset = type === 'damage' ? 40 + Math.random() * 20 : 15 + Math.random() * 20;
    const topOffset = type === 'damage' ? 20 + Math.random() * 20 : 30 + Math.random() * 20;

    const style: React.CSSProperties = {
      left: `${leftOffset}%`,
      top: `${topOffset}%`
    };

    setFloatTexts((prev) => [...prev, { id, text, type, style }]);
    setTimeout(() => {
      setFloatTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  };

  const prepareQuestion = (word: Word) => {
    const isMultipleChoice = gameMode === 'mc' || (gameMode === 'mix' && Math.random() > 0.5);
    
    if (isMultipleChoice) {
      // Pick 3 random wrong options
      const wrongPool = wordDatabase
        .filter((w) => w.id !== word.id)
        .map((w) => w.translation);
      const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random()).slice(0, 3);
      const combined = [word.translation, ...shuffledWrong];
      setOptions(combined.sort(() => 0.5 - Math.random()));
    } else {
      setOptions([]); // Indicates spelling mode
    }
  };

  const checkAnswer = (answer: string) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const currentWord = questWords[currentIdx];
    let isCorrect = false;

    if (options.length > 0) {
      // Multiple choice mode
      setSelectedOption(answer);
      isCorrect = answer === currentWord.translation;
    } else {
      // Spelling mode
      isCorrect = answer.trim().toLowerCase() === currentWord.word.trim().toLowerCase();
    }

    // Automatically speak the word
    speakWord(currentWord.word);

    if (isCorrect) {
      playSfx('correct');
      setPetAnimation('jump');
      setCorrectCount((c) => c + 1);
      setCorrectStreak((s) => s + 1);
      
      // Calculate session rewards with Home Level bonuses
      const sessionCoins = stats.homeLevel && stats.homeLevel >= 2 ? Math.round(10 * 1.1) : 10;
      const sessionExp = stats.homeLevel && stats.homeLevel >= 3 ? Math.round(15 * 1.15) : 15;
      
      setCoinsEarned((c) => c + sessionCoins);
      setExpEarned((e) => e + sessionExp);

      // Deal damage to Boss
      const damage = Math.ceil(bossMaxHp / questWords.length);
      setBossHp((prev) => Math.max(0, prev - damage));

      // Trigger floating damage on boss, and coins/exp on pet
      triggerFloatText(`-${damage} HP`, 'damage');
      triggerFloatText(`+${sessionCoins} 🪙`, 'reward');

      // Update global user statistics
      onUpdateStats((prev) => {
        // Increment correct count in stats. If it's already mastered or answered correct, we track mastery
        const isAlreadyMastered = prev.masteredWords.includes(currentWord.id);
        const newMastered = isAlreadyMastered 
          ? prev.masteredWords 
          : [...prev.masteredWords, currentWord.id];

        // Clean up wrongAttempts if they got it right
        const newAttempts = { ...prev.wrongAttempts };
        if (newAttempts[currentWord.id] > 0) {
          newAttempts[currentWord.id] = Math.max(0, newAttempts[currentWord.id] - 1);
          if (newAttempts[currentWord.id] === 0) {
            delete newAttempts[currentWord.id];
          }
        }

        return {
          ...prev,
          coins: prev.coins + sessionCoins,
          totalAnswered: prev.totalAnswered + 1,
          correctAnswers: prev.correctAnswers + 1,
          masteredWords: newMastered,
          wrongAttempts: newAttempts
        };
      });

      // Update pet exp
      onUpdatePet((prev) => {
        let newExp = prev.exp + sessionExp;
        let newLevel = prev.level;
        let didLevelUp = false;
        
        while (newExp >= prev.maxExp) {
          newExp -= prev.maxExp;
          newLevel += 1;
          didLevelUp = true;
        }

        if (didLevelUp) {
          setTimeout(() => {
            playSfx('levelup');
          }, 600);
        }

        const newStage = newLevel >= 10 ? 'adult' : newLevel >= 5 ? 'teen' : newLevel >= 1 ? 'baby' : 'egg';

        return {
          ...prev,
          level: newLevel,
          exp: newExp,
          maxExp: newLevel * 80 + 100,
          appearance: prev.appearance === 'egg' ? 'baby' : (newStage as any)
        };
      });

    } else {
      playSfx('wrong');
      setPetAnimation('sad');
      setCorrectStreak(0); // Reset streak

      // Boss counter attacks pet
      triggerFloatText(`被反擊! 飢餓度+5%`, 'reward'); // Show near pet
      triggerFloatText(`Boss Attack!`, 'damage'); // Show near boss

      // Reduce pet satiety due to stress/wrong answer
      onUpdatePet((prev) => ({
        ...prev,
        satiety: Math.max(0, prev.satiety - 5),
        affection: Math.max(0, prev.affection - 2)
      }));

      // Record wrong answer in user stats
      onUpdateStats((prev) => {
        const newAttempts = { ...prev.wrongAttempts };
        newAttempts[currentWord.id] = (newAttempts[currentWord.id] || 0) + 1;

        return {
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
          wrongAttempts: newAttempts
        };
      });
    }
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questWords.length) {
      setCurrentIdx(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      setSpellingInput('');
      setPetAnimation('idle');
      prepareQuestion(questWords[nextIdx]);
      playSfx('click');
    } else {
      // Completed quest!
      setGameState('summary');
      playSfx('levelup');
    }
  };

  if (gameState === 'playing') {
    const currentWord = questWords[currentIdx];
    const isMultipleChoice = options.length > 0;

    return (
      <div className="w-full max-w-4xl mx-auto p-4 animate-pop-in">
        {/* Progress Bar & Header */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center text-slate-500 font-bold">
            <span className="flex items-center gap-1">
              <Star className="text-amber-400 fill-amber-400 w-5 h-5" />
              關卡挑戰：{selectedTheme}
            </span>
            <span>{currentIdx + 1} / {questWords.length} 題</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50">
            <div
              className="h-full bg-gradient-to-r from-pink-300 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questWords.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Boss HP Bar Banner */}
        <div className="game-card border-red-100 bg-red-50/20 mb-6 p-4 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-visible">
          {/* Floating Damage/Reward numbers container */}
          {floatTexts.map((ft) => (
            <div
              key={ft.id}
              className={ft.type === 'damage' ? 'float-damage-text' : 'float-reward-text'}
              style={ft.style}
            >
              {ft.text}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <span className="text-3xl">{(themeBossMap[selectedTheme || ''] || { emoji: '👾' }).emoji}</span>
            <div className="text-left">
              <h4 className="font-extrabold text-slate-700 text-lg">
                {(themeBossMap[selectedTheme || ''] || { name: '關卡守護魔王' }).name}
              </h4>
              <p className="text-xs text-red-500 font-bold">主題守護者：答對英文單字即可發動攻擊！</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>HP: {bossHp} / {bossMaxHp}</span>
              <span>{Math.round((bossHp / bossMaxHp) * 100)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-300"
                style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left panel: Pet and session status */}
          <div className="game-card flex flex-col items-center justify-center border-pink-100 py-8 text-center relative overflow-hidden">
            {/* Session Rewards display */}
            <div className="absolute top-3 left-3 bg-amber-50 border border-amber-200 rounded-2xl px-2.5 py-1.5 flex flex-col items-center justify-center text-xs font-bold text-amber-700 shadow-sm">
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                +{coinsEarned}
              </div>
              {stats.homeLevel && stats.homeLevel >= 2 && (
                <span className="text-[8px] text-amber-500 font-extrabold -mt-0.5">Lv.{stats.homeLevel} 加成</span>
              )}
            </div>

            <div className="absolute top-3 right-3 bg-purple-50 border border-purple-200 rounded-2xl px-2.5 py-1.5 flex flex-col items-center justify-center text-xs font-bold text-purple-700 shadow-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                +{expEarned} EXP
              </div>
              {stats.homeLevel && stats.homeLevel >= 3 && (
                <span className="text-[8px] text-purple-500 font-extrabold -mt-0.5">Lv.{stats.homeLevel} 加成</span>
              )}
            </div>

            {/* Pet sprite */}
            <div className="w-44 h-44 flex items-center justify-center mb-6 relative">
              <img
                src={getPetImage()}
                alt="Pet"
                className={`w-40 h-40 object-contain transition-all duration-100 ${
                  petAnimation === 'idle'
                    ? 'animate-pet-idle'
                    : petAnimation === 'jump'
                    ? 'animate-pet-jump'
                    : 'animate-pet-sad'
                }`}
              />
              
              {/* Animation particles */}
              {isAnswered && petAnimation === 'jump' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl animate-bounce">💖✨🎉</span>
                </div>
              )}
              {isAnswered && petAnimation === 'sad' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl animate-bounce">😭💧</span>
                </div>
              )}
            </div>

            <h4 className="text-xl font-bold text-slate-600 mb-1">{pet.name}</h4>
            <span className="text-xs px-3 py-1 bg-pink-100 text-pink-600 rounded-full font-bold">
              Lv. {pet.level} (EXP: {pet.exp}/{pet.maxExp})
            </span>
          </div>

          {/* Right panel: Question Card */}
          <div className="game-card lg:col-span-2 border-emerald-100">
            {isMultipleChoice ? (
              /* Multiple Choice View */
              <div>
                <div className="text-center py-6 mb-6">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                    多選題選釋義
                  </span>
                  <h3 className="text-4xl font-extrabold text-slate-700 mt-3 tracking-wide select-all">
                    {currentWord.word}
                  </h3>
                  <p className="text-slate-400 mt-2">{currentWord.phonetic}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.map((opt) => {
                    const isCorrectOpt = opt === currentWord.translation;
                    const isSelectedOpt = opt === selectedOption;

                    let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-600';
                    if (isAnswered) {
                      if (isCorrectOpt) {
                        btnStyle = 'border-emerald-300 bg-emerald-50 text-emerald-700 font-bold';
                      } else if (isSelectedOpt) {
                        btnStyle = 'border-pink-300 bg-pink-50 text-pink-700 font-bold';
                      } else {
                        btnStyle = 'border-slate-100 opacity-60 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={isAnswered}
                        onClick={() => checkAnswer(opt)}
                        className={`border-4 p-4 rounded-2xl text-left transition-all ${btnStyle} flex justify-between items-center`}
                      >
                        <span className="font-semibold text-lg">{opt}</span>
                        {isAnswered && isCorrectOpt && <Check className="w-5 h-5 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Spelling Challenge View */
              <div>
                <div className="text-center py-4 mb-4">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
                    單字拼字挑戰
                  </span>
                  <h3 className="text-2xl font-bold text-slate-600 mt-3">
                    「 {currentWord.translation} 」
                  </h3>
                  <p className="text-slate-400 mt-1">{currentWord.phonetic}</p>
                  
                  {/* First letter helper hint */}
                  <div className="mt-3 text-sm text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                    {correctStreak >= 3 ? (
                      <span>提示：難度提升 (DDA 🔥)！共 <strong className="text-pink-500 text-base">{currentWord.word.length}</strong> 個字母（無首字母提示）。</span>
                    ) : correctStreak === 0 ? (
                      <span>提示：首二字母是 <strong className="text-blue-500 text-base">{currentWord.word.slice(0, 2)}</strong>，共 {currentWord.word.length} 個字母。</span>
                    ) : (
                      <span>提示：首字母是 <strong className="text-blue-500 text-base">{currentWord.word[0]}</strong>，共 {currentWord.word.length} 個字母。</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto mb-6">
                  <input
                    type="text"
                    disabled={isAnswered}
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && spellingInput.trim() && checkAnswer(spellingInput)}
                    placeholder="輸入英文單字..."
                    className="w-full text-center text-2xl font-bold border-4 border-slate-200 focus:border-blue-300 outline-none rounded-2xl py-3 px-4 text-slate-700 transition-colors uppercase"
                  />
                  {!isAnswered && (
                    <button
                      disabled={!spellingInput.trim()}
                      onClick={() => checkAnswer(spellingInput)}
                      className="w-full btn-bubble btn-secondary"
                    >
                      送出答案
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Answer Explanation Display */}
            {isAnswered && (
              <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mt-6 animate-pop-in">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xl flex items-center gap-2">
                      {currentWord.word}
                      <span className="text-xs font-normal text-slate-400">{currentWord.phonetic}</span>
                    </h4>
                    <p className="text-emerald-600 font-bold mt-0.5">{currentWord.translation}</p>
                  </div>
                  <button
                    onClick={() => speakWord(currentWord.word)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-3">
                  <p className="text-slate-600 italic font-medium">{currentWord.example}</p>
                  <p className="text-slate-400 text-sm mt-1">{currentWord.exampleTranslation}</p>
                </div>

                {/* Status indicator */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="btn-bubble btn-primary"
                  >
                    {currentIdx + 1 === questWords.length ? '結算結果' : '下一題'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const accuracy = Math.round((correctCount / questWords.length) * 100);

    return (
      <div className="w-full max-w-2xl mx-auto p-4 animate-pop-in">
        <div className="game-card text-center border-amber-200 py-10">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 relative border-4 border-amber-200">
            <Trophy className="w-12 h-12" />
            <div className="absolute -bottom-2 bg-amber-400 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              VICTORY!
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-700 mb-2">挑戰完成！</h2>
          <p className="text-slate-400 mb-6">您完成了【{selectedTheme}】主題的單字訓練！</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-slate-400 text-xs font-bold block mb-1">正確率</span>
              <span className="text-2xl font-extrabold text-slate-600">{accuracy}%</span>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col justify-center items-center">
              <span className="text-amber-500 text-xs font-bold block mb-1">獲得金幣</span>
              <span className="text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Coins className="w-5 h-5" />
                {coinsEarned}
              </span>
              {stats.homeLevel && stats.homeLevel >= 2 && (
                <span className="text-[10px] text-amber-500 font-extrabold mt-1">含小屋 10% 金幣加成</span>
              )}
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex flex-col justify-center items-center">
              <span className="text-purple-500 text-xs font-bold block mb-1">萌寵經驗</span>
              <span className="text-2xl font-extrabold text-purple-600">+{expEarned} EXP</span>
              {stats.homeLevel && stats.homeLevel >= 3 && (
                <span className="text-[10px] text-purple-500 font-extrabold mt-1">含小屋 15% 經驗加成</span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 max-w-md mx-auto border border-slate-100 mb-8 flex items-center gap-4 text-left">
            <img src={getPetImage()} alt="Pet" className="w-16 h-16 object-contain" />
            <div>
              <p className="font-bold text-slate-600">{pet.name} 成長中！</p>
              <p className="text-xs text-slate-400">目前等級：Lv. {pet.level}</p>
              <div className="w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden mt-1.5 border border-slate-100">
                <div 
                  className="h-full bg-pink-400 rounded-full transition-all duration-500" 
                  style={{ width: `${(pet.exp / pet.maxExp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { playSfx('click'); setGameState('lobby'); }}
              className="btn-bubble btn-secondary"
            >
              再戰一關
            </button>
            <button
              onClick={() => { playSfx('click'); onBack(); }}
              className="btn-bubble btn-primary"
            >
              回培育室看萌寵
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Lobby theme selection
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-pop-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-700 flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-300 w-8 h-8" />
          單字關卡冒險
        </h2>
        <button
          onClick={() => { playSfx('click'); onBack(); }}
          className="btn-bubble btn-gray"
        >
          返回大廳
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Themes list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-500 mb-1">請選擇冒險關卡主題：</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeName) => {
              const mastered = getMasteredCount(themeName);
              const total = getThemeTotal(themeName);
              const pct = Math.round((mastered / total) * 100) || 0;
              const isSelected = selectedTheme === themeName;

              return (
                <div
                  key={themeName}
                  onClick={() => { playSfx('bubble'); setSelectedTheme(themeName); }}
                  className={`game-card game-card-interactive border-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-pink-300 bg-pink-50/50 transform scale-[1.02]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-extrabold text-lg text-slate-600">{themeName}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                      {total} 單字
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-pink-400' : 'bg-slate-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-bold block text-right">
                    已掌握 {mastered} / {total} 字 ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Configuration & start */}
        <div className="game-card border-amber-200 h-fit flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-600 mb-4">冒險設定</h3>
            
            {/* Quest Length */}
            <div className="mb-4">
              <span className="text-sm text-slate-400 font-bold block mb-2">題數設定：</span>
              <div className="flex gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => { playSfx('click'); setQuestionCount(cnt); }}
                    className={`flex-1 py-2 rounded-xl border-2 font-bold transition-all ${
                      questionCount === cnt
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    {cnt} 題
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selection */}
            <div>
              <span className="text-sm text-slate-400 font-bold block mb-2">測驗模式：</span>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'mc', label: '多選題 (適合初學)' },
                  { id: 'spelling', label: '拼字挑戰 (適合熟練)' },
                  { id: 'mix', label: '混合模式 (綜合鍛鍊)' }
                ].map((modeOpt) => (
                  <button
                    key={modeOpt.id}
                    onClick={() => { playSfx('click'); setGameMode(modeOpt.id as any); }}
                    className={`w-full py-2.5 px-4 rounded-xl border-2 font-bold text-left transition-all ${
                      gameMode === modeOpt.id
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    {modeOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={!selectedTheme}
            onClick={startAdventure}
            className="w-full btn-bubble btn-accent py-4"
          >
            <Play className="w-5 h-5 fill-current" />
            開始單字冒險
          </button>
        </div>
      </div>
    </div>
  );
};
