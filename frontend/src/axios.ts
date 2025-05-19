import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:8000/api" });

/**
 * Attach Clerk session token if the user is signed-in.
 * We grab it from the global `window.Clerk` instance because this file
 * lives outside React and can’t use the `useAuth()` hook.
 */
api.interceptors.request.use(async (cfg) => {
  // Cast to `any` to keep the TS compiler happy.
  const clerk: any = (window as any).Clerk;

  if (clerk?.session) {
    const token = await clerk.session.getToken();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});