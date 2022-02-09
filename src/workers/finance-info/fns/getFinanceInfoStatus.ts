import {getRepository} from "typeorm";
import {FinancialIndicatorStatus} from "@entity/FinancialIndicatorStatus";

export const getFinanceInfoStatus = async (code: string) => {
    const SyncStatusRepo = getRepository(FinancialIndicatorStatus);
    return await SyncStatusRepo.findOne({ where: { code } });
}
