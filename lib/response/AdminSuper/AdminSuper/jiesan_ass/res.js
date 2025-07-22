import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
import 'yaml';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { Write_player } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)解散宗门.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        let didian = e.MessageText.replace('#解散宗门', '');
        didian = didian.trim();
        let ass = data.getAssociation(didian);
        if (ass == 'error') {
            Send(Text('该宗门不存在'));
            return false;
        }
        for (let qq of ass.所有成员) {
            let player = await data.getData('player', qq);
            if (player.宗门) {
                if (player.宗门.宗门名称 == didian) {
                    delete player.宗门;
                    await Write_player(qq, player);
                }
            }
        }
        fs.rmSync(`${data.filePathMap.association}/${didian}.json`);
        Send(Text('解散成功!'));
        return false;
    }
});

export { res as default, name, regular, selects };
