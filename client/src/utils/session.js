// src/utils/session.js
const TOKEN_KEY = 'access_token';

export const session = {
  set(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  get() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }
};