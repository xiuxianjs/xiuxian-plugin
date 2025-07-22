const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/icon-C0QCcwk3.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
