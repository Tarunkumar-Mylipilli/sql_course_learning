export interface AuthUser {
  username: string;
  role: 'student' | 'admin';
  authenticatedAt: string;
}

const AUTH_STORAGE_KEY = 'sqlmastery_auth_user_v1';

// Preset credentials - you can edit or add more users directly here in code anytime!
export const VALID_CREDENTIALS = [
  {
    username: 'Tarunkumar',
    password: 'Tarun@1999',
    role: 'admin' as const, // Has access to both Student and Admin portals
  },
];

export function getStoredUser(): AuthUser | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function loginUser(usernameInput: string, passwordInput: string, remember: boolean = true): { success: boolean; user?: AuthUser; error?: string } {
  const cleanUser = (usernameInput || '').trim();
  const cleanPass = (passwordInput || '').trim();

  const match = VALID_CREDENTIALS.find(
    (c) => c.username.toLowerCase() === cleanUser.toLowerCase() && c.password === cleanPass
  );

  if (!match) {
    return { success: false, error: 'Invalid username or password. Please verify credentials.' };
  }

  const user: AuthUser = {
    username: match.username,
    role: match.role,
    authenticatedAt: new Date().toISOString(),
  };

  try {
    const serialized = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }
  } catch (err) {
    console.error('Failed to persist auth session:', err);
  }

  return { success: true, user };
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to logout:', err);
  }
}
