import { create } from 'zustand';
import { UserProfile, AuthSession } from '../types';
import { storageService } from '../services/storageService';
import { RegistrationFormData, hashPassword, validateRegistrationForm } from '../utils/validation';

interface RegisteredUserRecord extends UserProfile {
  passwordHash: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // Actions
  initializeSession: () => Promise<boolean>;
  register: (data: RegistrationFormData) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarUrl: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  initializeSession: async () => {
    set({ isLoading: true, authError: null });
    try {
      const session = await storageService.getActiveSession();
      if (session && session.user) {
        set({ user: session.user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  register: async (formData: RegistrationFormData) => {
    set({ isLoading: true, authError: null });

    // Validate fields
    const errors = validateRegistrationForm(formData);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      set({ isLoading: false, authError: firstError });
      return { success: false, error: firstError };
    }

    try {
      const existingUsersRaw = await storageService.getRegisteredUsers();
      const existingUsers = existingUsersRaw as RegisteredUserRecord[];

      // Check if email already registered
      const userExists = existingUsers.some(
        u => u.email.toLowerCase() === formData.email.trim().toLowerCase()
      );

      if (userExists) {
        const errorMsg = 'An account with this email address already exists.';
        set({ isLoading: false, authError: errorMsg });
        return { success: false, error: errorMsg };
      }

      const passwordHash = hashPassword(formData.password);

      const newUserRecord: RegisteredUserRecord = {
        id: `usr_${Date.now()}`,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        gender: formData.gender as any,
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        securityScore: 95,
        passwordHash,
      };

      // Save user to storage
      await storageService.saveUser(newUserRecord);

      // Create session & auto-login
      const session: AuthSession = {
        user: {
          id: newUserRecord.id,
          fullName: newUserRecord.fullName,
          email: newUserRecord.email,
          gender: newUserRecord.gender,
          mobileNumber: newUserRecord.mobileNumber,
          address: newUserRecord.address,
          city: newUserRecord.city,
          avatarUrl: newUserRecord.avatarUrl,
          createdAt: newUserRecord.createdAt,
          securityScore: newUserRecord.securityScore,
        },
        token: `jwt_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTimestamp: Date.now(),
      };

      await storageService.setActiveSession(session);

      set({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration failure:', error);
      const errorMsg = 'Failed to register account. Please try again.';
      set({ isLoading: false, authError: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true, authError: null });

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass) {
      const msg = 'Please enter both Email and Password.';
      set({ isLoading: false, authError: msg });
      return { success: false, error: msg };
    }

    try {
      const registeredUsers = (await storageService.getRegisteredUsers()) as RegisteredUserRecord[];
      const userMatch = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);

      if (!userMatch) {
        const msg = 'No account found with this email. Please register first.';
        set({ isLoading: false, authError: msg });
        return { success: false, error: msg };
      }

      // Compare password hash
      const inputHash = hashPassword(pass);
      if (userMatch.passwordHash !== inputHash) {
        const msg = 'Invalid password credentials.';
        set({ isLoading: false, authError: msg });
        return { success: false, error: msg };
      }

      // Valid session
      const userProfile: UserProfile = {
        id: userMatch.id,
        fullName: userMatch.fullName,
        email: userMatch.email,
        gender: userMatch.gender,
        mobileNumber: userMatch.mobileNumber,
        address: userMatch.address,
        city: userMatch.city,
        avatarUrl: userMatch.avatarUrl,
        createdAt: userMatch.createdAt,
        securityScore: userMatch.securityScore,
      };

      const session: AuthSession = {
        user: userProfile,
        token: `jwt_sim_${Date.now()}`,
        loginTimestamp: Date.now(),
      };

      await storageService.setActiveSession(session);

      set({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const msg = 'Login failed due to storage error.';
      set({ isLoading: false, authError: msg });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await storageService.clearSession();
    set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
  },

  updateProfile: async (updatedData: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (!currentUser) return { success: false, error: 'User not logged in' };

    try {
      const newProfile: UserProfile = {
        ...currentUser,
        ...updatedData,
      };

      // Update active session
      const session = await storageService.getActiveSession();
      if (session) {
        session.user = newProfile;
        await storageService.setActiveSession(session);
      }

      // Update registered users array in storage
      const registeredUsers = (await storageService.getRegisteredUsers()) as RegisteredUserRecord[];
      const userIndex = registeredUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          ...updatedData,
        };
        await storageService.saveUser(registeredUsers[userIndex]);
      }

      set({ user: newProfile });
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to save updated profile info.' };
    }
  },

  updateAvatar: async (avatarUrl: string) => {
    const res = await get().updateProfile({ avatarUrl });
    return res.success;
  },
}));
