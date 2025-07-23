const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/equipment.css-CVXR6Og4.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
