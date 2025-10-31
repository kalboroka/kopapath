// src/utils/session.js
const TOKEN_KEY = 'AccessToken';

export const session = {
  set(token) {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  },
  get() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  },
  clear() {
    window.sessionStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() {
    return !!window.sessionStorage.getItem(TOKEN_KEY);
  }
};