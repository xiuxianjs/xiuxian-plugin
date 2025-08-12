const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/najie.scss-CE_jn3Ks.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
