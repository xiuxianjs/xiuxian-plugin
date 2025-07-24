const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/updateRecord.css-Ddj1Sd_E.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
