const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/najie.css-D6G-xE7B.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
