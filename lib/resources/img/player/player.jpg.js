const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/player-DZ9uswo5.jpg', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
