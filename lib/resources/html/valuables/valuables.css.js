const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/valuables.css-DJhT3EoN.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
