import {FinancialIndicatorStatus} from '@entity/FinancialIndicatorStatus';
import {getRepository} from 'typeorm';

export const getFinanceInfoStatus = async (code: string) => {
    const SyncStatusRepo = getRepository(FinancialIndicatorStatus);
    return await SyncStatusRepo.findOne({where: {code}});
};
