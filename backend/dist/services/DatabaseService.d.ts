import { PoolClient } from 'pg';
export declare class DatabaseService {
    private pool;
    constructor();
    connect(): Promise<void>;
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<PoolClient>;
    close(): Promise<void>;
}
//# sourceMappingURL=DatabaseService.d.ts.map