export interface User {
    id?: number;
    email: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkingTime {
    id: number;
    start: Date;
    end: Date;
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

export type AuthMode = 'login' | 'register';