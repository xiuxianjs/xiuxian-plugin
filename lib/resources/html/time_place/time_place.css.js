const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/time_place.css-4G6eKf9a.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
