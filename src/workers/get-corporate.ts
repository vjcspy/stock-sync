import { VietStockCrds, VietStockCredentialsInterface } from '../requests/vietstock/credentials';
import { retrieveCor } from '../requests/vietstock/corporate';

export const getCorporate = async (vsCreds?: VietStockCredentialsInterface) => {
  if (typeof vsCreds === 'undefined') {
    vsCreds = await VietStockCrds.retrieveCredentials();
  }
  let currentPage = 1;
  const getCor = async (page: any) => {
    try {
      const _data = await retrieveCor(page, vsCreds);
      const _pData = JSON.parse(_data);
      currentPage++;

      return _pData;
    } catch (e) {
      console.log('error', e);
    }
  };

  getCor(currentPage);
};
