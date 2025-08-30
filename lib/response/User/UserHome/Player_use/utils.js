import 'alemonjs';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { convert2integer } from '../../../../model/utils/number.js';
import 'dayjs';
import { foundthing } from '../../../../model/cultivation.js';
import { existNajieThing } from '../../../../model/najie.js';
import { PINJI_MAP } from './types.js';

const parsePinji = (raw) => {
    if (typeof raw !== 'string' || raw === '') {
        return undefined;
    }
    if (raw in PINJI_MAP) {
        return PINJI_MAP[raw];
    }
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
};
const toNumber = (v, def = 0) => (typeof v === 'number' ? v : def);
const thingType = (obj) => (obj && typeof obj === 'object' && 'type' in obj ? obj.type : undefined);
const parseCommand = async (msg, startCode, najie) => {
    const code = msg.split('*').map(s => s.trim());
    let thingName = code[0];
    const maybeIndex = Number(code[0]);
    const quantityRaw = code[1];
    let quantity = convert2integer(quantityRaw);
    if (!quantity || quantity <= 0) {
        quantity = 1;
    }
    if (startCode === '装备' && Number.isInteger(maybeIndex) && maybeIndex > 100) {
        try {
            const target = najie.装备[maybeIndex - 101];
            if (!target) {
                throw new Error('no equip');
            }
            thingName = target.name;
            code[1] = String(target.pinji);
        }
        catch {
            return null;
        }
    }
    const realThingName = thingName.replace(/\d+$/, '');
    const thingExist = await foundthing(realThingName);
    if (!thingExist) {
        return null;
    }
    const thingClass = thingExist.class;
    const pinji = parsePinji(code[1]);
    return {
        thingName,
        quantity,
        pinji,
        realThingName,
        thingExist,
        thingClass: thingClass || '道具'
    };
};
const validateThing = async (userId, thingName, thingClass, pinji, quantity, startCode) => {
    const x = await existNajieThing(userId, thingName, thingClass, pinji);
    if (!x) {
        return false;
    }
    if (x < quantity && startCode !== '装备') {
        return false;
    }
    return true;
};

export { parseCommand, parsePinji, thingType, toNumber, validateThing };
