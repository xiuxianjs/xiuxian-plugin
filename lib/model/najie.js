import data from './XiuxianData.js';
import { readNajie, Write_najie } from './xiuxian_impl.js';
import * as _ from 'lodash-es';

async function updateBagThing(usr_qq, thing_name, thing_class, thing_pinji, lock) {
    const najie = await readNajie(usr_qq);
    if (!najie)
        return false;
    if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
        for (const i of najie['装备']) {
            if (i.name == thing_name && i.pinji == thing_pinji)
                i.islockd = lock;
        }
    }
    else {
        for (const i of najie[thing_class]) {
            if (i.name == thing_name)
                i.islockd = lock;
        }
    }
    await Write_najie(usr_qq, najie);
    return true;
}
async function existNajieThing(usr_qq, thing_name, thing_class, thing_pinji = 0) {
    const najie = await readNajie(usr_qq);
    if (!najie)
        return false;
    let ifexist;
    if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
        const equipList = Array.isArray(najie.装备) ? najie.装备 : [];
        ifexist = equipList.find(item => item.name == thing_name && item.pinji == thing_pinji);
    }
    else {
        const type = [
            '装备',
            '丹药',
            '道具',
            '功法',
            '草药',
            '材料',
            '仙宠',
            '仙宠口粮'
        ];
        for (const cat of type) {
            const list = najie[cat];
            if (!Array.isArray(list))
                continue;
            ifexist = list.find(item => item.name == thing_name);
            if (ifexist)
                break;
        }
    }
    if (ifexist)
        return ifexist.数量 || 0;
    return false;
}
async function addNajieThing(usr_qq, name, thing_class, x, pinji) {
    if (x == 0)
        return;
    const najie = await readNajie(usr_qq);
    if (!najie)
        return;
    if (thing_class == '装备') {
        if (!pinji && pinji != 0)
            pinji = Math.trunc(Math.random() * 6);
        const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
        if (x > 0) {
            if (typeof name != 'object') {
                const list = [
                    'equipment_list',
                    'timeequipmen_list',
                    'duanzhaowuqi',
                    'duanzhaohuju',
                    'duanzhaobaowu'
                ];
                for (const i of list) {
                    const arr = data[i];
                    if (!Array.isArray(arr))
                        continue;
                    const thing = arr.find(item => item.name == name);
                    if (thing) {
                        const equ = _.cloneDeep(thing);
                        equ.pinji = pinji;
                        if (typeof equ.atk === 'number')
                            equ.atk *= z[pinji];
                        if (typeof equ.def === 'number')
                            equ.def *= z[pinji];
                        if (typeof equ.HP === 'number')
                            equ.HP *= z[pinji];
                        equ.数量 = x;
                        equ.islockd = 0;
                        najie[thing_class].push(equ);
                        await Write_najie(usr_qq, najie);
                        return;
                    }
                }
            }
            else {
                if (!name.pinji)
                    name.pinji = pinji;
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        const fb = najie[thing_class].find(item => item.name == (name.name || name) && item.pinji == pinji);
        if (fb)
            fb.数量 = (fb.数量 || 0) + x;
        najie.装备 = najie.装备.filter(item => (item.数量 || 0) > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    else if (thing_class == '仙宠') {
        if (x > 0) {
            if (typeof name != 'object') {
                let thing = data.xianchon.find((item) => item.name == name);
                if (thing) {
                    thing = _.cloneDeep(thing);
                    const copied = {
                        ...thing,
                        数量: x,
                        islockd: 0,
                        class: thing.class || '仙宠',
                        name: thing.name
                    };
                    najie[thing_class].push(copied);
                    await Write_najie(usr_qq, najie);
                    return;
                }
            }
            else {
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        const fb = najie[thing_class].find(item => item.name == (name.name || name));
        if (fb)
            fb.数量 = (fb.数量 || 0) + x;
        najie.仙宠 = najie.仙宠.filter(item => (item.数量 || 0) > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    const exist = await existNajieThing(usr_qq, name, thing_class);
    if (x > 0 && !exist) {
        let thing;
        const list = [
            'danyao_list',
            'newdanyao_list',
            'timedanyao_list',
            'daoju_list',
            'gongfa_list',
            'timegongfa_list',
            'caoyao_list',
            'xianchonkouliang',
            'duanzhaocailiao'
        ];
        for (const i of list) {
            const arr = data[i];
            if (!Array.isArray(arr))
                continue;
            thing = arr.find(item => item.name == name);
            if (thing) {
                najie[thing_class].push(thing);
                const fb = najie[thing_class].find(item => item.name == name);
                if (fb) {
                    fb.数量 = x;
                    fb.islockd = 0;
                }
                await Write_najie(usr_qq, najie);
                return;
            }
        }
    }
    const fb = najie[thing_class].find(item => item.name == name);
    if (fb)
        fb.数量 = (fb.数量 || 0) + x;
    najie[thing_class] = najie[thing_class].filter(item => (item.数量 || 0) > 0);
    await Write_najie(usr_qq, najie);
}
async function insteadEquipment(usr_qq, equipment_data) {
    await addNajieThing(usr_qq, equipment_data, '装备', -1, equipment_data.pinji);
    const { readEquipment, writeEquipment } = await import('./equipment.js');
    const equipment = await readEquipment(usr_qq);
    if (!equipment)
        return;
    if (equipment_data.type == '武器') {
        await addNajieThing(usr_qq, {
            ...equipment.武器,
            name: equipment.武器.name || '武器',
            class: '装备',
            数量: 1
        }, '装备', 1, equipment.武器.pinji);
        equipment.武器 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '护具') {
        await addNajieThing(usr_qq, {
            ...equipment.护具,
            name: equipment.护具.name || '护具',
            class: '装备',
            数量: 1
        }, '装备', 1, equipment.护具.pinji);
        equipment.护具 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '法宝') {
        await addNajieThing(usr_qq, {
            ...equipment.法宝,
            name: equipment.法宝.name || '法宝',
            class: '装备',
            数量: 1
        }, '装备', 1, equipment.法宝.pinji);
        equipment.法宝 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
}
var najie = {
    updateBagThing,
    existNajieThing,
    addNajieThing,
    insteadEquipment
};

export { addNajieThing, najie as default, existNajieThing, insteadEquipment, updateBagThing };
