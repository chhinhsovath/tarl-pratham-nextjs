import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    pilot_school_id: number | null
    teacher_profile_setup: boolean
    mentor_profile_complete: boolean
    province: string | null
    district?: string | null
    subject: string | null
    isQuickLogin?: boolean
    onboarding_completed?: any
    show_onboarding?: boolean
    holding_classes?: string | null
    profile_expires_at?: Date | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      pilot_school_id: number | null
      teacher_profile_setup: boolean
      mentor_profile_complete: boolean
      province: string | null
      district: string | null
      subject: string | null
      isQuickLogin: boolean
      onboarding_completed: any
      show_onboarding: boolean
      holding_classes: string | null
      profile_expires_at: Date | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    pilot_school_id: number | null
    teacher_profile_setup: boolean
    mentor_profile_complete: boolean
    province: string | null
    district: string | null
    subject: string | null
    isQuickLogin: boolean
    onboarding_completed: any
    show_onboarding: boolean
    holding_classes: string | null
    profile_expires_at: Date | null
  }
}