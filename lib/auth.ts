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

        // Quick login with username
        if (credentials.loginType === "quick" && credentials.username) {
          const quickUser = await prisma.quickLoginUser.findUnique({
            where: { username: credentials.username }
          });

          if (!quickUser || !quickUser.is_active) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, quickUser.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: quickUser.id.toString(),
            email: `${quickUser.username}@quick.login`,
            name: quickUser.username,
            role: quickUser.role,
            pilot_school_id: null,
            teacher_profile_setup: false,
            mentor_profile_complete: false,
            province: quickUser.province,
            subject: quickUser.subject,
            isQuickLogin: true,
            onboarding_completed: null,
            show_onboarding: true,
            holding_classes: null
          };
        }

        // Regular login with email
        if (!credentials?.email) {
          throw new Error("Email is required for regular login");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          pilot_school_id: user.pilot_school_id,
          teacher_profile_setup: false,
          mentor_profile_complete: false,
          province: user.province,
          district: user.district,
          subject: user.subject,
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
        token.isQuickLogin = user.isQuickLogin;
        token.onboarding_completed = user.onboarding_completed;
        token.show_onboarding = user.show_onboarding;
        token.holding_classes = user.holding_classes;
        token.profile_expires_at = user.profile_expires_at;
      }
      
      // Handle session updates (when update() is called)
      if (trigger === "update" && session) {
        console.log('🔄 [AUTH] Session update triggered');
        // Fetch fresh user data from database
        const userId = parseInt(token.id as string);
        const freshUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            pilot_school_id: true,
            subject: true,
            holding_classes: true,
            province: true,
            district: true,
            onboarding_completed: true,
            show_onboarding: true,
            profile_expires_at: true
          }
        });

        if (freshUser) {
          console.log('✅ [AUTH] Fresh user data fetched:', { pilot_school_id: freshUser.pilot_school_id, subject: freshUser.subject });
          token.pilot_school_id = freshUser.pilot_school_id;
          token.subject = freshUser.subject;
          token.holding_classes = freshUser.holding_classes;
          token.province = freshUser.province;
          token.district = freshUser.district;
          token.onboarding_completed = freshUser.onboarding_completed;
          token.show_onboarding = freshUser.show_onboarding;
          token.profile_expires_at = freshUser.profile_expires_at;
          console.log('✅ [AUTH] Token updated with pilot_school_id:', token.pilot_school_id);
        } else {
          console.error('❌ [AUTH] Fresh user not found for userId:', userId);
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