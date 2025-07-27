/**
 * 将带单位的数字字符串转换为具体数值
 * 支持 k(千), w(万), e(亿)，不区分大小写
 * @param input 输入字符串，如 "10k", "5w", "3e", "2000"
 * @returns number
 */
export function parseUnitNumber(input: string): number {
  const str = (input || '')
    .toLowerCase()
    .replace(/[,，\s]/g, '')
    .trim()
  if (!str) return 0
  const match = str.match(/^(\d+)(k|w|e)?$/i)
  if (!match) return Number(str) || 0
  let [, num, unit] = match
  let n = parseInt(num, 10)
  if (isNaN(n)) return 0
  switch (unit) {
    case 'k':
      return n * 1000
    case 'w':
      return n * 10000
    case 'e':
      return n * 100000000
    default:
      return n
  }
}
