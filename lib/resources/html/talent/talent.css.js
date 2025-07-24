const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/talent.css-3wg0TE7c.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
