const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/valuables.scss-DJhT3EoN.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
