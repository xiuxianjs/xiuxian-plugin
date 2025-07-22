const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../assets/help2-O2d-KgXC.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
