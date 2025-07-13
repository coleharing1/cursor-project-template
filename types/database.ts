export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          icon: string | null
          header: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          icon?: string | null
          header?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          icon?: string | null
          header?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high'
          duration: number | null
          due_date: string | null
          tags: string[] | null
          parent_id: string | null
          category_id: string | null
          is_focused: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          duration?: number | null
          due_date?: string | null
          tags?: string[] | null
          parent_id?: string | null
          category_id?: string | null
          is_focused?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          duration?: number | null
          due_date?: string | null
          tags?: string[] | null
          parent_id?: string | null
          category_id?: string | null
          is_focused?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}