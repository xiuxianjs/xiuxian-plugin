import { useSend, useMention, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import 'yaml';
import 'fs';
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
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)打落凡间.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        const Mentions = (await useMention(e)[0].findOne()).data;
        if (!Mentions || Mentions.length === 0) {
            return;
        }
        const User = Mentions.find(item => !item.IsBot);
        if (!User) {
            return;
        }
        let qq = User.UserId;
        let ifexistplay = await existplayer(qq);
        if (!ifexistplay) {
            Send(Text('没存档你打个锤子！'));
            return false;
        }
        let player = await Read_player(qq);
        player.power_place = 1;
        Send(Text('已打落凡间！'));
        await Write_player(qq, player);
        return false;
    }
});

export { res as default, name, regular, selects };
