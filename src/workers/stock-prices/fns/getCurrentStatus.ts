import {StockPriceSyncStatus} from '@entity/StockPriceSyncStatus';
import {getRepository} from 'typeorm';

export const getCurrentStatus = async (code: string) => {
    const SyncStatusRepo = getRepository(StockPriceSyncStatus);
    return await SyncStatusRepo.findOne({where: {code}});
};
