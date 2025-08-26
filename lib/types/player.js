import { readQinmidu, writeQinmidu } from '../model/qinmidu.js';

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
        if (list[i].QQ_A === A || list[i].QQ_A == B) {
            if (list[i].婚姻 !== 0) {
                QQ.push(list[i].QQ_B);
                break;
            }
        }
        else if (list[i].QQ_B == A || list[i].QQ_B == B) {
            if (list[i].婚姻 != 0) {
                QQ.push(list[i].QQ_A);
                break;
            }
        }
    }
    for (i = 0; i < list.length; i++) {
        if ((list[i].QQ_A == A && list[i].QQ_B == B) || (list[i].QQ_A == B && list[i].QQ_B == A)) {
            break;
        }
    }
    if (i == list.length) {
        return false;
    }
    else if (QQ.length != 0) {
        return 0;
    }
    else {
        return list[i].亲密度;
    }
}

export { findQinmidu };
