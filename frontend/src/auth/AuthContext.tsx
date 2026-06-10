/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import instance from "../api/axios";
import { AUTH_LOGIN, USERS_ME } from "../api/endpoints";
import { getAccess, setTokens, clear } from "./tokenStorage";
import type { User, AuthTokens } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const loadUser = useCallback(async () => {
    const { data } = await instance.get<User>(USERS_ME);
    setUser(data);
  }, []);

  // Bootstrap: hydrate user from stored token on mount
  useEffect(() => {
    const bootstrap = async () => {
      if (getAccess()) {
        try {
          await loadUser();
        } catch {
          clear();
        }
      }
      setIsBootstrapping(false);
    };
    bootstrap();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await instance.post<AuthTokens>(AUTH_LOGIN, {
        email,
        password,
      });
      setTokens(data.access, data.refresh);
      await loadUser();
    },
    [loadUser],
  );

  const logout = useCallback(() => {
    clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isBootstrapping,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
