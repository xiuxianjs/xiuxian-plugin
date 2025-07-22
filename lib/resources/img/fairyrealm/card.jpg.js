const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/card-lxVqU0I9.jpg', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
