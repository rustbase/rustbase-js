import { deserialize, serialize } from 'bson';
import net from 'net';

type Response = {
    message: string | null;
    body: any;
    status:
        | 'Ok'
        | 'Error'
        | 'DatabaseNotFound'
        | 'KeyNotExists'
        | 'KeyAlreadyExists'
        | 'SyntaxError'
        | 'InvalidQuery'
        | 'InvalidBody';
};
export class Rustbase {
    private readonly client: net.Socket;

    constructor(host: string, port: number = 23561, callback?: () => void) {
        const client = new net.Socket();

        client.connect(port, host, () => {
            if (callback) {
                callback();
            }
        });

        this.client = client;
    }

    close() {
        this.client.end();
    }

    async request(query: string, database: string) {
        const doc = {
            body: {
                database,
                query,
            },
        };

        const buffer = serialize(doc);

        this.client.write(buffer);

        return new Promise<any>((resolve, reject) => {
            this.client.once('data', (data) => {
                const doc = deserialize(data) as Response;

                if (doc.body) {
                    resolve(doc.body);
                } else {
                    if (doc.status === 'Ok') {
                        resolve(undefined);
                    } else {
                        reject(doc.message ?? doc.status);
                    }
                }
            });

            this.client.once('error', (err) => {
                reject(err);
            });
        });
    }
}
