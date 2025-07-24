const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/tuzhi.css-ClCZ_uRU.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
