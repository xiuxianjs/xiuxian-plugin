const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/tw.scss-CYDoroTx.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
