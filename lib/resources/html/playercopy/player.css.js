const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/player.css-B3RlaxJ2.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
