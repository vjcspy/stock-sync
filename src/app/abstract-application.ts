import 'reflect-metadata';

import {createConnection} from 'typeorm';

import {store} from './store';
import {appInitAction} from './store/actions';

export abstract class AbstractApplication {
    static _c = 0;

    constructor() {
        AbstractApplication._c++;
        if (AbstractApplication._c > 1) {
            throw new Error('Must have only one application');
        }
    }

    protected abstract main(): Promise<void>;

    async run(): Promise<void> {
        try {
            await this.__connectDB();
            await this.__configStore();
            await this.main();
        } catch (e) {
            console.log(e);
        }
    }

    protected async __connectDB() {
        return new Promise((resolve, reject) => {
            createConnection()
                .then((connection) => {
                    resolve(connection);
                })
                .catch((e) => reject(e));
        });
    }

    protected async __configStore() {
        store.dispatch(appInitAction());
    }

    protected getStore() {
        return store;
    }
}
