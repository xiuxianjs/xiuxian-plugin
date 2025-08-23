import { baseKey } from '../model/constants.js';
import dayjs from 'dayjs';

const replyCount = {};
const captchaTries = {};
const MAX_CAPTCHA_TRIES = 6;
const MIN_COUNT = 90;
const MAX_COUNT = 120;
function isNight(hour) {
    return hour >= 23 || hour < 7;
}
const op = (userId) => `${baseKey}:op:${userId}:${dayjs().format('YYYYMMDDHH')}`;

export { MAX_CAPTCHA_TRIES, MAX_COUNT, MIN_COUNT, captchaTries, isNight, op, replyCount };
