const ACCESS_KEY = "auth_access";
const REFRESH_KEY = "auth_refresh";

export const getAccess = (): string | null => localStorage.getItem(ACCESS_KEY);

export const getRefresh = (): string | null =>
  localStorage.getItem(REFRESH_KEY);

export const setTokens = (access: string, refresh?: string): void => {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh !== undefined) {
    localStorage.setItem(REFRESH_KEY, refresh);
  }
};

export const clear = (): void => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
