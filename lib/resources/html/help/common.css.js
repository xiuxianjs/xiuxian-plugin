const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/common.css-DT0Sn9Dg.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
