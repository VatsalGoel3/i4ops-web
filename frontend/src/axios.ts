import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:8000/api" });

api.interceptors.request.use(async cfg => {
  const clerk: any = (window as any).Clerk;

  const token =
    clerk?.session
      ? await clerk.session.getToken()
      : await new Promise<string | null>(resolve => {
          let waited = 0;
          const id = setInterval(async () => {
            if (clerk?.session) {
              clearInterval(id);
              resolve(await clerk.session.getToken());
            }
            if ((waited += 100) >= 1000) resolve(null);
          }, 100);
        });

  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});