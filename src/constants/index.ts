import type { StudyCardColor, Badge, BadgeType } from '@/types';

export const STUDY_CARD_COLORS: StudyCardColor[] = [
  '#7EC4FF', // sc-blue
  '#6EE7B7', // sc-green
  '#FFF58F', // sc-yellow
  '#FFD085', // sc-orange
  '#FF8FA3', // sc-pink
  '#BFA7FF', // sc-purple
  '#60EFFF', // sc-turquoise
  '#FF8787', // sc-red
] as const;

export const COLOR_NAMES: Record<StudyCardColor, string> = {
  '#7EC4FF': 'Blau',
  '#6EE7B7': 'Grün', 
  '#FFF58F': 'Gelb',
  '#FFD085': 'Orange',
  '#FF8FA3': 'Pink',
  '#BFA7FF': 'Lila',
  '#60EFFF': 'Türkis',
  '#FF8787': 'Rot',
};

export const BADGES: Record<BadgeType, Badge> = {
  'kartenguru': {
    type: 'kartenguru',
    name: 'Kartenguru',
    description: 'Erstelle 50 Karteikarten',
    icon: '🎯',
    color: '#7EC4FF',
    requirement: { type: 'cards_created', value: 50 }
  },
  'gruppenleader': {
    type: 'gruppenleader',
    name: 'Gruppenleader',
    description: 'Erstelle 5 Gruppen',
    icon: '👑',
    color: '#FFD085',
    requirement: { type: 'groups_created', value: 5 }
  },
  'ordnerprofi': {
    type: 'ordnerprofi',
    name: 'Ordnerprofi',
    description: 'Erreiche 1000 XP',
    icon: '📁',
    color: '#6EE7B7',
    requirement: { type: 'xp', value: 1000 }
  },
  'lernchamp': {
    type: 'lernchamp',
    name: 'Lernchamp',
    description: 'Erreiche 5000 XP',
    icon: '🏆',
    color: '#FF8FA3',
    requirement: { type: 'xp', value: 5000 }
  },
  'streak-koenig': {
    type: 'streak-koenig',
    name: 'Streak-König',
    description: 'Erreiche eine 30-Tage-Streak',
    icon: '🔥',
    color: '#FF8787',
    requirement: { type: 'streak', value: 30 }
  },
  'quiz-master': {
    type: 'quiz-master',
    name: 'Quiz-Master',
    description: 'Erreiche 10000 XP',
    icon: '🎓',
    color: '#BFA7FF',
    requirement: { type: 'xp', value: 10000 }
  },
  'erklaerbaer': {
    type: 'erklaerbaer',
    name: 'Erklärbär',
    description: 'Lerne 100 Stunden',
    icon: '🐻',
    color: '#60EFFF',
    requirement: { type: 'study_time', value: 6000 } // 100 hours in minutes
  },
  'marathon-lerner': {
    type: 'marathon-lerner',
    name: 'Marathon-Lerner',
    description: 'Lerne 500 Stunden',
    icon: '🏃',
    color: '#FFF58F',
    requirement: { type: 'study_time', value: 30000 } // 500 hours in minutes
  }
};

export const LIMITS = {
  FOLDERS_PER_LEVEL: 20,
  CARDS_PER_SET: 100,
  GROUPS_PER_USER: 15,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FOLDER_DEPTH: 10,
  MIN_FOLDER_NAME_LENGTH: 1,
  MAX_FOLDER_NAME_LENGTH: 50,
  MIN_SET_NAME_LENGTH: 1,
  MAX_SET_NAME_LENGTH: 100,
  MIN_GROUP_NAME_LENGTH: 1,
  MAX_GROUP_NAME_LENGTH: 50,
} as const;

export const XP_VALUES = {
  CREATE_CARD: 10,
  STUDY_CARD: 5,
  CORRECT_ANSWER: 10,
  INCORRECT_ANSWER: 2,
  COMPLETE_SET: 50,
  CREATE_FOLDER: 15,
  CREATE_GROUP: 25,
  DAILY_STREAK: 20,
} as const;

export const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  500,  // Level 4
  1000, // Level 5
  2000, // Level 6
  3500, // Level 7
  5500, // Level 8
  8000, // Level 9
  11000, // Level 10
  15000, // Level 11
  20000, // Level 12
  26000, // Level 13
  33000, // Level 14
  41000, // Level 15
  50000, // Level 16+
] as const;

export const STUDY_MODES = {
  flashcards: {
    name: 'Karteikarten',
    description: 'Klassisches Durchblättern',
    icon: '🃏',
    color: '#7EC4FF'
  },
  learn: {
    name: 'Lernmodus',
    description: 'Spaced Repetition System',
    icon: '🧠',
    color: '#6EE7B7'
  },
  write: {
    name: 'Schreibmodus',
    description: 'Antworten eintippen',
    icon: '✏️',
    color: '#FFD085'
  },
  test: {
    name: 'Testmodus',
    description: 'Multiple Choice & Tests',
    icon: '📝',
    color: '#FF8FA3'
  },
  match: {
    name: 'Zuordnungsspiel',
    description: 'Begriffe zuordnen',
    icon: '🎯',
    color: '#BFA7FF'
  }
} as const;

export const TRIAL_DURATION_DAYS = 7;
export const PREMIUM_PRICE_EUR = 7.99;

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/svg+xml'
] as const;

export const DEFAULT_CARD_SIZE = {
  width: 300,
  height: 200
} as const;

export const DEFAULT_TEXT_STYLE = {
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  textAlign: 'left' as const
};

export const SPACED_REPETITION_INTERVALS = [
  1,    // 1 day
  3,    // 3 days  
  7,    // 1 week
  14,   // 2 weeks
  30,   // 1 month
  90,   // 3 months
  180   // 6 months
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  FOLDERS: '/folders',
  STUDY: '/study',
  GROUPS: '/groups',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRICING: '/pricing',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;