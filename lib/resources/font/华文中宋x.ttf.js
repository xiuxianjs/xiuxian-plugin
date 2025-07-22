const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/华文中宋x-D2QOolbt.ttf', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
