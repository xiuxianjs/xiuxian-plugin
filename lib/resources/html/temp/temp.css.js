const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/temp.css-CVi-DdIO.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
