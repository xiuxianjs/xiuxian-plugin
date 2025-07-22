import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, Go, convert2integer, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)发红包.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let lingshi = e.MessageText.replace('#', '');
    lingshi = lingshi.replace('发红包', '');
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let code = lingshi.split('*');
    lingshi = code[0];
    let acount = code[1];
    lingshi = await convert2integer(lingshi);
    acount = await convert2integer(acount);
    let player = await data.getData('player', usr_qq);
    if (player.灵石 <= Math.floor(lingshi * acount)) {
        Send(Text(`红包数要比自身灵石数小噢`));
        return false;
    }
    lingshi = Math.trunc(lingshi / 10000) * 10000;
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':honbao', lingshi);
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':honbaoacount', acount);
    await Add___(usr_qq, -lingshi * acount);
    Send(Text('【全服公告】' +
        player.名号 +
        '发了' +
        acount +
        '个' +
        lingshi +
        '灵石的红包！'));
});

export { res as default, regular, selects };
