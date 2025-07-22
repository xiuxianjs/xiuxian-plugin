const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/ningmenghome.css-C35blTQc.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
