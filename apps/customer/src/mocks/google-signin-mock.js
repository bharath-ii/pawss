// ─────────────────────────────────────────────────────────────────────────────
// Mock for @react-native-google-signin/google-signin
// Used by Metro in Expo Go where the native RNGoogleSignin module is unavailable.
// The LoginScreen already handles the missing module gracefully via try/catch,
// but the package's top-level code calls TurboModuleRegistry.getEnforcing()
// which crashes before any JS try/catch can intercept it.
// ─────────────────────────────────────────────────────────────────────────────

export const GoogleSignin = {
  configure: () => {},
  hasPlayServices: () => Promise.resolve(true),
  signIn: () => Promise.reject(new Error('Google Sign-In not available in Expo Go')),
  signOut: () => Promise.resolve(),
  revokeAccess: () => Promise.resolve(),
  isSignedIn: () => Promise.resolve(false),
  getCurrentUser: () => null,
  getTokens: () => Promise.reject(new Error('Not available in Expo Go')),
};

export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
};

export const GoogleSigninButton = () => null;
