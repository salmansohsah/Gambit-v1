export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string | null
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string | null
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      capabilities: {
        Row: {
          bullet_points: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_standalone_page: boolean | null
          label: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          bullet_points?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_standalone_page?: boolean | null
          label: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          bullet_points?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_standalone_page?: boolean | null
          label?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discovery_leads: {
        Row: {
          budget_range: string | null
          current_challenge: string | null
          email: string
          full_name: string
          id: string
          industry: string | null
          ip_address: unknown
          notes: Json | null
          organization: string | null
          primary_goal: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source: string
          status: string
          submitted_at: string | null
          timeline: string | null
          user_agent: string | null
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          current_challenge?: string | null
          email: string
          full_name: string
          id?: string
          industry?: string | null
          ip_address?: unknown
          notes?: Json | null
          organization?: string | null
          primary_goal?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source: string
          status?: string
          submitted_at?: string | null
          timeline?: string | null
          user_agent?: string | null
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          current_challenge?: string | null
          email?: string
          full_name?: string
          id?: string
          industry?: string | null
          ip_address?: unknown
          notes?: Json | null
          organization?: string | null
          primary_goal?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source?: string
          status?: string
          submitted_at?: string | null
          timeline?: string | null
          user_agent?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discovery_leads_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          label: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          label: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          label?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insight_tags: {
        Row: {
          created_at: string | null
          id: string
          label: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      insight_tags_map: {
        Row: {
          insight_id: string
          tag_id: string
        }
        Insert: {
          insight_id: string
          tag_id: string
        }
        Update: {
          insight_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_tags_map_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_tags_map_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "insight_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          author_id: string | null
          body_content: string | null
          category_id: string | null
          cover_image_url: string | null
          created_at: string | null
          deleted_at: string | null
          fts: unknown
          id: string
          is_featured: boolean | null
          locale: string
          published_at: string | null
          read_time_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body_content?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          fts?: unknown
          id?: string
          is_featured?: boolean | null
          locale?: string
          published_at?: string | null
          read_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body_content?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          fts?: unknown
          id?: string
          is_featured?: boolean | null
          locale?: string
          published_at?: string | null
          read_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "insight_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_items: {
        Row: {
          created_at: string | null
          display_order: number
          href: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_external: boolean | null
          label: string
          menu_type: string
          target: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          href: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label: string
          menu_type: string
          target?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          href?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label?: string
          menu_type?: string
          target?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          id: string
          key: string
          locale: string
          page: string
          page_content_schema_id: string
          section: string
          updated_at: string | null
          value_json: Json | null
          value_text: string | null
        }
        Insert: {
          id?: string
          key: string
          locale?: string
          page: string
          page_content_schema_id: string
          section: string
          updated_at?: string | null
          value_json?: Json | null
          value_text?: string | null
        }
        Update: {
          id?: string
          key?: string
          locale?: string
          page?: string
          page_content_schema_id?: string
          section?: string
          updated_at?: string | null
          value_json?: Json | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_content_page_content_schema_id_fkey"
            columns: ["page_content_schema_id"]
            isOneToOne: false
            referencedRelation: "page_content_schema"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content_schema: {
        Row: {
          default_value: string | null
          id: string
          input_type: string
          is_active: boolean | null
          key: string
          label: string
          max_length: number | null
          page: string
          section: string
        }
        Insert: {
          default_value?: string | null
          id?: string
          input_type: string
          is_active?: boolean | null
          key: string
          label: string
          max_length?: number | null
          page: string
          section: string
        }
        Update: {
          default_value?: string | null
          id?: string
          input_type?: string
          is_active?: boolean | null
          key?: string
          label?: string
          max_length?: number | null
          page?: string
          section?: string
        }
        Relationships: []
      }
      project_capabilities: {
        Row: {
          capability_id: string
          created_at: string | null
          project_id: string
        }
        Insert: {
          capability_id: string
          created_at?: string | null
          project_id: string
        }
        Update: {
          capability_id?: string
          created_at?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_capabilities_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_capabilities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          cover_image_url: string | null
          created_at: string | null
          deleted_at: string | null
          display_order: number | null
          evidence_image_url: string | null
          has_full_case_study: boolean | null
          id: string
          is_featured_home: boolean | null
          is_featured_portfolio: boolean | null
          move_code: number | null
          objective: string | null
          outcome_label: string | null
          outcome_metric: string | null
          published_at: string | null
          situation: string | null
          slug: string
          status: string
          strategy: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_order?: number | null
          evidence_image_url?: string | null
          has_full_case_study?: boolean | null
          id?: string
          is_featured_home?: boolean | null
          is_featured_portfolio?: boolean | null
          move_code?: number | null
          objective?: string | null
          outcome_label?: string | null
          outcome_metric?: string | null
          published_at?: string | null
          situation?: string | null
          slug: string
          status?: string
          strategy?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_order?: number | null
          evidence_image_url?: string | null
          has_full_case_study?: boolean | null
          id?: string
          is_featured_home?: boolean | null
          is_featured_portfolio?: boolean | null
          move_code?: number | null
          objective?: string | null
          outcome_label?: string | null
          outcome_metric?: string | null
          published_at?: string | null
          situation?: string | null
          slug?: string
          status?: string
          strategy?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_overrides: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          keywords: string | null
          nofollow: boolean | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          structured_data_json: Json | null
          title: string | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string | null
          nofollow?: boolean | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          structured_data_json?: Json | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string | null
          nofollow?: boolean | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          structured_data_json?: Json | null
          title?: string | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          facebook_url: string | null
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          nav_cta_label: string | null
          nav_cta_url: string | null
          scheduling_url: string | null
          seo_default_description: string | null
          seo_default_title: string | null
          site_name: string
          tagline: string | null
          twitter_url: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contact_email?: string | null
          facebook_url?: string | null
          id: number
          instagram_url?: string | null
          linkedin_url?: string | null
          nav_cta_label?: string | null
          nav_cta_url?: string | null
          scheduling_url?: string | null
          seo_default_description?: string | null
          seo_default_title?: string | null
          site_name?: string
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contact_email?: string | null
          facebook_url?: string | null
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          nav_cta_label?: string | null
          nav_cta_url?: string | null
          scheduling_url?: string | null
          seo_default_description?: string | null
          seo_default_title?: string | null
          site_name?: string
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          discord_handle: string | null
          display_order: number | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          is_founder: boolean | null
          linkedin_url: string | null
          portrait_url: string | null
          role_title: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          discord_handle?: string | null
          display_order?: number | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          is_founder?: boolean | null
          linkedin_url?: string | null
          portrait_url?: string | null
          role_title?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          discord_handle?: string | null
          display_order?: number | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_founder?: boolean | null
          linkedin_url?: string | null
          portrait_url?: string | null
          role_title?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_role: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
