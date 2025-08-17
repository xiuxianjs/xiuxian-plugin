import { getIoRedis } from '@alemonjs/db';
import svgCaptcha from 'svg-captcha';
import sharp from 'sharp';
import { keys } from './keys.js';

async function generateCaptcha(userId, expiresSec = 60 * 60 * 6) {
    const captcha = svgCaptcha.create({
        size: 4,
        noise: 2,
        color: true,
        background: '#ccddff'
    });
    const redis = getIoRedis();
    await redis.set(keys.captcha(userId), captcha.text.toLowerCase(), 'EX', expiresSec);
    return captcha.data;
}
async function svgToPngBuffer(svgString) {
    const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();
    return buffer;
}
async function verifyCaptcha(userId, input) {
    const redis = getIoRedis();
    const answer = await redis.get(keys.captcha(userId));
    if (!answer)
        return false;
    if ((input || '').trim().toLowerCase() === answer) {
        await redis.del(keys.captcha(userId));
        return true;
    }
    return false;
}

export { generateCaptcha, svgToPngBuffer, verifyCaptcha };
