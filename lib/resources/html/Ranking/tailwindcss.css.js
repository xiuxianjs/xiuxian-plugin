const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/tw.css-IpAX1DsM.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
