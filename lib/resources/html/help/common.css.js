const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/common.css-I4_6M6zi.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
