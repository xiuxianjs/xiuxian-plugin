import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { getTimeStr } from '../../../../model/index.js';
import { __PATH } from '../../../../model/paths.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)存档列表$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    try {
        if (!e.IsMaster) {
            Send(Text('只有主人可以执行操作'));
            return false;
        }
        let backUpList = fs.readdirSync(__PATH.backup).filter(folderName => {
            const stat = fs.statSync(`${__PATH.backup}/${folderName}`);
            return folderName === `${Number(folderName)}` && stat.isDirectory();
        });
        if (backUpList.length > 80)
            backUpList = backUpList.slice(-80);
        const backUpObj = backUpList
            .map(timeStamp => getTimeStr(timeStamp))
            .map((str, index) => {
            return `${index + 1}. ${str}`;
        })
            .join('\n');
        Send(Text(`存档列表：\n${backUpObj}`));
        return false;
    }
    catch (err) {
        await Send(Text(`查看存档列表失败，${err}`));
        throw err;
    }
});

export { res as default, regular, selects };
