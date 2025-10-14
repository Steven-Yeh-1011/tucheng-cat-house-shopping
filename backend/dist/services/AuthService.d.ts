import { DatabaseService } from './DatabaseService';
export interface User {
    id: number;
    email: string;
    password: string;
    role: 'admin' | 'user';
    created_at: Date;
}
export declare class AuthService {
    private db;
    private jwtSecret;
    constructor(databaseService: DatabaseService);
    initializeAdmin(): Promise<void>;
    register(email: string, password: string): Promise<User>;
    login(email: string, password: string): Promise<{
        user: User;
        token: string;
    }>;
    verifyToken(token: string): Promise<any>;
}
//# sourceMappingURL=AuthService.d.ts.map