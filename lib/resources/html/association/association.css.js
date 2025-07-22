const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/association.css-C_r6C2Wr.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
