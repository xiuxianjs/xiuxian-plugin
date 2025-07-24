const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/help.css-BsOsJ16K.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
