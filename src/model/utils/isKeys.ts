/**
 *
 * @param value
 * @param keys
 * @returns
 */
export const isKeys = (value: any, keys: string[]): value is string => {
  // 判断对象里是否都存在这些key。
  return !!value && typeof value === 'object' && keys.every(key => key in value);
};
