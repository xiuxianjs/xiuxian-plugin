const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/danfang.css-C4CA_GaK.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
