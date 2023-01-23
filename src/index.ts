import { Rustbase } from './engine';

export type Permission = 'read' | 'write' | 'read_and_write' | 'admin';

export type ClientConfig = {
    host: string;
    port: number;
    database: string;
    auth?: {
        username?: string;
        password?: string;
    };
    tls?:
        | {
              CAFile?: string;
          }
        | boolean;
};

export type ClientOptions = {
    auth?: {
        username?: string;
        password?: string;
    };
    tls?:
        | {
              CAFile?: string;
          }
        | boolean;
};

export type InsertValueOptions = {
    key: string;
    value: any;
};

export type InsertUserOptions = {
    username: string;
    password: string;
    permission: Permission;
};

export type UpdateValueOptions = InsertValueOptions;
export type UpdateUserOptions = {
    username: string;
    password?: string;
    permission?: Permission;
};

export class Client {
    private _database: string;
    private readonly client: Rustbase;

    constructor(config: ClientConfig) {
        const client = new Rustbase(config);

        this.client = client;
        this._database = config.database;
    }

    database(name: string): Client {
        this._database = name;

        return this;
    }

    getDatabase() {
        return this._database;
    }

    async query(query: string) {
        const database = this._database;

        if (!database) {
            throw new Error('No database selected');
        }

        return await this.client.request(query, database);
    }

    async insert(options: InsertValueOptions) {
        const { key, value } = options;

        const query = `insert ${key} into ${value}`;

        return await this.query(query);
    }

    async insertUser(options: InsertUserOptions) {
        const { username, password, permission } = options;

        const query = `insert user ${username} password="${password}" permission="${permission}"`;

        return await this.query(query);
    }

    async get(key: string) {
        const query = `get ${key}`;

        return await this.query(query);
    }

    async update(options: UpdateValueOptions) {
        const { key, value } = options;

        const query = `update ${key} into ${value}`;

        return await this.query(query);
    }

    async updateUser(options: UpdateUserOptions) {
        const { username, password, permission } = options;

        const passwordQuery = password ? `password="${password}"` : '';
        const permissionsQuery = permission ? `permission="${permission}"` : '';

        const query = `update user ${username} ${passwordQuery} permission="${permissionsQuery}"`;

        return await this.query(query);
    }

    async delete(key: string) {
        const query = `delete ${key}`;

        return await this.query(query);
    }

    async deleteUser(user: string) {
        const query = `delete user ${user}`;

        return await this.query(query);
    }

    async list(database?: string) {
        const query = `list ${database ?? this._database}`;

        return await this.query(query);
    }

    close() {
        this.client.close();
    }
}

export function connect(uri: string, options?: ClientOptions): Client {
    const url = new URL(uri);

    if (url.protocol !== 'rustbase:') {
        throw new Error('Invalid protocol');
    }

    const database = url.pathname.split('/')[1];

    return new Client({
        ...options,
        host: url.hostname,
        port: parseInt(url.port),
        database,
        auth: {
            username: url.username,
            password: url.password,
        },
    });
}
