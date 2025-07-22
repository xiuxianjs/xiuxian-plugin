const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/namelist-wk172hx9.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
