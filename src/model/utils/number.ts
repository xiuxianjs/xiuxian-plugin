/**
 * 校验并转换正整数（原实现为异步，保持兼容仍返回 Promise）
 * 合法范围: 1~13 位非 0 开头数字；非法输入统一返回 1
 */
export function convert2integer(amount: string | number): number {
  const fallback = 1;
  const reg = /^[1-9][0-9]{0,12}$/;

  if (!reg.test(String(amount))) {
    return fallback;
  }

  return Math.floor(Number(amount));
}

/**
 * 大数字格式化（兼容原逻辑的单位区间）
 */
export function bigNumberTransform(value: number): string {
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

/**
 * 计算战力
 */
export function GetPower(atk: number, def: number, hp: number, bao: number): number {
  return Math.floor((atk + def * 0.8 + hp * 0.6) * (bao + 1));
}

/**
 * 简单数值转化（保留旧接口行为）
 */
export function datachange(data: number): string {
  if (data / 1_000_000_000_000 > 1) {
    return Math.floor((data * 100) / 1_000_000_000_000) / 100 + '万亿';
  } else if (data / 100_000_000 > 1) {
    return Math.floor((data * 100) / 100_000_000) / 100 + '亿';
  } else if (data / 10_000 > 1) {
    return Math.floor((data * 100) / 10_000) / 100 + '万';
  } else {
    return data + '';
  }
}

export default {
  convert2integer,
  bigNumberTransform,
  GetPower,
  datachange
};

/**
 *
 * @param value 输入的值
 * @param initValue 初始化值
 * @returns
 */
export const compulsoryToNumber = (inputValue: string | number, initValue = 1) => {
  // iv 至少为1
  const iv = +initValue < 1 ? 1 : initValue;

  const value = Number(inputValue);

  // 当发现小于iv的值时，使用iv替代
  const count = isNaN(value) || value < iv ? iv : value;

  return count;
};
