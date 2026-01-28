import type { User } from ".";

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    lastName : string;
    firstName ?: string;
    email : string;
    password : string;
}

export interface AuthResponse {
    token: string;
    user: User;
}