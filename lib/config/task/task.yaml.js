const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/task-AYWBn1EZ.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
