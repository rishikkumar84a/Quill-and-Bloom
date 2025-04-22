import { createContext, useContext } from "react";

export interface AuthSession {
  user?: { email?: string };
  [key: string]: unknown;
}

export const AuthContext = createContext<AuthSession | null>(null);

// Add this hook for context consumers
export function useAuthSession() {
  return useContext(AuthContext);
}
