import {logfile} from '@util/logfile';

export const financeInfoLog = (code: string, msg: string, ...meta: any[]) => {
    logfile(`finance-info/${code}`, msg, meta);
};
