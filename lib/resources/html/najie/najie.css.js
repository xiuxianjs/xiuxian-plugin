const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/najie.css-D_A2p5RG.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
