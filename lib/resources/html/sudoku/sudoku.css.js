const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/sudoku.css-DccUc42F.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
