import { getRepository } from 'typeorm';
import { StockPriceSyncStatus } from '@entity/StockPriceSyncStatus';

export const getCurrentStatus = async (code: string) => {
  const SyncStatusRepo = getRepository(StockPriceSyncStatus);
  return await SyncStatusRepo.findOne({ where: { code } });
};
