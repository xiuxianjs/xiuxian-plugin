const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/user_state-Be7b0NVr.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
