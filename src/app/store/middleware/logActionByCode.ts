import {financeInfoLog} from '../../../workers/finance-info/fns/financeInfoLog';

const re = new RegExp('(.*)(\\$\\%.*\\$\\%)(.*)', 'i');
export const logActionByCode = (store) => {
    return (next) => {
        return (action) => {
            try {
                const actionTypeRe = re.exec(action.type);
                if (actionTypeRe && actionTypeRe.length === 4) {
                    if (actionTypeRe[2].indexOf('FINANCE_INFO') > -1) {
                        const preState = store.getState();
                        const code =
                            preState?.financeInfo?.msg?.content?.toString();
                        if (code) {
                            financeInfoLog(
                                code,
                                `[ACTION] ${action.type}`,
                                action.payload,
                            );

                            return next(action);
                        }
                    }

                    return next(action);
                } else {
                    return next(action);
                }
            } catch (e) {
                console.error('=>> Error in log middleware', e);
                throw e;
            }
        };
    };
};
