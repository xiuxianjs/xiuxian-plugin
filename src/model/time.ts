import dayjs from 'dayjs'
/**
 *
 * @param timeStamp 时间戳
 * @returns
 */
export function getTimeStr(timeStamp: number): string {
  return dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
}
