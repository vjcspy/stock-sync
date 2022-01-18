import fetch from 'node-fetch';
import { loginCookies, retrieveCookiesAndCsrf } from './retrieveCookiesAndCsrf';

const retrieveCor = async (sessionId: string, rvt: string, vtsUsrLg: string, usrTk: string, csrf: string) => {
  const r = await fetch('https://finance.vietstock.vn/data/corporateaz', {
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
      'cookie': `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${rvt}; language=vi-VN; Theme=Light; isShowLogin=true; vts_usr_lg=${vtsUsrLg}; vst_usr_lg_token=${usrTk}`,
      'Referer': 'https://finance.vietstock.vn/doanh-nghiep-a-z/danh-sach-niem-yet?page=1',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    'body': `catID=0&industryID=0&page=2&pageSize=50&type=1&code=&businessTypeID=0&orderBy=Code&orderDir=ASC&__RequestVerificationToken=${csrf}`,
    'method': 'POST',
  });
  const text = await r.text();

  return text;
};

export const getCorporate = async () => {
  try {
    let sid = '1i1225usk5lljrcwny0tmffl';
    let rvt = 'nLE53UKUb9eZX-5Nv3aMQ4jYuOZ-2Y9nvkGXZ0dAM1TYu_7tHQPsDhyrKF87cZu423xFKHggL0kq-ywWhRMEe8ZKpoH7Lc8X2QDQ0YSrfZM1';
    let vtsUsrLg = '3C423246818F0E3528187CCAAC8884C7DC2AC16F9370B0F46310C7C97868240303DA0954B5ABFD2F42DBFAD6F7E849A820ED218753FBE20CFE166B2C0CF57CB3781FC08C58FD42AB62243B08DB47839FD9C85C2C1492899C1E2EAA852FB5384C5967E0EA4C74D4E0A3D959F9FED70743D68F7E7139D3C4B3B60DC6D726AE60D2';
    let usrTk = 'wAoBVyA7RUuS5D/peNITBQ==';
    let csrf = '84e0HL9eS6L8-r28ET34ruJFLjTAeN-KKoxiy2zU7VpPH7ujUsEdl99MyCYDOcVnvou37RSklZ7JBq8wf8f5iTbSOmRKF4TdsLtL7x0JFCEGkqUzMCRJ3Vq4c0qY6B180';

    const afterLogin = await loginCookies();
    const re = new RegExp('(.*)(ASP.NET_SessionId=.*;)(.*)(__RequestVerificationToken=.*;)(.*)(vts_usr_lg=.*;)(.*)(vst_usr_lg_token=.*;)(.*)');
    const r = re.exec(afterLogin.cookies);
    if (r.length === 10) {
      const _getValue = (cValue: string) => {
        return cValue.slice(cValue.indexOf('=') + 1, cValue.length - 1);
      };
      sid = _getValue(r[1]);
      rvt = _getValue(r[4]);
      vtsUsrLg = _getValue(r[6]);
      usrTk = _getValue(r[8]);
    }
    const csrfAfterLogin = await retrieveCookiesAndCsrf(afterLogin.cookies, false);
    csrf = csrfAfterLogin.csrf;
    const t = await retrieveCor(sid, rvt, vtsUsrLg, usrTk, csrf);
    console.log(t);
  } catch (e) {
    console.log('error');
  }

};

