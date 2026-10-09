import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string | null;
}

export const SESSION_QUERY_KEY = ["auth", "me"] as const;

async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await apiGet<User>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function useSession() {
  return useQuery({ queryKey: SESSION_QUERY_KEY, queryFn: fetchCurrentUser, retry: false, staleTime: 60_000 });
}

export async function beginSession(sessionId: string) {
  const user = await apiPost<User>("/auth/session", { session_id: sessionId });
  queryClient.setQueryData(SESSION_QUERY_KEY, user);
  return user;
}

export async function endSession() {
  await apiPost<undefined>("/auth/logout");
  await queryClient.cancelQueries();
  queryClient.clear();
}

export function startGoogleSignIn() {
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const redirectUrl = window.location.origin + "/";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}
