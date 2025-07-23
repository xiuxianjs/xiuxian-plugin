const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/najie.css-Bb3VMJRz.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
