const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/HYWH-85W-AP1pa3jw.ttf', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
