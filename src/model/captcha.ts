import { getIoRedis } from '@alemonjs/db'
import svgCaptcha from 'svg-captcha'
import sharp from 'sharp'
import { keys } from './keys'

export async function generateCaptcha(
  userId: string,
  expiresSec = 60 * 60 * 6
) {
  const captcha = svgCaptcha.create({
    size: 4, // 字符数
    noise: 2, // 干扰线
    color: true,
    background: '#ccddff'
  })
  const redis = getIoRedis()
  // 存储验证码答案
  await redis.set(
    keys.captcha(userId),
    captcha.text.toLowerCase(),
    'EX',
    expiresSec
  )
  return captcha.data // svg 图片内容（SVG字符串）
}

export async function svgToPngBuffer(svgString: string): Promise<Buffer> {
  // sharp 支持 SVG 直接转 PNG
  const buffer = await sharp(Buffer.from(svgString)).png().toBuffer()
  return buffer
}

export async function verifyCaptcha(userId: string, input: string) {
  const redis = getIoRedis()
  const answer = await redis.get(keys.captcha(userId))
  if (!answer) return false
  if ((input || '').trim().toLowerCase() === answer) {
    await redis.del(keys.captcha(userId))
    return true
  }
  return false
}
