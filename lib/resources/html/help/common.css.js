const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/common.css-C04i9jKr.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
