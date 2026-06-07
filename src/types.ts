export interface Word {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  theme: string;
}

export type PetType = 'cat' | 'dog' | 'slime';
export type PetStage = 'egg' | 'baby' | 'teen' | 'adult';

export interface Pet {
  name: string;
  type: PetType;
  level: number;
  exp: number;
  maxExp: number;
  satiety: number; // 0 - 100
  affection: number; // 0 - 100
  appearance: PetStage;
  isSick?: boolean; // If satiety is 0, pet falls sick
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  satietyRestore: number;
  affectionIncrease: number;
  description: string;
  icon: string;
  type?: 'food' | 'potion'; // potion to cure sickness
}

export interface UserStats {
  coins: number;
  streak: number;
  lastActiveDate: string;
  totalAnswered: number;
  correctAnswers: number;
  masteredWords: string[]; // array of word IDs that are mastered
  wrongAttempts: Record<string, number>; // word ID -> count of wrong attempts
  dailyCheckInDate?: string;
  consecutiveCheckIns?: number;
  accessoriesOwned?: string[]; // Emojis like ['🎀', '🎓', '👓', '👑']
  equippedAccessories?: string[]; // Equipped accessories on pet
  furnitureOwned?: string[]; // Emojis like ['🛏️', '📚', '🪴', '🧸']
  equippedFurniture?: string[]; // Equipped furniture in room
  achievements?: string[]; // e.g. ['hatch', 'evolve', 'streak_7']
  petDiary?: string[]; // Event logs
}

export interface StudySession {
  theme: string;
  words: Word[];
  currentIndex: number;
  answers: { wordId: string; correct: boolean }[];
  coinsEarned: number;
  expEarned: number;
}
