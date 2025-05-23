import { useUser } from "@clerk/clerk-react";

export function useRole(): "viewer" | "editor" | "admin" {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn || !user) return "viewer";
  return (user.publicMetadata?.role as "viewer" | "editor" | "admin") ?? "viewer";
}