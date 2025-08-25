import { getIoRedis } from '@alemonjs/db';
import svgCaptcha from 'svg-captcha';
import sharp from 'sharp';
import { keys } from './keys';

export async function generateCaptcha() {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#ccddff'
  });

  return {
    svg: captcha.data,
    text: captcha.text
  };
}

export async function svgToPngBuffer(svgString: string): Promise<Buffer> {
  // sharp 支持 SVG 直接转 PNG
  const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();

  return buffer;
}

export async function verifyCaptcha(userId: string, input: string) {
  const redis = getIoRedis();
  const answer = await redis.get(keys.captcha(userId));

  if (!answer) { return false; }
  if ((input || '').trim().toLowerCase() === answer) {
    await redis.del(keys.captcha(userId));

    return true;
  }

  return false;
}
