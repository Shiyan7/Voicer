const ACCESS_KEY = 'auth.accessToken';
const REFRESH_KEY = 'auth.refreshToken';

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export const tokenStore = {
  get accessToken() {
    return localStorage.getItem(ACCESS_KEY);
  },

  get refreshToken() {
    return localStorage.getItem(REFRESH_KEY);
  },

  save(tokens: AuthTokens) {
    if (tokens.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    }
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
