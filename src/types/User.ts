export interface User {
    id: string;
    firstName ?: string;
    lastName: string;
    email: string;
    createdAt ?: Date;
    updatedAt ?: Date;
}

export interface UserUpdateDto{
    firstName ?: string;
    lastName?: string;
    email?: string;
    password?: string;
}