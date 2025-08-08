export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          trial_ends_at: string | null
          is_premium: boolean
          xp: number
          level: number
          streak_count: number
          last_activity: string | null
          preferred_language: string
          theme: 'light' | 'dark'
          onboarding_completed: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          trial_ends_at?: string | null
          is_premium?: boolean
          xp?: number
          level?: number
          streak_count?: number
          last_activity?: string | null
          preferred_language?: string
          theme?: 'light' | 'dark'
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          trial_ends_at?: string | null
          is_premium?: boolean
          xp?: number
          level?: number
          streak_count?: number
          last_activity?: string | null
          preferred_language?: string
          theme?: 'light' | 'dark'
          onboarding_completed?: boolean
        }
        Relationships: []
      }
      folders: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          parent_id: string | null
          created_at: string
          updated_at: string
          order_index: number
        }
        Insert: {
          id?: string
          name: string
          color: string
          user_id: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          order_index?: number
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      card_sets: {
        Row: {
          id: string
          name: string
          description: string | null
          folder_id: string
          user_id: string
          created_at: string
          updated_at: string
          is_public: boolean
          share_token: string | null
          order_index: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          folder_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          share_token?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          folder_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          share_token?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_sets_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_sets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      flashcards: {
        Row: {
          id: string
          card_set_id: string
          front_content: Json
          back_content: Json
          created_at: string
          updated_at: string
          order_index: number
          difficulty_level: number
          last_reviewed: string | null
          next_review: string | null
          review_count: number
        }
        Insert: {
          id?: string
          card_set_id: string
          front_content: Json
          back_content: Json
          created_at?: string
          updated_at?: string
          order_index?: number
          difficulty_level?: number
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
        }
        Update: {
          id?: string
          card_set_id?: string
          front_content?: Json
          back_content?: Json
          created_at?: string
          updated_at?: string
          order_index?: number
          difficulty_level?: number
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_card_set_id_fkey"
            columns: ["card_set_id"]
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          invite_code: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          invite_code?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          invite_code?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_memberships: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'member' | 'admin'
          joined_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'member' | 'admin'
          joined_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'member' | 'admin'
          joined_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_memberships_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_type: string
          earned_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          badge_type: string
          earned_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          badge_type?: string
          earned_at?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          card_set_id: string
          study_mode: string
          started_at: string
          ended_at: string | null
          cards_studied: number
          correct_answers: number
          total_answers: number
          xp_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          card_set_id: string
          study_mode: string
          started_at?: string
          ended_at?: string | null
          cards_studied?: number
          correct_answers?: number
          total_answers?: number
          xp_earned?: number
        }
        Update: {
          id?: string
          user_id?: string
          card_set_id?: string
          study_mode?: string
          started_at?: string
          ended_at?: string | null
          cards_studied?: number
          correct_answers?: number
          total_answers?: number
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_card_set_id_fkey"
            columns: ["card_set_id"]
            referencedRelation: "card_sets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}