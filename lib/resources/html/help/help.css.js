const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/help.css-D4B4vNGt.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
