const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/fairyrealm.css-BelII5Bq.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
