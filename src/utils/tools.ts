// get cookie
export const getCookie = (name: string) => {
  const reg = new RegExp(`(^| )${name}(?:=([^;]*))?(;|$)`);
  const val = document.cookie.match(reg);
  return val ? (val[2] ? unescape(val[2]) : '') : '';
};

// set cookie
export const setCookie = (name: string, value: any, expires = 24 * 60, path = '/', domain = null, secure = false) => {
  const expdate = new Date();
  expdate.setMinutes(expdate.getMinutes() + parseInt(String(expires))); // 默认为1天(24*60)
  // eslint-disable-next-line
  const cookietemp = `${window.escape(name)}=${window.escape(value)}${expires ? `; expires=${expdate.toUTCString()}` : ''}; path=${path}${
    domain ? `; domain=${domain}` : ''
  }${secure ? '; secure' : ''}`;
  document.cookie = cookietemp;
};

export const inputDebounce = (fn: (e: React.ChangeEvent<HTMLInputElement>) => void, wait: number) => {
  let timeout: any = null;
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    e.persist && e.persist();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(e);
      timeout = null;
    }, wait);
  };
};

export const getStringLngth = (str: string) => {
  let i, sum;
  sum = 0;
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
      sum = sum + 1;
    } else {
      sum = sum + 2;
    }
  }
  return sum;
};

export const openNewWindow = (htmlString: string) => {
  const reviewWindow: any = window.open();
  reviewWindow.document.body.innerHTML = htmlString;
};

// package localStorage
export const storage = {
  setItem: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
  getItem: (key: string) => {
    const localString = localStorage.getItem(key);
    return localString ? JSON.parse(localString) : '';
  },
  removeItem: (key: string) => localStorage.removeItem(key),
};

export function delUserStorage() {
  storage.removeItem('user_key');
  storage.removeItem('request_token');
  storage.removeItem('front_routers');
  storage.removeItem('menu_tree');
  storage.removeItem('expire_time');
  storage.removeItem('permission_tree');
}
