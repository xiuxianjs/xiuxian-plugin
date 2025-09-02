import { readNajie, writeNajie } from './xiuxiandata.js';
import * as _ from 'lodash-es';
import { getDataList } from './DataList.js';
import { readEquipment, writeEquipment } from './equipment.js';

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
        return ifexist.数量 || 0;
    }
    return false;
}
async function addNajieThing(userId, name, category, count, pinji) {
    if (count === 0) {
        return;
    }
    if (typeof name === 'object') {
        const najie = await readNajie(userId);
        if (!najie) {
            return;
        }
        const obj = { ...name };
        obj.数量 = count;
        obj.islockd = 0;
        if (category === '装备') {
            if (!pinji && pinji !== 0) {
                pinji = Math.trunc(Math.random() * 6);
            }
            obj.pinji = name?.pinji ?? pinji;
        }
        najie[category].push(obj);
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
            数量: 1
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
            数量: 1
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
            数量: 1
        }, '装备', 1, equipment.法宝.pinji);
        equipment.法宝 = equipmentData;
        await writeEquipment(usrId, equipment);
    }
}
async function batchAddNajieThings(userId, items) {
    if (!items || items.length === 0) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const categoryGroups = new Map();
    for (const item of items) {
        if (item.count === 0) {
            continue;
        }
        if (!categoryGroups.has(item.category)) {
            categoryGroups.set(item.category, []);
        }
        categoryGroups.get(item.category).push({
            name: item.name,
            count: item.count,
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
            if (category === '装备') {
                processEquipmentItem(equipmentData, najie, name, count, pinji);
            }
            else if (category === '仙宠') {
                processPetItem(xianchonData, najie, name, count);
            }
            else {
                processNormalItem(data, najie, name, count, category);
            }
        }
    }
    for (const category of Object.keys(najie)) {
        if (Array.isArray(najie[category])) {
            najie[category] = najie[category].filter((item) => (item.数量 || 0) > 0);
        }
    }
    await writeNajie(userId, najie);
}
function processEquipmentItem(data, najie, name, count, pinji) {
    if (!pinji && pinji !== 0) {
        pinji = Math.trunc(Math.random() * 6);
    }
    const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
    if (count > 0) {
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
                return;
            }
        }
    }
    const existing = najie.装备.find(item => item.name === name && item.pinji === pinji);
    if (existing) {
        existing.数量 = (existing.数量 ?? 0) + count;
    }
}
function processPetItem(xianchonData, najie, name, count) {
    if (count > 0) {
        const thing = xianchonData.find((item) => item.name === name);
        if (thing) {
            const copied = _.cloneDeep(thing);
            const petItem = {
                ...copied,
                数量: count,
                islockd: 0,
                class: copied.class || '仙宠',
                name: copied.name
            };
            najie.仙宠.push(petItem);
            return;
        }
    }
    const existing = najie.仙宠.find(item => item.name === name);
    if (existing) {
        existing.数量 = (existing.数量 ?? 0) + count;
    }
}
function processNormalItem(data, najie, name, count, category) {
    if (count > 0) {
        const existing = najie[category].find(item => item.name === name);
        if (!existing) {
            for (const i of data) {
                if (!Array.isArray(i)) {
                    continue;
                }
                const thing = i.find(item => item.name === name);
                if (thing) {
                    najie[category].push(thing);
                    const fb = najie[category].find(item => item.name === name);
                    if (fb) {
                        fb.数量 = count;
                        fb.islockd = 0;
                    }
                    return;
                }
            }
        }
    }
    const existing = najie[category].find(item => item.name === name);
    if (existing) {
        existing.数量 = (existing.数量 ?? 0) + count;
    }
}
var najie = {
    updateBagThing,
    existNajieThing,
    addNajieThing,
    insteadEquipment
};

export { addNajieThing, batchAddNajieThings, najie as default, existNajieThing, insteadEquipment, updateBagThing };
