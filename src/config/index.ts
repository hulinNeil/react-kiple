const apiConfig = {
  host: 'http://localhost:3100', // http://localhost:3100
  // host: '', // http://localhost:3100
  proxy: '/web',
};

if (process.env.REACT_APP_ENV === 'dev') {
  // 这里是线上测试版（Here is the beta version）
  apiConfig.host = 'http://localhost:3100';
  apiConfig.proxy = '/web';
} else if (process.env.REACT_APP_ENV === 'production') {
  // 这里是正式版（Here is the production version）
  apiConfig.host = 'http://www.kiple.com';
}

export { apiConfig };

export const languageList = ['ms-MS', 'zh-CN', 'zh-TW', 'en-US'];

export const shortcutMaxLength = 3;

export const defaultPlaceholderImage = 'https://www.gstatic.com/mobilesdk/180130_mobilesdk/images/image_placeholder.png';
