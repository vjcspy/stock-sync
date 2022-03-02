import {FinancialIndicatorStatus} from '@entity/FinancialIndicatorStatus';
import {getRepository} from 'typeorm';

export const saveErrorFinanceInfoStatus = async (
    code: string,
    termType: number,
    error = '',
) => {
    const repo = getRepository(FinancialIndicatorStatus);
    await repo.upsert(
        {
            code,
            termType,
            error,
        },
        ['code', 'termType'],
    );
};
