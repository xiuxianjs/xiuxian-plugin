const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/supermarket.css-DmNc_kOv.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
