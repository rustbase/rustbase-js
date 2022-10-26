import { QueryBuilder } from './queryBuilder';
import { Rustbase } from './engine';

export class Client {
    private _database: string;
    private readonly client: Rustbase;

    constructor(address: string, database: string) {
        const client = new Rustbase(address);

        this.client = client;
        this._database = database;
    }

    database(name: string): Client {
        this._database = name;

        return this;
    }

    getDatabase() {
        return this._database;
    }

    async query(query: QueryBuilder | string) {
        const database = this._database;

        if (!database) {
            throw new Error('No database selected');
        }

        if (typeof query === 'string') {
            return await this.client.request(query, database);
        } else {
            return await this.client.request(query.query(), database);
        }
    }

    close() {
        this.client.close();
    }
}

export function connect(uri: string): Client {
    const url = new URL(uri);

    if (url.protocol !== 'rustbase:') {
        throw new Error('Invalid protocol');
    }

    const database = url.pathname.split('/')[1];

    return new Client(url.host, database);
}
