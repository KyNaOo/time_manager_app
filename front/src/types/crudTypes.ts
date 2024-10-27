
export interface User {
    id?: number;
    email: string;
    username: string;
    password: string;
    confirmPassword?: string;
    role: Role;
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
    id?: number;
    title: string;
    is_team_leader: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TeamMember {
    id?: number;
    user_id?: number;
    teamId?: number;
    is_team_leader: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Modal {
    isVisible: boolean;
    title: string;
    message: string;
}




interface filterBy {
    day: string,
    week: string,
    month: string,
    year: string,
}
export type Filter = keyof filterBy;
export type Role = 'user' | 'manager' | 'admin';
export type AuthMode = 'login' | 'register';