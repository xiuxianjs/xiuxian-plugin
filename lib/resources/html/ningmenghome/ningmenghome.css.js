const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/ningmenghome.css-DO1DBXtU.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
