const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/talent.css-BSaK8nW3.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
