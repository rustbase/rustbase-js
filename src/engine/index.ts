import { deserialize, serialize } from 'bson';
import net from 'net';
import tls from 'node:tls';
import { ClientConfig } from '..';

export type Response = {
    message: string | null;
    body: any;
    status:
        | 'Ok'
        | 'Error'
        | 'NotFound'
        | 'AlreadyExists'
        | 'SyntaxError'
        | 'InvalidQuery'
        | 'InvalidBody'
        | 'InvalidBson'
        | 'InvalidAuth'
        | 'NotAuthorized'
        | 'Reserved';
};

export class Rustbase {
    private readonly client: net.Socket | tls.TLSSocket;

    constructor(config: ClientConfig, callback?: () => void) {
        if (!config.tls) {
            const client = new net.Socket();

            client.connect(config.port, config.host, () => {
                if (callback) {
                    callback();
                }
            });

            this.client = client;
        } else {
            const client = tls.connect(
                {
                    host: config.host,
                    port: config.port,
                    ca:
                        typeof config.tls === 'object'
                            ? config.tls.CAFile
                            : undefined,
                },
                () => {
                    if (callback) {
                        callback();
                    }
                }
            );

            this.client = client;
        }
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

                if (doc.status === 'Ok') {
                    resolve(doc.body);
                } else {
                    reject(doc.message ?? doc.status);
                }
            });

            this.client.once('error', (err) => {
                reject(err);
            });
        });
    }
}
