const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/player.css-C8Xsayed.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
