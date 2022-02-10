import {FinancialIndicators} from '@entity/FinancialIndicators';
import {FinancialIndicatorStatus} from '@entity/FinancialIndicatorStatus';
import * as _ from 'lodash';
import {getConnection} from 'typeorm';

export const saveFinanceInfo = async (code: string, data: any) => {
    let syncSuccess: any = 0;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        // establish real database connection using our new query runner
        await queryRunner.connect();

        // lets now open a new transaction:
        await queryRunner.startTransaction();
        const financeInfos = parseFinanceInfoData(
            code,
            data[0],
            data[1]['Chỉ số tài chính'],
        );
        await queryRunner.manager.upsert(FinancialIndicators, financeInfos, [
            'code',
            'periodBegin',
            'periodEnd',
        ]);
        await queryRunner.manager.upsert(
            FinancialIndicatorStatus,
            {
                code,
                termType: financeInfos[0]['termType'],
                year: _.last(financeInfos)['year'],
                quarter: _.last(financeInfos)['quarter'],
            },
            ['code', 'termType'],
        );

        // commit transaction now:
        await queryRunner.commitTransaction();
        console.log(
            `sync success code: ${code} year: ${_.last(financeInfos)['year']}`,
        );
        syncSuccess = {
            success: true,
            lastYear: _.last(financeInfos)['year'],
            lastQuarter: _.last(financeInfos)['quarter'],
        };
    } catch (e) {
        syncSuccess = e;
        console.error(e);
        // since we have errors let's rollback changes we made
        await queryRunner.rollbackTransaction();
    } finally {
        // you need to release query runner which is manually created:
        await queryRunner.release();
    }

    return syncSuccess;
};

const parseFinanceInfoData = (
    code: string,
    timeData: any[],
    financeInfoData: any[],
) => {
    const data: any[] = [];
    timeData.forEach((time, index) => {
        const financeInfoObject = {
            code,
            quarter: time?.ReportTermID == 1 ? null : 1,
            year: time.YearPeriod,
            termType: time.ReportTermID,
            periodBegin: time.PeriodBegin,
            periodEnd: time.PeriodEnd,
            united: time.United,
            auditedStatus: time.AuditedStatus,
            eps: getFinanceInfoFieldValue(financeInfoData, 35, index + 1),
            bvps: getFinanceInfoFieldValue(financeInfoData, 36, index + 1),
            pe: getFinanceInfoFieldValue(financeInfoData, 37, index + 1),
            pb: getFinanceInfoFieldValue(financeInfoData, 38, index + 1),
            grossProfitMargin: getFinanceInfoFieldValue(
                financeInfoData,
                39,
                index + 1,
            ),
            netProfitMargin: getFinanceInfoFieldValue(
                financeInfoData,
                40,
                index + 1,
            ),
            roea: getFinanceInfoFieldValue(financeInfoData, 41, index + 1),
            roaa: getFinanceInfoFieldValue(financeInfoData, 42, index + 1),
            shortTermRatio: getFinanceInfoFieldValue(
                financeInfoData,
                43,
                index + 1,
            ),
            interestCoverage: getFinanceInfoFieldValue(
                financeInfoData,
                44,
                index + 1,
            ),
            liabilitiesToAssets: getFinanceInfoFieldValue(
                financeInfoData,
                45,
                index + 1,
            ),
            debtToEquity: getFinanceInfoFieldValue(
                financeInfoData,
                46,
                index + 1,
            ),
        };

        data.push(financeInfoObject);
    });

    return data;
};

const getFinanceInfoFieldValue = (
    financeInfoData: any[],
    id: number,
    valueIndex: number,
) => {
    const data = _.find(financeInfoData, (value) => value?.ID == id);

    return data &&
        typeof data['Value' + valueIndex] !== 'undefined' &&
        parseFloat(data['Value' + valueIndex]) < 1000000 &&
        parseFloat(data['Value' + valueIndex]) > -100000
        ? data['Value' + valueIndex]
        : null;
};
