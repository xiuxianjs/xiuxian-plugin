import { readNajie, writeNajie } from './xiuxiandata.js';
import * as _ from 'lodash-es';
import { getDataList } from './DataList.js';
import { readEquipment, writeEquipment } from './equipment.js';

function normalizeCount(count) {
    if (typeof count !== 'number' || !Number.isFinite(count)) {
        return 0;
    }
    return Math.trunc(count);
}
async function updateBagThing(userId, thingName, thingClass, thingPinji, lock) {
    const najie = await readNajie(userId);
    if (!najie) {
        return false;
    }
    if (!Array.isArray(najie[thingClass])) {
        najie[thingClass] = [];
    }
    if (thingClass === '装备' && (thingPinji || thingPinji === 0)) {
        for (const i of najie['装备']) {
            if (i.name === thingName && i.pinji === thingPinji) {
                i.islockd = lock;
            }
        }
    }
    else {
        for (const i of najie[thingClass]) {
            if (i.name === thingName) {
                i.islockd = lock;
            }
        }
    }
    await writeNajie(userId, najie);
    return true;
}
async function existNajieThing(userId, thingName, thingClass, thingPinji = 0) {
    const najie = await readNajie(userId);
    if (!najie) {
        return false;
    }
    let ifexist;
    if (thingClass === '装备' && (thingPinji || thingPinji === 0)) {
        const equipList = Array.isArray(najie.装备) ? najie.装备 : [];
        ifexist = equipList.find(item => item.name === thingName && item.pinji === thingPinji);
    }
    else {
        const type = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
        for (const cat of type) {
            const list = najie[cat];
            if (!Array.isArray(list)) {
                continue;
            }
            ifexist = list.find(item => item.name === thingName);
            if (ifexist) {
                break;
            }
        }
    }
    if (ifexist) {
        return ifexist.数量 ?? 0;
    }
    return false;
}
async function addNajieThing(userId, name, category, count, pinji) {
    count = normalizeCount(count);
    if (count === 0) {
        return;
    }
    if (typeof name === 'object') {
        const najie = await readNajie(userId);
        if (!najie) {
            return;
        }
        let existItem;
        if (category === '装备') {
            const eqPinji = name.pinji ?? pinji ?? 0;
            existItem = najie[category].find(item => item.name === name.name && item.pinji === eqPinji);
        }
        else {
            existItem = najie[category].find(item => item.name === name.name);
        }
        if (existItem) {
            existItem.数量 = normalizeCount((existItem.数量 ?? 0) + count);
            if (existItem.数量 < 0) {
                existItem.数量 = 0;
            }
        }
        else {
            const obj = { ...name };
            obj.数量 = count;
            obj.islockd = 0;
            if (category === '装备') {
                obj.pinji = name.pinji ?? pinji ?? Math.floor(Math.random() * 7);
            }
            najie[category].push(obj);
        }
        najie[category] = najie[category].filter(item => (item.数量 ?? 0) > 0);
        await writeNajie(userId, najie);
        return;
    }
    await batchAddNajieThings(userId, [
        {
            name: name,
            count: count,
            category: category,
            pinji
        }
    ]);
}
async function insteadEquipment(usrId, equipmentData) {
    await addNajieThing(usrId, equipmentData, '装备', -1, equipmentData.pinji);
    const equipment = await readEquipment(usrId);
    if (!equipment) {
        return;
    }
    if (equipmentData.type === '武器') {
        await addNajieThing(usrId, {
            ...equipment.武器,
            name: equipment.武器.name ?? '武器',
            class: '装备',
            数量: 1,
            出售价: equipment.武器.出售价 || 0
        }, '装备', 1, equipment.武器.pinji);
        equipment.武器 = equipmentData;
        await writeEquipment(usrId, equipment);
        return;
    }
    if (equipmentData.type === '护具') {
        await addNajieThing(usrId, {
            ...equipment.护具,
            name: equipment.护具.name ?? '护具',
            class: '装备',
            数量: 1,
            出售价: equipment.护具.出售价 || 0
        }, '装备', 1, equipment.护具.pinji);
        equipment.护具 = equipmentData;
        await writeEquipment(usrId, equipment);
        return;
    }
    if (equipmentData.type === '法宝') {
        await addNajieThing(usrId, {
            ...equipment.法宝,
            name: equipment.法宝.name ?? '法宝',
            class: '装备',
            数量: 1,
            出售价: equipment.法宝.出售价 || 0
        }, '装备', 1, equipment.法宝.pinji);
        equipment.法宝 = equipmentData;
        await writeEquipment(usrId, equipment);
    }
}
async function batchAddNajieThings(userId, items) {
    if (!items || items.length === 0) {
        return [];
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return [];
    }
    const successfulItems = [];
    const categoryGroups = new Map();
    for (const item of items) {
        const normalized = normalizeCount(item.count);
        if (normalized === 0) {
            continue;
        }
        if (!categoryGroups.has(item.category)) {
            categoryGroups.set(item.category, []);
        }
        categoryGroups.get(item.category).push({
            name: item.name,
            count: normalized,
            pinji: item.pinji
        });
    }
    const data = [];
    data[0] = await getDataList('Danyao');
    data[1] = await getDataList('NewDanyao');
    data[2] = await getDataList('TimeDanyao');
    data[3] = await getDataList('Daoju');
    data[4] = await getDataList('Gongfa');
    data[5] = await getDataList('TimeGongfa');
    data[6] = await getDataList('Caoyao');
    data[7] = await getDataList('Xianchonkouliang');
    data[8] = await getDataList('Duanzhaocailiao');
    const equipmentData = [];
    equipmentData[0] = await getDataList('Equipment');
    equipmentData[1] = await getDataList('TimeEquipment');
    equipmentData[2] = await getDataList('Duanzhaowuqi');
    equipmentData[3] = await getDataList('Duanzhaohuju');
    equipmentData[4] = await getDataList('Duanzhaobaowu');
    equipmentData[5] = await getDataList('Xuanwu');
    const xianchonData = await getDataList('Xianchon');
    for (const [category, categoryItems] of categoryGroups) {
        if (!Array.isArray(najie[category])) {
            najie[category] = [];
        }
        for (const item of categoryItems) {
            const { name, count, pinji } = item;
            let success = false;
            if (category === '装备') {
                success = processEquipmentItem(equipmentData, najie, name, count, pinji);
            }
            else if (category === '仙宠') {
                success = processPetItem(xianchonData, najie, name, count);
            }
            else {
                success = processNormalItem(data, najie, name, count, category);
            }
            if (success) {
                successfulItems.push({
                    name,
                    count,
                    category,
                    pinji
                });
            }
        }
    }
    for (const category of Object.keys(najie)) {
        if (Array.isArray(najie[category])) {
            najie[category] = najie[category].filter((item) => (item.数量 ?? 0) > 0);
        }
    }
    await writeNajie(userId, najie);
    return successfulItems;
}
function processEquipmentItem(data, najie, name, count, pinji) {
    count = normalizeCount(count);
    if (!pinji && pinji !== 0) {
        pinji = Math.trunc(Math.random() * 6);
    }
    const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
    const existing = najie.装备.find(item => item.name === name && item.pinji === pinji);
    if (existing) {
        existing.数量 = Math.max(0, normalizeCount((existing.数量 ?? 0) + count));
        return true;
    }
    else if (count > 0) {
        for (const i of data) {
            if (!Array.isArray(i)) {
                continue;
            }
            const thing = i.find(item => item.name === name);
            if (thing) {
                const equ = _.cloneDeep(thing);
                equ.pinji = pinji;
                if (typeof equ.atk === 'number') {
                    equ.atk *= z[pinji];
                }
                if (typeof equ.def === 'number') {
                    equ.def *= z[pinji];
                }
                if (typeof equ.HP === 'number') {
                    equ.HP *= z[pinji];
                }
                equ.数量 = count;
                equ.islockd = 0;
                najie.装备.push(equ);
                return true;
            }
        }
    }
    return false;
}
function processPetItem(xianchonData, najie, name, count) {
    count = normalizeCount(count);
    const existing = najie.仙宠.find(item => item.name === name);
    if (existing) {
        existing.数量 = normalizeCount((existing.数量 ?? 0) + count);
        return true;
    }
    else if (count > 0) {
        const thing = xianchonData.find((item) => item.name === name);
        if (thing) {
            const copied = _.cloneDeep(thing);
            const petItem = {
                ...copied,
                数量: count,
                islockd: 0,
                class: copied.class ?? '仙宠',
                name: copied.name
            };
            najie.仙宠.push(petItem);
            return true;
        }
    }
    return false;
}
function processNormalItem(data, najie, name, count, category) {
    count = normalizeCount(count);
    const existing = najie[category].find(item => item.name === name);
    if (existing) {
        existing.数量 = normalizeCount((existing.数量 ?? 0) + count);
        return true;
    }
    else if (count > 0) {
        for (const i of data) {
            if (!Array.isArray(i)) {
                continue;
            }
            const thing = i.find(item => item.name === name);
            if (thing) {
                const newItem = { ...thing };
                newItem.数量 = count;
                newItem.islockd = 0;
                najie[category].push(newItem);
                return true;
            }
        }
    }
    return false;
}
var najie = {
    updateBagThing,
    existNajieThing,
    addNajieThing,
    insteadEquipment,
    batchAddNajieThings
};

export { addNajieThing, batchAddNajieThings, najie as default, existNajieThing, insteadEquipment, updateBagThing };
