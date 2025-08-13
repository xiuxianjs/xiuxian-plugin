const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/temp.scss-h2-Fkz32.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
