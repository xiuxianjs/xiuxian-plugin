const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/Association-XfF_1KJ2.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
