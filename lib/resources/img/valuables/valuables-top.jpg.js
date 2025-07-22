const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/valuables-top-CQoYj4ht.jpg', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
