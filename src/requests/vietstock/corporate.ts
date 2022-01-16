import fetch from 'node-fetch';
import { loginCookies, retrieveCookiesAndCsrf } from './retrieveCookiesAndCsrf';

export const getCorporate = async () => {
  try {
    const _loginCookies = await loginCookies();
    const { cookies, csrf } = await retrieveCookiesAndCsrf(_loginCookies.cookies);
    if (typeof cookies == 'string' && typeof csrf === 'string') {
      const res = await fetch('https://finance.vietstock.vn/data/corporateaz', {
        'headers': {
          'accept': '*/*',
          'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'pragma': 'no-cache',
          'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
          'cookie': cookies,
          'Referer': 'https://finance.vietstock.vn/doanh-nghiep-a-z/danh-sach-niem-yet?page=1',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        'body': `catID=0&industryID=0&page=2&pageSize=50&type=1&code=&businessTypeID=0&orderBy=Code&orderDir=ASC&__RequestVerificationToken=${csrf}`,
        'method': 'POST',
      });
      const text = await res.text();
      const data = JSON.parse(text);
      console.log(data);
    }


  } catch (e) {
    console.log('error');
  }

};
