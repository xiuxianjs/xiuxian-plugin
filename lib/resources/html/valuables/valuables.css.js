const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/valuables.css-B1K7otBs.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
