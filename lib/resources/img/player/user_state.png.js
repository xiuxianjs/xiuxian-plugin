const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/user_state-BW2-sVY5.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
