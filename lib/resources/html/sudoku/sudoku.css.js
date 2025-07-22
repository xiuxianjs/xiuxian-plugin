const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/sudoku.css-dBi9iZ53.css', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
