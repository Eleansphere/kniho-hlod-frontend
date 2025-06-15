import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  exp: number; // Expiration time in seconds
  iat: number; // Issued at time in seconds
  id: string; // User ID or other identifier
  email: string; // User email
};

export function useTokenManager(tokenKey: string = 'auth-token') {
  let logoutTimeout: ReturnType<typeof setTimeout> | null = null;

  function setTokenExpiration(token: string, onExpire: () => void): void {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const expiresInMs = decoded.exp * 1000 - Date.now();

      console.log('Token expires in:', Math.round(expiresInMs / 1000), 'seconds');

      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
      }

      // Pokud token už expiroval nebo expiruje za méně než 5 sekund
      if (expiresInMs <= 5000) {
        console.log('Token already expired or expires very soon, logging out immediately...');
        onExpire();
        return;
      }

      logoutTimeout = setTimeout(() => {
        console.log('Token expired, logging out...');
        onExpire();
      }, expiresInMs);
    } catch (error) {
      console.error('Error setting token expiration:', error);
      onExpire(); // V případě chyby rovnou odhlásíme
    }
  }

  function setToken(token: string): void {
    localStorage.setItem(tokenKey, token);
  }

  function getToken(): string | null {
    return localStorage.getItem(tokenKey);
  }

  function removeToken(): void {
    localStorage.removeItem(tokenKey);
    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
      logoutTimeout = null;
    }
  }

  function isTokenExpired(): boolean {
    const token = getToken();
    if (!token) return true;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const exp = decoded.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  function getTokenData(): DecodedToken | null {
    const token = getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  function clearExpiration(): void {
    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
      logoutTimeout = null;
    }
  }

  return {
    // Actions
    setToken,
    getToken,
    removeToken,
    setTokenExpiration,
    clearExpiration,
    // Getters
    isTokenExpired,
    getTokenData,
  };
}
