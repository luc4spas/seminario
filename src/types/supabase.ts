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
      registrations: {
        Row: {
          id: string
          created_at: string
          full_name: string
          phone: string
          ministry: string
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          phone: string
          ministry: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          phone?: string
          ministry?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}