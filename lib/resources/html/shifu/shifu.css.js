const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/shifu.css-B_BowjzJ.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
