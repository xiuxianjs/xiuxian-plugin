const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/common.css-DhW99vPX.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
