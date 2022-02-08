import {AbstractApplication} from "@app/abstract-application";
import './store';

class SyncYearWorker extends AbstractApplication {
    protected main(): Promise<void> {
        return Promise.resolve(undefined);
    }

}

const worker = new SyncYearWorker();
worker.run();
