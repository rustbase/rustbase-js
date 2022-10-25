import { credentials } from '@grpc/grpc-js';
import { deserialize, Document } from 'bson';
import { RustbaseClient, QueryResultType } from '@models/rustbase';

export class Client {
    private _database?: string;
    private readonly client: RustbaseClient;

    constructor(address: string) {
        const client = new RustbaseClient(
            address,
            credentials.createInsecure()
        );

        this.client = client;
    }

    database(name: string) {
        this._database = name;
    }

    async query(query: string) {
        const database = this._database;

        if (!database) {
            throw new Error('No database selected');
        }

        return await new Promise<Document>((resolve, reject) => {
            this.client.query(
                {
                    database,
                    query,
                },
                (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    if (
                        response.resultType === QueryResultType.OK &&
                        response.bson
                    ) {
                        resolve(deserialize(response.bson));
                    } else if (response.resultType !== QueryResultType.OK) {
                        reject(new Error(response.errorMessage));
                    }
                }
            );
        });
    }
}

export function connect(uri: string): Client {
    const url = new URL(uri);

    if (url.protocol !== 'rustbase:') {
        throw new Error('Invalid protocol');
    }

    return new Client(url.host);
}
