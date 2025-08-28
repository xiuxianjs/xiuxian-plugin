import { pushInfo } from '../model/api.js';
import { readTemp, writeTemp } from '../model/temp.js';
import { screenshot } from '../image/index.js';

const MsgTask = async () => {
    let temp = [];
    try {
        temp = await readTemp();
    }
    catch {
        await writeTemp([]);
    }
    if (temp.length > 0) {
        const group = [];
        group.push(temp[0].qq_group);
        f1: for (const i of temp) {
            for (const j of group) {
                if (i.qq_group === j) {
                    continue f1;
                }
            }
            group.push(i.qq_group);
        }
        for (const i of group) {
            const msg = [];
            for (const j of temp) {
                if (i === j.qq_group) {
                    msg.push(j.msg);
                }
            }
            const temp_data = { temp: msg };
            const img = await screenshot('temp', i, temp_data);
            if (img) {
                pushInfo(i, true, img);
            }
        }
        await writeTemp([]);
    }
};

export { MsgTask };
