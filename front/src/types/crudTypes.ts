export interface User {
    id?: number;
    email: string;
    username: string;
    password?: string;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkingTime {
    id: number;
    start: Date | string;
    end: Date | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Clock {
    id: number;
    userId: number;
    time: Date;
    status:boolean
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Team {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TeamUser {
    id: number;
    userId: number;
    teamId: number;
    manager : boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Modal {
    isVisible: boolean;
    title: string;
    message: string;
}



export type Role = 'user' | 'manager' | 'admin';
export type AuthMode = 'login' | 'register';