const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/HYWH-65W-5i66PRTv.ttf', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
