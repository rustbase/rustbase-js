export class QueryBuilder {
    private _query: string;

    constructor() {
        this._query = '';
    }

    get(key: string) {
        this._query = `get ${key}`;

        return this;
    }

    insert(key: string, value: any) {
        this._query = `insert ${JSON.stringify(value)} in ${key}`;

        return this;
    }

    update(key: string, value: any) {
        this._query = `update ${JSON.stringify(value)} in ${key}`;
    }

    delete(key: string) {
        this._query = `delete ${key}`;
    }

    query() {
        return this._query;
    }
}
