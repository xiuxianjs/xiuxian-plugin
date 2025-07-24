const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/shop.css-B5kQw6Dj.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
