import { useSend, useMention, Text } from 'alemonjs';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?打落凡间.*$/;
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

export { res as default, regular };
