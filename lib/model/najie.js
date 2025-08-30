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
async function addNajieThing(userId, name, thingClass, x, pinji) {
    if (x === 0) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    if (!Array.isArray(najie[thingClass])) {
        najie[thingClass] = [];
    }
    if (thingClass === '装备') {
        if (!pinji && pinji !== 0) {
            pinji = Math.trunc(Math.random() * 6);
        }
        const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
        if (x > 0) {
            if (typeof name !== 'object') {
                const data = [];
                data[0] = await getDataList('Equipment');
                data[1] = await getDataList('TimeEquipment');
                data[2] = await getDataList('Duanzhaowuqi');
                data[3] = await getDataList('Duanzhaohuju');
                data[4] = await getDataList('Duanzhaobaowu');
                data[5] = await getDataList('Xuanwu');
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
                        equ.数量 = x;
                        equ.islockd = 0;
                        najie[thingClass].push(equ);
                        await writeNajie(userId, najie);
                        return;
                    }
                }
            }
            else {
                name.pinji ??= pinji;
                name.数量 = x;
                name.islockd = 0;
                najie[thingClass].push(name);
                await writeNajie(userId, najie);
                return;
            }
        }
        const fb = najie[thingClass].find(item => item.name === (name.name || name) && item.pinji === pinji);
        if (fb) {
            fb.数量 = (fb.数量 || 0) + x;
        }
        najie.装备 = najie.装备.filter(item => (item.数量 || 0) > 0);
        await writeNajie(userId, najie);
        return;
    }
    else if (thingClass === '仙宠') {
        if (x > 0) {
            if (typeof name !== 'object') {
                const data = {
                    xianchon: await getDataList('Xianchon')
                };
                let thing = data.xianchon.find((item) => item.name === name);
                if (thing) {
                    thing = _.cloneDeep(thing);
                    const copied = {
                        ...thing,
                        数量: x,
                        islockd: 0,
                        class: thing.class || '仙宠',
                        name: thing.name
                    };
                    najie[thingClass].push(copied);
                    await writeNajie(userId, najie);
                    return;
                }
            }
            else {
                name.数量 = x;
                name.islockd = 0;
                najie[thingClass].push(name);
                await writeNajie(userId, najie);
                return;
            }
        }
        const fb = najie[thingClass].find(item => item.name === (name.name || name));
        if (fb) {
            fb.数量 = (fb.数量 || 0) + x;
        }
        najie.仙宠 = najie.仙宠.filter(item => (item.数量 || 0) > 0);
        await writeNajie(userId, najie);
        return;
    }
    const exist = await existNajieThing(userId, name, thingClass);
    if (x > 0 && !exist) {
        let thing;
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
        for (const i of data) {
            if (!Array.isArray(i)) {
                continue;
            }
            thing = i.find(item => item.name === name);
            if (thing) {
                najie[thingClass].push(thing);
                const fb = najie[thingClass].find(item => item.name === name);
                if (fb) {
                    fb.数量 = x;
                    fb.islockd = 0;
                }
                await writeNajie(userId, najie);
                return;
            }
        }
    }
    const fb = najie[thingClass].find(item => item.name === name);
    if (fb) {
        fb.数量 = (fb.数量 || 0) + x;
    }
    najie[thingClass] = najie[thingClass].filter(item => (item.数量 || 0) > 0);
    await writeNajie(userId, najie);
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
var najie = {
    updateBagThing,
    existNajieThing,
    addNajieThing,
    insteadEquipment
};

export { addNajieThing, najie as default, existNajieThing, insteadEquipment, updateBagThing };
