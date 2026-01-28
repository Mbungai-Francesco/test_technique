export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateDto{
    name: string;
    email: string;
    password: string;
}