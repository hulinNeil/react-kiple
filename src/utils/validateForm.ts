import intl from 'react-intl-universal';

export const validateMailContent = (rule: any, value: string) => {
  value = value.trim();
  let msg = '';
  if (value === '<p><br></p>') {
    msg = intl.get('mail.tpl.no.content');
  } else {
    const replaces = value.match(/{\d+}/gi);
    const repetitiveKeys: string[] = [];
    replaces &&
      replaces.sort().sort((a, b) => {
        if (a === b && !~repetitiveKeys.indexOf(a)) {
          repetitiveKeys.push(a);
        }
        return 0;
      });
    if (repetitiveKeys.length > 0) {
      msg = intl.get('sms.tpl.error.content', { replace: repetitiveKeys.join('-') });
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

export const validateMailAddressee = (rule: any, value: string) => {
  let msg = '';
  if (!value) {
    msg = intl.get('mail.send.no.to');
  } else {
    value = value.trim();
    const addressList: string[] = value.split(' ');
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    const index = addressList.findIndex((num) => !reg.test(num));
    if (index !== -1) {
      msg = intl.get('mail.send.error.to');
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};
export const validateSmsTel = (rule: any, value: string) => {
  let msg = '';
  if (!value) {
    msg = intl.get('sms.send.no.to');
  } else {
    value = value.trim();
    const addressList: string[] = value.split(' ');
    const reg = /^\d{4,14}$/i;
    const index = addressList.findIndex((num) => !reg.test(num));
    if (index !== -1) {
      msg = intl.get('sms.send.error.to');
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

export const validateTelContent = (rule: any, value: string) => {
  let msg = '';
  console.log('======', value);
  if (value && !/^\d{4,14}$/.test(value)) {
    msg = intl.get('sms.send.error.to');
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

export const validateSMSContent = (rule: any, value: string) => {
  let msg = '';
  if (!value) {
    msg = intl.get('sms.tpl.no.content');
  } else {
    value = value.trim();
    const replaces = value.match(/{\d+}/gi);
    const repetitiveKeys: string[] = [];
    replaces &&
      replaces.sort().sort((a, b) => {
        if (a === b && !~repetitiveKeys.indexOf(a)) {
          repetitiveKeys.push(a);
        }
        return 0;
      });
    if (repetitiveKeys.length > 0) {
      msg = intl.get('sms.tpl.error.content', { replace: repetitiveKeys.join('-') });
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

export const validateVersionContent = (rule: any, value: string) => {
  let msg = '';
  if (value) {
    value = value.trim();
    if (!/^\d+$/gi.test(value)) {
      msg = intl.get('push.error.version');
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};
