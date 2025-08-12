const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/player.scss-BTK5wBNU.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
