export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          attendance_date: string
          created_at: string
          event_id: string | null
          id: string
          member_id: string | null
          notes: string | null
          present: boolean | null
          updated_at: string
        }
        Insert: {
          attendance_date?: string
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          present?: boolean | null
          updated_at?: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          present?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      church_settings: {
        Row: {
          church_address: string | null
          church_email: string | null
          church_name: string
          church_phone: string | null
          church_website: string | null
          created_at: string
          id: string
          service_times: string | null
          updated_at: string
        }
        Insert: {
          church_address?: string | null
          church_email?: string | null
          church_name?: string
          church_phone?: string | null
          church_website?: string | null
          created_at?: string
          id?: string
          service_times?: string | null
          updated_at?: string
        }
        Update: {
          church_address?: string | null
          church_email?: string | null
          church_name?: string
          church_phone?: string | null
          church_website?: string | null
          created_at?: string
          id?: string
          service_times?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          communication_type: string
          created_at: string | null
          id: string
          message: string
          recipient_ids: string[] | null
          recipient_type: string
          scheduled_at: string | null
          sender_id: string
          sent_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          communication_type: string
          created_at?: string | null
          id?: string
          message: string
          recipient_ids?: string[] | null
          recipient_type: string
          scheduled_at?: string | null
          sender_id: string
          sent_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          communication_type?: string
          created_at?: string | null
          id?: string
          message?: string
          recipient_ids?: string[] | null
          recipient_type?: string
          scheduled_at?: string | null
          sender_id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_date: string
          donation_type: string | null
          donor_email: string | null
          donor_name: string
          donor_phone: string | null
          id: string
          is_recurring: boolean | null
          member_id: string | null
          notes: string | null
          payment_method: string | null
          reference_number: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          donation_date?: string
          donation_type?: string | null
          donor_email?: string | null
          donor_name: string
          donor_phone?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          reference_number?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          donation_date?: string
          donation_type?: string | null
          donor_email?: string | null
          donor_name?: string
          donor_phone?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          reference_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_attendance_counts: {
        Row: {
          adults_count: number | null
          attendance_date: string
          children_count: number | null
          created_at: string
          event_id: string | null
          id: string
          members_count: number | null
          notes: string | null
          recorded_by: string | null
          total_count: number
          updated_at: string
          visitors_count: number | null
        }
        Insert: {
          adults_count?: number | null
          attendance_date: string
          children_count?: number | null
          created_at?: string
          event_id?: string | null
          id?: string
          members_count?: number | null
          notes?: string | null
          recorded_by?: string | null
          total_count?: number
          updated_at?: string
          visitors_count?: number | null
        }
        Update: {
          adults_count?: number | null
          attendance_date?: string
          children_count?: number | null
          created_at?: string
          event_id?: string | null
          id?: string
          members_count?: number | null
          notes?: string | null
          recorded_by?: string | null
          total_count?: number
          updated_at?: string
          visitors_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_counts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          current_attendees: number | null
          description: string | null
          end_time: string | null
          event_date: string
          event_type: string | null
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          registration_required: boolean | null
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time?: string | null
          event_date: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean | null
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expense_date: string
          goal_id: string | null
          id: string
          is_recurring: boolean | null
          recurrence_rule: string | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date: string
          goal_id?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_rule?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          goal_id?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_rule?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "financial_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          target_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          target_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          target_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      income_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          description: string | null
          donation_id: string | null
          id: string
          income_date: string
          member_id: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          income_date: string
          member_id?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          income_date?: string
          member_id?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incomes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "income_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incomes_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incomes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          alternate_phone_number: string | null
          baptism_status: Database["public"]["Enums"]["baptism_status"] | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          department: Database["public"]["Enums"]["department_type"] | null
          education: Database["public"]["Enums"]["education_type"] | null
          email: string | null
          emergency_contact: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          group: Database["public"]["Enums"]["group_type"] | null
          home_town: string | null
          id: string
          join_date: string | null
          last_name: string
          marital_status:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          member_id: string | null
          membership_date: string | null
          membership_status: Database["public"]["Enums"]["member_status"] | null
          membership_type: Database["public"]["Enums"]["membership_type"] | null
          ministry: Database["public"]["Enums"]["ministry_type"] | null
          notes: string | null
          Notes: string | null
          occupation: string | null
          phone_number: string | null
          postal_code: string | null
          profile_image_url: string | null
          role: string | null
          state: string | null
          tithe_number: string | null
          updated_at: string
          volunteer_preferences_can_lead_group: boolean | null
        }
        Insert: {
          address?: string | null
          alternate_phone_number?: string | null
          baptism_status?: Database["public"]["Enums"]["baptism_status"] | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: Database["public"]["Enums"]["department_type"] | null
          education?: Database["public"]["Enums"]["education_type"] | null
          email?: string | null
          emergency_contact?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          group?: Database["public"]["Enums"]["group_type"] | null
          home_town?: string | null
          id?: string
          join_date?: string | null
          last_name: string
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          member_id?: string | null
          membership_date?: string | null
          membership_status?:
            | Database["public"]["Enums"]["member_status"]
            | null
          membership_type?:
            | Database["public"]["Enums"]["membership_type"]
            | null
          ministry?: Database["public"]["Enums"]["ministry_type"] | null
          notes?: string | null
          Notes?: string | null
          occupation?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          role?: string | null
          state?: string | null
          tithe_number?: string | null
          updated_at?: string
          volunteer_preferences_can_lead_group?: boolean | null
        }
        Update: {
          address?: string | null
          alternate_phone_number?: string | null
          baptism_status?: Database["public"]["Enums"]["baptism_status"] | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: Database["public"]["Enums"]["department_type"] | null
          education?: Database["public"]["Enums"]["education_type"] | null
          email?: string | null
          emergency_contact?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          group?: Database["public"]["Enums"]["group_type"] | null
          home_town?: string | null
          id?: string
          join_date?: string | null
          last_name?: string
          marital_status?:
            | Database["public"]["Enums"]["marital_status_type"]
            | null
          member_id?: string | null
          membership_date?: string | null
          membership_status?:
            | Database["public"]["Enums"]["member_status"]
            | null
          membership_type?:
            | Database["public"]["Enums"]["membership_type"]
            | null
          ministry?: Database["public"]["Enums"]["ministry_type"] | null
          notes?: string | null
          Notes?: string | null
          occupation?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          role?: string | null
          state?: string | null
          tithe_number?: string | null
          updated_at?: string
          volunteer_preferences_can_lead_group?: boolean | null
        }
        Relationships: []
      }
      message_logs: {
        Row: {
          body: string
          id: string
          recipient: string
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          type: string
        }
        Insert: {
          body: string
          id?: string
          recipient: string
          sent_at?: string | null
          status: string
          subject: string
          template_id?: string | null
          type: string
        }
        Update: {
          body?: string
          id?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          body: string
          channel: string
          created_at: string | null
          id: string
          name: string
          subject: string
        }
        Insert: {
          body: string
          channel: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          donation_alerts: boolean | null
          email_notifications: boolean | null
          event_reminders: boolean | null
          id: string
          sms_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          donation_alerts?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          donation_alerts?: boolean | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          is_private: boolean | null
          is_public: boolean | null
          prayer_count: string | null
          requester_id: string
          scripture_reference: string | null
          status: string
          title: string
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          prayer_count?: string | null
          requester_id: string
          scripture_reference?: string | null
          status: string
          title: string
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          prayer_count?: string | null
          requester_id?: string
          scripture_reference?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          expense_id: string | null
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          expense_id?: string | null
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          expense_id?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          audio_url: string | null
          category: string | null
          date: string | null
          description: string | null
          duration: string | null
          id: string
          notes_url: string | null
          preacher: string | null
          scripture_reference: string | null
          tags: string[] | null
          title: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          category?: string | null
          date?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          notes_url?: string | null
          preacher?: string | null
          scripture_reference?: string | null
          tags?: string[] | null
          title: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string | null
          date?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          notes_url?: string | null
          preacher?: string | null
          scripture_reference?: string | null
          tags?: string[] | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      small_group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          member_id: string | null
          role: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          role?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "small_group_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      small_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          leader_id: string
          max_members: number | null
          meeting_day: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id: string
          max_members?: number | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string
          max_members?: number | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "small_groups_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          how_did_you_hear_about_us: string | null
          id: string
          last_name: string
          notes: string | null
          phone_number: string | null
          state: string | null
          updated_at: string
          visit_date: string
          visited_before: boolean | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          how_did_you_hear_about_us?: string | null
          id?: string
          last_name: string
          notes?: string | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          visit_date?: string
          visited_before?: boolean | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          how_did_you_hear_about_us?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          visit_date?: string
          visited_before?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      baptism_status: "baptized" | "not_baptized"
      department_type:
        | "music"
        | "usher_cleaner"
        | "media"
        | "finance"
        | "welfare"
        | "sunday_school"
        | "account"
        | "welfare_committee"
        | "choir"
        | "cleaners"
        | "n_a"
      education_type: "primary" | "secondary" | "diploma" | "other"
      gender_type: "male" | "female"
      group_type:
        | "prayer"
        | "evangelism"
        | "follow_up"
        | "leaders"
        | "prayer_tower"
        | "usher"
        | "youth_ministry"
      marital_status_type: "single" | "married" | "divorced" | "widowed"
      member_role: "admin" | "member" | "guest"
      member_status: "active" | "inactive"
      membership_type:
        | "full_member"
        | "friend_of_church"
        | "new_convert"
        | "visitor"
        | "others"
        | "regular"
        | "leadership"
      ministry_type:
        | "men_ministry"
        | "youth_ministry"
        | "women_ministry"
        | "children_ministry"
        | "all"
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
    Enums: {
      baptism_status: ["baptized", "not_baptized"],
      department_type: [
        "music",
        "usher_cleaner",
        "media",
        "finance",
        "welfare",
        "sunday_school",
        "account",
        "welfare_committee",
        "choir",
        "cleaners",
        "n_a",
      ],
      education_type: ["primary", "secondary", "diploma", "other"],
      gender_type: ["male", "female"],
      group_type: [
        "prayer",
        "evangelism",
        "follow_up",
        "leaders",
        "prayer_tower",
        "usher",
        "youth_ministry",
      ],
      marital_status_type: ["single", "married", "divorced", "widowed"],
      member_role: ["admin", "member", "guest"],
      member_status: ["active", "inactive"],
      membership_type: [
        "full_member",
        "friend_of_church",
        "new_convert",
        "visitor",
        "others",
        "regular",
        "leadership",
      ],
      ministry_type: [
        "men_ministry",
        "youth_ministry",
        "women_ministry",
        "children_ministry",
        "all",
      ],
    },
  },
} as const
