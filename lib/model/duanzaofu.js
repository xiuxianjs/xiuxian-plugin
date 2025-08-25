import { getIoRedis } from '@alemonjs/db';
import { keys, keysByPath, __PATH } from './keys.js';
import { writePlayer } from './pub.js';
import { safeParse } from './utils/safe.js';
import { getDataList } from './DataList.js';
import { LIB_MAP } from '../types/model.js';
import { readPlayer } from './xiuxian_impl.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function settripod(qq) {
    let tripod1 = [];
    try {
        tripod1 = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    const A = await looktripod(qq);
    if (A != 1) {
        const newtripod = {
            qq: qq,
            煅炉: 0,
            容纳量: 10,
            材料: [],
            数量: [],
            TIME: 0,
            时长: 30000,
            状态: 0,
            预计时长: 0
        };
        tripod1.push(newtripod);
        await writeDuanlu(tripod1);
    }
    const player = await readPlayer(qq);
    if (!player) {
        return '玩家数据获取失败';
    }
    const tianfu = Math.floor(40 * Math.random() + 80);
    player.锻造天赋 = tianfu;
    const a = await readAll('隐藏灵根');
    const newa = Math.floor(Math.random() * a.length);
    const candidate = a[newa];
    const isTalentInfo = (x) => !!x && typeof x === 'object' && 'type' in x && 'name' in x;
    if (isTalentInfo(candidate)) {
        player.隐藏灵根 = candidate;
    }
    await writePlayer(qq, player);
    const B = `获得煅炉，天赋[${player.锻造天赋}],隐藏灵根为[${player.隐藏灵根?.name || '未知'}]`;
    return B;
}
async function looktripod(qq) {
    let tripod = [];
    try {
        tripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (const item of tripod) {
        if (qq == item.qq) {
            return 1;
        }
    }
    return 0;
}
async function readMytripod(qq) {
    let tripod = [];
    try {
        tripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (const item of tripod) {
        if (qq == item.qq) {
            return item;
        }
    }
}
async function readTripod() {
    const redis = getIoRedis();
    const data = await redis.get(keys.duanlu('duanlu'));
    if (!data) {
        return [];
    }
    return safeParse(data, []);
}
async function writeDuanlu(duanlu) {
    await setDataJSONStringifyByKey(keys.duanlu('duanlu'), duanlu);
}
async function jiaozheng(value) {
    let size;
    if (typeof value === 'string') {
        const n = Number(value);
        if (Number.isNaN(n)) {
            return 1;
        }
        size = n;
    }
    else if (typeof value === 'number') {
        size = value;
    }
    else {
        return 1;
    }
    if (Number.isNaN(size) || !Number.isFinite(size)) {
        return Number(1);
    }
    size = Math.trunc(size);
    if (size < 1 || Number.isNaN(size)) {
        return Number(1);
    }
    return Number(size);
}
async function readThat(thing_name, weizhi) {
    const key = LIB_MAP[weizhi];
    const arr = await getDataList(key);
    if (Array.isArray(arr)) {
        for (const item of arr) {
            if (item && typeof item === 'object' && 'name' in item && item.name === thing_name) {
                return item;
            }
        }
    }
    return undefined;
}
async function readAll(weizhi) {
    const key = LIB_MAP[weizhi];
    const arr = await getDataList(key);
    return Array.isArray(arr) ? arr : [];
}
async function getxuanze(shuju, linggentype) {
    let i;
    const shuzu = [1, 2, 3, 4, 5];
    const wuxing = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火'];
    const b = ['金', '木', '土', '水', '火'];
    let a;
    const c = [];
    for (const item in shuzu) {
        if (shuzu[item] == linggentype) {
            for (i = Number(item); i < Number(item) + 5; i++) {
                for (const item1 of shuju) {
                    if (item1 == wuxing[i]) {
                        a = item1;
                        c.push(a);
                    }
                }
            }
        }
    }
    for (const item2 in b) {
        if (b[item2] == a) {
            return [c[0], shuzu[item2]];
        }
    }
    return false;
}
async function mainyuansu(shuju) {
    const B = ['金', '木', '土', '水', '火'];
    for (const item in shuju) {
        if (shuju[item] != 0) {
            return B[item];
        }
    }
}
async function restraint(shuju, main) {
    const newshuzu = [];
    const shuju2 = [];
    const shuzu = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火'];
    for (const item in shuju) {
        if (shuju[item] != 0) {
            newshuzu.push(shuzu[item]);
            shuju2.push(shuju[item]);
        }
    }
    let houzui = '';
    let jiaceng;
    for (const item in shuzu) {
        if ((shuzu[item] == newshuzu[0] && shuzu[Number(item) + 1] == newshuzu[1])
            || (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 1] == newshuzu[0])) {
            houzui = `毁${main}灭灵`;
            jiaceng = 0.5;
            return [houzui, jiaceng];
        }
        if ((shuzu[item] == newshuzu[0] && shuzu[Number(item) + 2] == newshuzu[1])
            || (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 2] == newshuzu[0])) {
            if (main == newshuzu[0]) {
                houzui = `神${main}相生`;
                jiaceng = 0.3;
                return [houzui, jiaceng];
            }
            else if (main == newshuzu[1]) {
                houzui = `供${main}相生`;
                jiaceng = 0.2;
                return [houzui, jiaceng];
            }
        }
    }
    houzui = `地${main}双生`;
    jiaceng = 0.08;
    return [houzui, jiaceng];
}
async function readIt() {
    const redis = getIoRedis();
    const custom = await redis.get(keys.custom('custom'));
    if (!custom) {
        return [];
    }
    const customData = safeParse(custom, []);
    return customData;
}
async function readItTyped() {
    const data = await getDataJSONParseByKey(keys.custom('custom'));
    return (data || []).filter(r => typeof r === 'object' && r);
}
async function alluser() {
    const B = await keysByPath(__PATH.player_path);
    return B;
}

export { alluser, getxuanze, jiaozheng, looktripod, mainyuansu, readAll, readIt, readItTyped, readMytripod, readThat, readTripod, restraint, settripod, writeDuanlu };
