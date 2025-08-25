import { getIoRedis } from '@alemonjs/db';
import svgCaptcha from 'svg-captcha';
import sharp from 'sharp';
import { keys } from './keys.js';

function generateCaptcha() {
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
async function svgToPngBuffer(svgString) {
    const buffer = await sharp(Buffer.from(svgString)).png().toBuffer();
    return buffer;
}
async function verifyCaptcha(userId, input) {
    const redis = getIoRedis();
    const answer = await redis.get(keys.captcha(userId));
    if (!answer) {
        return false;
    }
    if ((input || '').trim().toLowerCase() === answer) {
        await redis.del(keys.captcha(userId));
        return true;
    }
    return false;
}

export { generateCaptcha, svgToPngBuffer, verifyCaptcha };
