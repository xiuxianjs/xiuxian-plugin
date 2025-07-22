const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/0-CMSkRIKH.jpg', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
