const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/state-CM0Lg6ag.jpg', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
