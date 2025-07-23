const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/help.css-Djt9fG72.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
