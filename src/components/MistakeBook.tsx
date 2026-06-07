import React, { useState } from 'react';
import type { UserStats, Word } from '../types';
import { wordDatabase } from '../wordData';
import { BookOpen, Volume2, Trash2, ArrowLeft, Award, Sparkles, Check } from 'lucide-react';
import { playSfx, speakWord } from '../audioHelper';

interface MistakeBookProps {
  stats: UserStats;
  onBack: () => void;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
}

export const MistakeBook: React.FC<MistakeBookProps> = ({ stats, onBack, onUpdateStats }) => {
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);

  // Find all words currently in the mistake book
  const mistakeWordIds = Object.keys(stats.wrongAttempts).filter(
    (id) => stats.wrongAttempts[id] > 0
  );

  const mistakeWords = wordDatabase.filter((w) => mistakeWordIds.includes(w.id));

  // Generate options for the current review question
  const generateOptions = (correctWord: Word) => {
    const wrongPool = wordDatabase
      .filter((w) => w.id !== correctWord.id)
      .map((w) => w.translation);
    
    // Pick 3 random wrong translations
    const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine with correct and shuffle
    const combined = [correctWord.translation, ...shuffledWrong];
    return combined.sort(() => 0.5 - Math.random());
  };

  const startReview = () => {
    if (mistakeWords.length === 0) return;
    playSfx('bubble');
    
    // Choose up to 8 random wrong words to review
    const shuffled = [...mistakeWords].sort(() => 0.5 - Math.random()).slice(0, 8);
    setReviewWords(shuffled);
    setReviewIndex(0);
    setReviewMode(true);
    setIsAnswered(false);
    setSelectedOption(null);
    
    const opts = generateOptions(shuffled[0]);
    setOptions(opts);
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentWord = reviewWords[reviewIndex];
    const isCorrect = option === currentWord.translation;

    if (isCorrect) {
      playSfx('correct');
      
      // Decrease wrongAttempts in user stats
      onUpdateStats((prev) => {
        const newAttempts = { ...prev.wrongAttempts };
        if (newAttempts[currentWord.id] > 0) {
          newAttempts[currentWord.id] -= 1;
          if (newAttempts[currentWord.id] === 0) {
            delete newAttempts[currentWord.id];
          }
        }
        
        // Also add to masteredWords if not already there, as they reviewed it successfully!
        const newMastered = prev.masteredWords.includes(currentWord.id)
          ? prev.masteredWords
          : [...prev.masteredWords, currentWord.id];

        return {
          ...prev,
          coins: prev.coins + 8, // Give some coins for successful review!
          wrongAttempts: newAttempts,
          masteredWords: newMastered,
          totalAnswered: prev.totalAnswered + 1,
          correctAnswers: prev.correctAnswers + 1
        };
      });
    } else {
      playSfx('wrong');
      onUpdateStats((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1
      }));
    }
  };

  const handleNextReview = () => {
    playSfx('click');
    const nextIdx = reviewIndex + 1;
    if (nextIdx < reviewWords.length) {
      setReviewIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      const opts = generateOptions(reviewWords[nextIdx]);
      setOptions(opts);
    } else {
      // Finished all review words!
      setReviewMode(false);
      playSfx('levelup');
    }
  };

  // Sound play
  const triggerPronunciation = (wordText: string) => {
    playSfx('click');
    speakWord(wordText);
  };

  // Remove word from mistake book manually
  const removeWordManually = (wordId: string) => {
    playSfx('click');
    onUpdateStats((prev) => {
      const newAttempts = { ...prev.wrongAttempts };
      delete newAttempts[wordId];
      return {
        ...prev,
        wrongAttempts: newAttempts
      };
    });
  };

  if (reviewMode && reviewWords.length > 0) {
    const currentWord = reviewWords[reviewIndex];
    return (
      <div className="w-full max-w-2xl mx-auto p-4 animate-pop-in">
        <div className="game-card border-purple-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">
              錯題溫習關卡：{reviewIndex + 1} / {reviewWords.length}
            </span>
            <button
              onClick={() => { playSfx('click'); setReviewMode(false); }}
              className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> 結束複習
            </button>
          </div>

          {/* Word Question */}
          <div className="text-center py-6 mb-4">
            <h3 className="text-4xl font-extrabold text-slate-700 tracking-wide mb-2 select-all">
              {currentWord.word}
            </h3>
            <p className="text-slate-400 text-lg mb-4">{currentWord.phonetic}</p>
            <button
              onClick={() => triggerPronunciation(currentWord.word)}
              className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-500 rounded-full transition-colors inline-flex items-center justify-center"
              title="播放發音"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  onClick={() => handleOptionClick(opt)}
                  className={`border-4 p-4 rounded-2xl text-left transition-all ${btnStyle} flex justify-between items-center`}
                >
                  <span className="font-semibold text-lg">{opt}</span>
                  {isAnswered && isCorrectOpt && <Check className="w-5 h-5 text-emerald-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanations & Examples (Revealed after answering) */}
          {isAnswered && (
            <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-6 animate-pop-in">
              <h4 className="font-bold text-slate-700 mb-1">例句與釋義：</h4>
              <p className="text-slate-500 font-medium italic mb-1">{currentWord.example}</p>
              <p className="text-slate-400 text-sm">{currentWord.exampleTranslation}</p>
              {selectedOption === currentWord.translation ? (
                <p className="text-emerald-500 text-sm font-semibold mt-3 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> 答對了！此單字在錯題本的紀錄已減少，並獲得 8 金幣！
                </p>
              ) : (
                <p className="text-pink-500 text-sm font-semibold mt-3">
                  答錯囉，沒關係，多複習幾次就能記住了！
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextReview}
              className="w-full btn-bubble btn-primary"
            >
              {reviewIndex + 1 === reviewWords.length ? '完成複習' : '下一題'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-pop-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-700 flex items-center gap-2">
          <BookOpen className="text-purple-400 w-8 h-8" />
          錯題複習本
        </h2>
        <div className="flex gap-3">
          {mistakeWords.length > 0 && (
            <button
              onClick={startReview}
              className="btn-bubble btn-accent"
            >
              <Sparkles className="w-5 h-5" /> 開始錯題複習
            </button>
          )}
          <button
            onClick={() => { playSfx('click'); onBack(); }}
            className="btn-bubble btn-gray"
          >
            返回大廳
          </button>
        </div>
      </div>

      {/* Main content */}
      {mistakeWords.length === 0 ? (
        <div className="game-card text-center py-12 border-purple-100">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-300">
            <Award className="w-10 h-10" />
          </div>
          <p className="text-xl font-bold text-slate-500 mb-2">你的錯題本是空的！</p>
          <p className="text-slate-400">太棒了！你在冒險中的所有回答都完美無缺，繼續保持喔！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mistakeWords.map((word) => (
            <div key={word.id} className="game-card border-purple-100 flex flex-col justify-between hover:border-purple-200 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-700 select-all">{word.word}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">
                      {word.theme}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerPronunciation(word.word)}
                      className="p-2 bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-purple-500 rounded-full transition-colors"
                      title="發音"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeWordManually(word.id)}
                      className="p-2 bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-500 rounded-full transition-colors"
                      title="手動移出錯題本"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-2">{word.phonetic}</p>
                <p className="text-slate-600 font-bold mb-3">{word.translation}</p>
                
                <div className="border-t border-dashed border-slate-100 pt-3 text-xs">
                  <p className="text-slate-500 italic">{word.example}</p>
                  <p className="text-slate-400 mt-1">{word.exampleTranslation}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>累計答錯次數：</span>
                <span className="bg-pink-100 text-pink-600 font-bold px-2.5 py-0.5 rounded-full">
                  {stats.wrongAttempts[word.id] || 1} 次
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
