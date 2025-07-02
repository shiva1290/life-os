export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_blocks: {
        Row: {
          block_type: string | null
          completed: boolean | null
          created_at: string | null
          date: string | null
          emoji: string | null
          id: string
          is_active: boolean | null
          task: string
          time_slot: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          block_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          emoji?: string | null
          id?: string
          is_active?: boolean | null
          task: string
          time_slot: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          block_type?: string | null
          completed?: boolean | null
          created_at?: string | null
          date?: string | null
          emoji?: string | null
          id?: string
          is_active?: boolean | null
          task?: string
          time_slot?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dsa_problems: {
        Row: {
          created_at: string | null
          difficulty: string | null
          id: string
          problem_name: string
          solved_date: string | null
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          difficulty?: string | null
          id?: string
          problem_name: string
          solved_date?: string | null
          topic?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string | null
          id?: string
          problem_name?: string
          solved_date?: string | null
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          session_type: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_type: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_type?: string
          user_id?: string
        }
        Relationships: []
      }
      gym_checkins: {
        Row: {
          checkin_date: string | null
          checkin_time: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          checkin_date?: string | null
          checkin_time?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          checkin_date?: string | null
          checkin_time?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_date: string
          created_at: string | null
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_date: string
          created_at?: string | null
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string | null
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          best_streak: number | null
          category: string | null
          color: string | null
          created_at: string | null
          current_streak: number | null
          icon: string | null
          id: string
          name: string
          streak: number | null
          target_frequency: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          current_streak?: number | null
          icon?: string | null
          id?: string
          name: string
          streak?: number | null
          target_frequency?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_streak?: number | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          current_streak?: number | null
          icon?: string | null
          id?: string
          name?: string
          streak?: number | null
          target_frequency?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_name: string
          status: string | null
          task_title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_name: string
          status?: string | null
          task_title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_name?: string
          status?: string | null
          task_title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          content: Json | null
          created_at: string | null
          date: string | null
          id: string
          mood_score: number | null
          reflection_type: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          date?: string | null
          id?: string
          mood_score?: number | null
          reflection_type: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          date?: string | null
          id?: string
          mood_score?: number | null
          reflection_type?: string
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string | null
          emoji: string | null
          id: string
          schedule_type: string
          task: string
          task_type: string | null
          time_slot: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          schedule_type: string
          task: string
          task_type?: string | null
          time_slot: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          schedule_type?: string
          task?: string
          task_type?: string | null
          time_slot?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string | null
          created_date: string | null
          id: string
          priority: string | null
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_date?: string | null
          id?: string
          priority?: string | null
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_date?: string | null
          id?: string
          priority?: string | null
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
