import axios from "axios";
import { getToken } from "@clerk/clerk-react";

export const api = axios.create({ baseURL: "http://localhost:8000/api" });

api.interceptors.request.use(async (cfg) => {
    const token = await getToken();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});