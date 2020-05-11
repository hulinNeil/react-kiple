import intl from 'react-intl-universal';

// ant design form validate

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
  value = value ? value.trim() : '';
  if (!value) {
    msg = intl.get('mail.send.no.to');
  } else {
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
  value = value ? value.trim() : '';
  if (!value) {
    msg = intl.get('sms.send.no.to');
  } else {
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
  if (value && !/^\d{4,14}$/.test(value)) {
    msg = intl.get('sms.send.error.to');
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

export const validateSMSContent = (rule: any, value: string) => {
  let msg = '';
  value = value ? value.trim() : '';
  if (!value) {
    msg = intl.get('sms.tpl.no.content');
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

export const validateAppName = (rule: any, value: string) => {
  let msg = '';
  if (value && value.trim().length > 20) {
    msg = intl.get('push.len.max', { length: 20 });
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

// use: validatePushContentLength.bind(null,20)
export const validatePushContentLength = (...args: any[]) => {
  let msg = '';
  const value = args[2] ? args[2].trim() : '';
  if (!value) {
    msg = intl.get('push.len.empty');
  } else {
    if (value.length > args[0]) {
      msg = intl.get('push.len.max', { length: args[0] });
    }
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};

// use: validateEmptyContent.bind(null,'xxxxx')
export const validateEmptyContent = (...args: any[]) => {
  let msg = '';
  const value = args[2] ? args[2].trim() : '';
  if (!value) {
    msg = args[0];
  }
  return msg ? Promise.reject(msg) : Promise.reject();
};
