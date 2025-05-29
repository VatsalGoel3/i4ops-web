export interface User {
    username: string;
    email: string;
    role: "viewer" | "editor" | "admin";
    active: boolean;
  }  