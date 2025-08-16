const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../assets/xiuxian-u2MUmwvW.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
