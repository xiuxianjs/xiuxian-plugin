const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/tttgbnumber-BbQ05dtA.ttf', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
