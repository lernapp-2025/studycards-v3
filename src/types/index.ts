import { Database } from './database';

export type { Database };

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Folder = Database['public']['Tables']['folders']['Row'];
export type FolderInsert = Database['public']['Tables']['folders']['Insert'];
export type FolderUpdate = Database['public']['Tables']['folders']['Update'];

export type CardSet = Database['public']['Tables']['card_sets']['Row'];
export type CardSetInsert = Database['public']['Tables']['card_sets']['Insert'];
export type CardSetUpdate = Database['public']['Tables']['card_sets']['Update'];

export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
export type FlashcardInsert = Database['public']['Tables']['flashcards']['Insert'];
export type FlashcardUpdate = Database['public']['Tables']['flashcards']['Update'];

export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupInsert = Database['public']['Tables']['groups']['Insert'];
export type GroupUpdate = Database['public']['Tables']['groups']['Update'];

export type GroupMembership = Database['public']['Tables']['group_memberships']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type StudySession = Database['public']['Tables']['study_sessions']['Row'];

export type StudyCardColor = 
  | '#7EC4FF'  // sc-blue
  | '#6EE7B7'  // sc-green
  | '#FFF58F'  // sc-yellow
  | '#FFD085'  // sc-orange
  | '#FF8FA3'  // sc-pink
  | '#BFA7FF'  // sc-purple
  | '#60EFFF'  // sc-turquoise
  | '#FF8787'; // sc-red

export interface CardContent {
  type: 'text' | 'image';
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation?: number;
  zIndex?: number;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface StudyCardData {
  front: CardContent[];
  back: CardContent[];
}

export type StudyMode = 'flashcards' | 'learn' | 'write' | 'test' | 'match';

export type BadgeType = 
  | 'kartenguru'
  | 'gruppenleader' 
  | 'ordnerprofi'
  | 'lernchamp'
  | 'streak-koenig'
  | 'quiz-master'
  | 'erklaerbaer'
  | 'marathon-lerner';

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'xp' | 'streak' | 'cards_created' | 'groups_created' | 'study_time';
    value: number;
  };
}

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
  cardSets?: CardSet[];
}

export interface StudyStatistics {
  totalCards: number;
  cardsStudied: number;
  correctAnswers: number;
  totalAnswers: number;
  studyTime: number;
  streak: number;
  xp: number;
  level: number;
  badges: BadgeType[];
}

export interface GroupWithMembers extends Group {
  members?: (GroupMembership & { user: User })[];
  memberCount?: number;
}

export interface CardSetWithCards extends CardSet {
  flashcards?: Flashcard[];
  cardCount?: number;
}

export type Theme = 'light' | 'dark';
export type Language = 'de' | 'en';

export interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: {
    studyReminders: boolean;
    groupInvites: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisible: boolean;
    statsVisible: boolean;
  };
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  folders?: string[];
  colors?: StudyCardColor[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'study_count';
  sortOrder?: 'asc' | 'desc';
}