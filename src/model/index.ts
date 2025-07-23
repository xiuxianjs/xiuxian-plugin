export * from './Config'

export * from './shituhelp'
export * from './version'
export * from './help'
export * from './duanzaofu'
export * from './xiuxian'
export * from './pub'
/**
 *
 * @param timeStamp 时间戳
 * @returns
 */
export function getTimeStr(timeStamp: number): string {
  const options = {
    second: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
  return new Intl.DateTimeFormat('zh-CN', options as any).format(timeStamp)
}
