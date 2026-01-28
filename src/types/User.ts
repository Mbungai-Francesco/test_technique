export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserUpdateDto{
    name?: string;
    email?: string;
    password?: string;
}