export interface User {
    username: string;
    email: string;
    role: "admin" | "editor" | "admin"
    active: boolean; 
}