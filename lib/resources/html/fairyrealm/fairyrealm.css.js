const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/fairyrealm.css-BiJSkghZ.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
