const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/extensions-C7xpZSCT.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
