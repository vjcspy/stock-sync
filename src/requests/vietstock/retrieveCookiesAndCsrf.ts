import fetch from 'node-fetch';

import { parseCookies } from '../../utils/parseCookies';
import { parse } from 'node-html-parser';

export const loginCookies = async () => {
  try {
    const { cookies, csrf } = await retrieveCookiesAndCsrf();
    const res = await fetch('https://finance.vietstock.vn/Account/Login', {
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
      'body': `__RequestVerificationToken=${csrf}&Email=dinhkhoi.le05%40gmail.com&Password=536723&responseCaptchaLoginPopup=&g-recaptcha-response=&Remember=false&X-Requested-With=XMLHttpRequest`,
      'method': 'POST',
    });
    const cookiesAfterLogin = parseCookies(res);

    return {
      cookies: cookies + '; ' + cookiesAfterLogin,
    };
  } catch (e) {
    console.log('login error');
  }

  return {};
};

export const retrieveCookiesAndCsrf = async (cookiesData?: any, needCookie = true) => {
  try {
    const res = await fetch('https://finance.vietstock.vn/doanh-nghiep-a-z/danh-sach-niem-yet?page=1', {
      'headers': {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'cookie': cookiesData,
        'upgrade-insecure-requests': '1',
        'Referer': 'https://www.google.com/',
        'Referrer-Policy': 'origin',
      },
      'body': null,
      'method': 'GET',
    });
    const text = await res.text();
    const htmlParsed: any = parse(text);
    const input = htmlParsed.querySelector('[name=__RequestVerificationToken]');
    const csrf = input.getAttribute('value');
    let cookies;
    if (needCookie) {
      cookies = parseCookies(res);
    }

    return {
      csrf,
      cookies,
    };
  } catch (e) {
    console.log('error');
  }

  return {};
};
