import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        loginType: { label: "Login Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error("Password is required");
        }

        // Quick login with username (now using unified users table)
        if (credentials.loginType === "quick" && credentials.username) {
          const user = await prisma.users.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { username_login: credentials.username }
              ]
              // No login_type filter - accept ANY user with matching username
            }
          });

          if (!user || !user.is_active) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          // Compute profile completion status: true if both pilot_school_id and subject are set
          const profileComplete = user.pilot_school_id && user.subject;

          return {
            id: user.id.toString(),
            email: user.email || `${user.username}@quick.login`,
            name: user.name || user.username || user.username_login,
            role: user.role,
            pilot_school_id: user.pilot_school_id,
            teacher_profile_setup: user.role === "teacher" ? profileComplete : false,
            mentor_profile_complete: user.role === "mentor" ? profileComplete : false,
            province: user.province,
            subject: user.subject,
            phone: user.phone,
            isQuickLogin: true,
            onboarding_completed: user.onboarding_completed,
            show_onboarding: user.show_onboarding !== false,
            holding_classes: user.holding_classes,
            district: user.district,
            profile_expires_at: user.profile_expires_at
          };
        }

        // Regular login with email
        if (!credentials?.email) {
          throw new Error("Email is required for regular login");
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Compute profile completion status: true if both pilot_school_id and subject are set
        const profileComplete = user.pilot_school_id && user.subject;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          pilot_school_id: user.pilot_school_id,
          teacher_profile_setup: user.role === "teacher" ? profileComplete : false,
          mentor_profile_complete: user.role === "mentor" ? profileComplete : false,
          province: user.province,
          district: user.district,
          subject: user.subject,
          phone: user.phone,
          isQuickLogin: false,
          onboarding_completed: user.onboarding_completed,
          show_onboarding: user.show_onboarding !== false,
          holding_classes: user.holding_classes,
          profile_expires_at: user.profile_expires_at
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.pilot_school_id = user.pilot_school_id;
        token.teacher_profile_setup = user.teacher_profile_setup;
        token.mentor_profile_complete = user.mentor_profile_complete;
        token.province = user.province;
        token.subject = user.subject;
        token.phone = user.phone;
        token.isQuickLogin = user.isQuickLogin;
        token.onboarding_completed = user.onboarding_completed;
        token.show_onboarding = user.show_onboarding;
        token.holding_classes = user.holding_classes;
        token.profile_expires_at = user.profile_expires_at;
      }

      // CRITICAL: Always refresh token data from database to prevent stale data
      // This prevents "profile-setup redirect loop" caused by cached null pilot_school_id
      if (!user && token.id) {
        try {
          const userId = parseInt(token.id as string);

          // Query unified users table (no more separate tables!)
          const freshUser = await prisma.users.findUnique({
            where: { id: userId },
            select: {
              role: true,
              pilot_school_id: true,
              subject: true,
              holding_classes: true,
              province: true,
              district: true,
              phone: true,
              onboarding_completed: true,
              show_onboarding: true,
              profile_expires_at: true,
              login_type: true
            }
          });

          if (freshUser) {
            token.role = freshUser.role;
            token.pilot_school_id = freshUser.pilot_school_id;
            token.subject = freshUser.subject;
            token.holding_classes = freshUser.holding_classes;
            token.province = freshUser.province;
            token.district = freshUser.district;
            token.phone = freshUser.phone;
            token.onboarding_completed = freshUser.onboarding_completed;
            token.show_onboarding = freshUser.show_onboarding;
            token.profile_expires_at = freshUser.profile_expires_at;
            // Update isQuickLogin based on login_type
            token.isQuickLogin = freshUser.login_type === 'username';
          }
        } catch (error) {
          console.error('❌ [AUTH] Error refreshing token data:', error);
          // Don't crash auth - just keep existing token data
        }
      }
      
      // Handle session updates (when update() is called)
      if (trigger === "update" && session) {
        try {
          console.log('🔄 [AUTH] Session update triggered');
          const userId = parseInt(token.id as string);

          // Query unified users table (no more separate tables!)
          console.log('🔍 [AUTH] Refreshing user data from unified users table');
          const freshUser = await prisma.users.findUnique({
            where: { id: userId },
            select: {
              role: true,
              pilot_school_id: true,
              subject: true,
              holding_classes: true,
              province: true,
              district: true,
              phone: true,
              onboarding_completed: true,
              show_onboarding: true,
              profile_expires_at: true,
              login_type: true
            }
          });

          if (freshUser) {
            console.log('✅ [AUTH] Fresh user data fetched:', {
              pilot_school_id: freshUser.pilot_school_id,
              subject: freshUser.subject,
              login_type: freshUser.login_type
            });
            token.role = freshUser.role;
            token.pilot_school_id = freshUser.pilot_school_id;
            token.subject = freshUser.subject;
            token.holding_classes = freshUser.holding_classes;
            token.province = freshUser.province;
            token.district = freshUser.district;
            token.phone = freshUser.phone;
            token.onboarding_completed = freshUser.onboarding_completed;
            token.show_onboarding = freshUser.show_onboarding;
            token.profile_expires_at = freshUser.profile_expires_at;
            token.isQuickLogin = freshUser.login_type === 'username';
            console.log('✅ [AUTH] Token updated with pilot_school_id:', token.pilot_school_id);
          } else {
            console.error('❌ [AUTH] User not found for userId:', userId);
          }
        } catch (error) {
          console.error('❌ [AUTH] Error updating session:', error);
          // Don't crash auth - just keep existing token data
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.pilot_school_id = token.pilot_school_id as number | null;
        session.user.teacher_profile_setup = token.teacher_profile_setup as boolean;
        session.user.mentor_profile_complete = token.mentor_profile_complete as boolean;
        session.user.province = token.province as string | null;
        session.user.district = token.district as string | null;
        session.user.subject = token.subject as string | null;
        session.user.phone = token.phone as string | null;
        session.user.isQuickLogin = token.isQuickLogin as boolean;
        session.user.onboarding_completed = token.onboarding_completed;
        session.user.show_onboarding = token.show_onboarding;
        session.user.holding_classes = token.holding_classes;
        session.user.profile_expires_at = token.profile_expires_at;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};