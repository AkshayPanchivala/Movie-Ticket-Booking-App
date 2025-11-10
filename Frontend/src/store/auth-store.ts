import { create } from 'zustand';
import { Profile, User, Session } from '@/lib/types';
import { getUserByEmail, getProfileByEmail, dummySession, dummyProfiles } from '@/data/dummydata';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Auto-login with first user for demo
      const session = dummySession;
      if (session) {
        set({ user: session.user, session });
        await get().fetchProfile();
      }

      set({ initialized: true, loading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const profile = dummyProfiles.find((p) => p.id === user.id);
      set({ profile: profile || null });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  signIn: async (email: string, _password: string) => {
    set({ loading: true });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const profile = getProfileByEmail(email);
      const session: Session = {
        user,
        access_token: 'dummy-token-' + Date.now(),
      };

      set({ user, session, profile: profile || null });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, _password: string, fullName: string) => {
    set({ loading: true });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user (in real app, this would be persisted)
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
      };

      const newProfile: Profile = {
        id: newUser.id,
        email,
        full_name: fullName,
        role: 'user',
        theater_id: null,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const session: Session = {
        user: newUser,
        access_token: 'dummy-token-' + Date.now(),
      };

      // Add to dummy data (note: this will reset on page reload)
      dummyProfiles.push(newProfile);

      set({ user: newUser, session, profile: newProfile });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ user: null, profile: null, session: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
}));
