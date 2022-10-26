import { credentials } from '@grpc/grpc-js';
import { deserialize, Document } from 'bson';
import { QueryResultType, RustbaseClient } from '@models/rustbase';

export class Rustbase {
    private readonly client: RustbaseClient;

    constructor(address: string) {
        const client = new RustbaseClient(
            address,
            credentials.createInsecure()
        );

        this.client = client;
    }

    close() {
        this.client.close();
    }

    async request(query: string, database: string) {
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

                    switch (response.resultType) {
                        case QueryResultType.OK:
                            if (response.bson) {
                                resolve(deserialize(response.bson));
                            }
                            break;

                        case QueryResultType.ERROR:
                            reject(new Error(response.errorMessage));
                            break;

                        case QueryResultType.NOT_FOUND:
                            reject(new Error('not.found'));
                            break;

                        default:
                            reject(new Error('unknown.error'));
                            break;
                    }
                }
            );
        });
    }
}
