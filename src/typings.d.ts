declare module 'dva-loading';
declare module 'qs';
declare module '*.less';

interface Window {
  ga: (command: 'send', hitType: 'event' | 'pageview', fieldsObject: GAFieldsObject | string) => void;
  reloadAuthorized: () => void;
}
