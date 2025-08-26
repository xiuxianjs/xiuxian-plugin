import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function readQinmidu() {
    const data = await getDataJSONParseByKey(keys.qinmidu('qinmidu'));
    return data ?? [];
}
async function writeQinmidu(qinmidu) {
    await setDataJSONStringifyByKey(keys.qinmidu('qinmidu'), qinmidu);
}
async function fstaddQinmidu(A, B) {
    let list = [];
    try {
        list = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    const rec = { QQ_A: A, QQ_B: B, 亲密度: 0, 婚姻: 0 };
    list.push(rec);
    await writeQinmidu(list);
}
async function addQinmidu(A, B, qinmi) {
    let list = [];
    try {
        list = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    let i;
    for (i = 0; i < list.length; i++) {
        if ((list[i].QQ_A === A && list[i].QQ_B === B) || (list[i].QQ_A === B && list[i].QQ_B === A)) {
            break;
        }
    }
    if (i === list.length) {
        await fstaddQinmidu(A, B);
        list = await readQinmidu();
    }
    list[i].亲密度 += qinmi;
    await writeQinmidu(list);
}
async function findQinmidu(A, B) {
    let list = [];
    try {
        list = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    let i;
    const QQ = [];
    for (i = 0; i < list.length; i++) {
        if (list[i].QQ_A === A || list[i].QQ_A === B) {
            if (list[i].婚姻 !== 0) {
                QQ.push(list[i].QQ_B);
                break;
            }
        }
        else if (list[i].QQ_B === A || list[i].QQ_B === B) {
            if (list[i].婚姻 !== 0) {
                QQ.push(list[i].QQ_A);
                break;
            }
        }
    }
    for (i = 0; i < list.length; i++) {
        if ((list[i].QQ_A === A && list[i].QQ_B === B) || (list[i].QQ_A === B && list[i].QQ_B === A)) {
            break;
        }
    }
    if (i === list.length) {
        return false;
    }
    else if (QQ.length !== 0) {
        return 0;
    }
    else {
        return list[i].亲密度;
    }
}
async function findDaolvQinmidu(A) {
    let list = [];
    try {
        list = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    for (let i = 0; i < list.length; i++) {
        if ((list[i].QQ_A === A || list[i].QQ_B === A) && list[i].婚姻 !== 0) {
            return list[i].亲密度;
        }
    }
    return 0;
}
async function existHunyin(A) {
    let list = [];
    try {
        list = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].QQ_A === A) {
            if (list[i].婚姻 !== 0) {
                return list[i].QQ_B;
            }
        }
        else if (list[i].QQ_B === A) {
            if (list[i].婚姻 !== 0) {
                return list[i].QQ_A;
            }
        }
    }
    return '';
}
var qinmidu = {
    readQinmidu,
    writeQinmidu,
    fstaddQinmidu,
    addQinmidu,
    findQinmidu,
    existHunyin
};

export { addQinmidu, qinmidu as default, existHunyin, findDaolvQinmidu, findQinmidu, fstaddQinmidu, readQinmidu, writeQinmidu };
