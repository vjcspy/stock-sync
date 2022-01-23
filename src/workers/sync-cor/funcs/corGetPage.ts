import { VietStockCrds, VietStockCredentialsInterface } from '@requests/vietstock/credentials';
import { retrieveCor } from '@requests/vietstock/corporate';
import { getRepository } from 'typeorm';
import { Cor } from '@entity/Cor';

export const corGetPageFn = async (page: number, vsCreds?: VietStockCredentialsInterface) => {
  if (typeof vsCreds === 'undefined') {
    vsCreds = await VietStockCrds.retrieveCredentials();
  }
  try {
    const _data = await retrieveCor(page, vsCreds);
    const _aData = JSON.parse(_data);
    if (Array.isArray(_aData) && _aData.length > 0) {
      const values = [];
      for (let i = 0; i < _aData.length; i++) {
        values.push(Cor.convertToCorObject(_aData[i]));
      }
      const corRepo = getRepository(Cor);

      const _res = await corRepo.upsert(values, ['code']);

      return {
        affectedRows: _res?.raw?.affectedRows,
        numOfRecords: _aData.length,
      };
    }
    return null;
  } catch (e) {
    console.log('error', e);

    return null;
  }
};
