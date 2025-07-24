const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/gongfa.css-Cd4lA-s8.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
