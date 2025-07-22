import fs from 'fs';
import path from 'path';
import { __PATH, Write_player } from './xiuxian.js';
import data from './XiuxianData.js';

async function settripod(qq) {
    let tripod1;
    try {
        tripod1 = await Read_tripod();
    }
    catch {
        await Write_duanlu([]);
        tripod1 = await Read_tripod();
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
        await Write_duanlu(tripod1);
    }
    const player = await data.getData('player', qq);
    const tianfu = Math.floor(40 * Math.random() + 80);
    player.锻造天赋 = tianfu;
    const a = await read_all('隐藏灵根');
    const newa = Math.floor(Math.random() * a.length);
    player.隐藏灵根 = a[newa];
    await Write_player(qq, player);
    const B = `获得煅炉，天赋[${player.锻造天赋}],隐藏灵根为[${player.隐藏灵根.name}]`;
    return B;
}
async function looktripod(qq) {
    let tripod;
    try {
        tripod = await Read_tripod();
    }
    catch {
        await Write_duanlu([]);
        tripod = await Read_tripod();
    }
    for (const item of tripod) {
        if (qq == item.qq) {
            return 1;
        }
    }
    return 0;
}
async function Read_mytripod(qq) {
    let tripod;
    try {
        tripod = await Read_tripod();
    }
    catch {
        await Write_duanlu([]);
        tripod = await Read_tripod();
    }
    for (const item of tripod) {
        if (qq == item.qq) {
            return item;
        }
    }
}
async function Read_tripod() {
    const dir = path.join(`${__PATH.duanlu}/duanlu.json`);
    let duanlu = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(duanlu);
    return data;
}
async function Write_duanlu(duanlu) {
    const dir = path.join(__PATH.duanlu, `duanlu.json`);
    const new_ARR = JSON.stringify(duanlu, () => { }, '\t');
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function jiaozheng(value) {
    let size = value;
    if (isNaN(parseFloat(size)) && !isFinite(size)) {
        return Number(1);
    }
    size = Number(Math.trunc(size));
    if (size == null || size == undefined || size < 1 || isNaN(size)) {
        return Number(1);
    }
    return Number(size);
}
async function read_that(thing_name, weizhi) {
    const dir = path.join(`${__PATH.lib_path}/${weizhi}.json`);
    const weizhi1 = fs.readFileSync(dir, 'utf8');
    const weizh = JSON.parse(weizhi1);
    for (const item of weizh) {
        if (item.name == thing_name) {
            return item;
        }
    }
    return;
}
async function read_all(weizhi) {
    const dir = path.join(`${__PATH.lib_path}/${weizhi}.json`);
    let weizhi1 = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(weizhi1);
    return data;
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
            for (i = item; i < item + 5; i++) {
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
async function Restraint(shuju, main) {
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
        if ((shuzu[item] == newshuzu[0] && shuzu[Number(item) + 1] == newshuzu[1]) ||
            (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 1] == newshuzu[0])) {
            houzui = `毁${main}灭灵`;
            jiaceng = 0.5;
            return [houzui, jiaceng];
        }
        if ((shuzu[item] == newshuzu[0] && shuzu[Number(item) + 2] == newshuzu[1]) ||
            (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 2] == newshuzu[0])) {
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
async function Writeit(custom) {
    const dir = path.join(__PATH.custom, `custom.json`);
    const new_ARR = JSON.stringify(custom, () => { }, '\t');
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_it() {
    const dir = path.join(`${__PATH.custom}/custom.json`);
    let custom = fs.readFileSync(dir, 'utf8');
    custom = JSON.parse(custom);
    return custom;
}
async function alluser() {
    const B = [];
    const A = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (const item of A)
        B.push(item.substring(0, item.lastIndexOf('.')));
    return B;
}

export { Read_it, Read_mytripod, Read_tripod, Restraint, Write_duanlu, Writeit, alluser, getxuanze, jiaozheng, looktripod, mainyuansu, read_all, read_that, settripod };
