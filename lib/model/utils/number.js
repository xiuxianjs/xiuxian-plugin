function convert2integer(amount) {
    const fallback = 1;
    const reg = /^[1-9][0-9]{0,12}$/;
    if (!reg.test(String(amount))) {
        return fallback;
    }
    return Math.floor(Number(amount));
}
function bigNumberTransform(value) {
    if (!Number.isFinite(value)) {
        return '0';
    }
    const units = [
        { limit: 1e16, text: '千万亿', divisor: 1e15 },
        { limit: 1e13, text: '万亿', divisor: 1e12 },
        { limit: 1e12, text: '千亿', divisor: 1e11 },
        { limit: 1e11, text: '亿', divisor: 1e8 },
        { limit: 1e8, text: '千万', divisor: 1e7 },
        { limit: 1e4, text: '万', divisor: 1e4 },
        { limit: 1e3, text: '千', divisor: 1e3 }
    ];
    for (const u of units) {
        if (value >= u.limit) {
            const base = value / u.divisor;
            return (Number.isInteger(base) ? base : base.toFixed(2)) + u.text;
        }
    }
    return String(value);
}
function GetPower(atk, def, hp, bao) {
    return Math.floor((atk + def * 0.8 + hp * 0.6) * (bao + 1));
}
function datachange(data) {
    if (data / 1_000_000_000_000 > 1) {
        return Math.floor((data * 100) / 1_000_000_000_000) / 100 + '万亿';
    }
    else if (data / 100_000_000 > 1) {
        return Math.floor((data * 100) / 100_000_000) / 100 + '亿';
    }
    else if (data / 10_000 > 1) {
        return Math.floor((data * 100) / 10_000) / 100 + '万';
    }
    else {
        return data + '';
    }
}
var number = {
    convert2integer,
    bigNumberTransform,
    GetPower,
    datachange
};
const compulsoryToNumber = (inputValue, initValue = 1) => {
    const iv = +initValue < 1 ? 1 : initValue;
    const value = Number(inputValue);
    const count = isNaN(value) || value < iv ? iv : value;
    return count;
};

export { GetPower, bigNumberTransform, compulsoryToNumber, convert2integer, datachange, number as default };
