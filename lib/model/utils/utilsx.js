function parseUnitNumber(input) {
    const str = (input || '')
        .toLowerCase()
        .replace(/[,，\s]/g, '')
        .trim();
    if (!str)
        return 0;
    const match = str.match(/^(\d+)(k|w|e)?$/i);
    if (!match)
        return Number(str) || 0;
    const [, num, unit] = match;
    const n = parseInt(num, 10);
    if (isNaN(n))
        return 0;
    switch (unit) {
        case 'k':
            return n * 1000;
        case 'w':
            return n * 10000;
        case 'e':
            return n * 100000000;
        default:
            return n;
    }
}
const getAvatar = (usr_qq) => {
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${usr_qq}`;
};

export { getAvatar, parseUnitNumber };
