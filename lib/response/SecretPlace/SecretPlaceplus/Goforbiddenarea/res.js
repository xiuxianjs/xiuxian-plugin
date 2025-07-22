import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
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
import { Go, Read_player, isNotNull, convert2integer, exist_najie_thing, Add_najie_thing, Add_灵石 as Add___, Add_修为 as Add___$1 } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)沉迷禁地.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await Read_player(usr_qq);
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    if (!isNotNull(player.power_place)) {
        Send(Text('请#同步信息'));
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 22) {
        Send(Text('没有达到化神之前还是不要去了'));
        return false;
    }
    let didian = await e.MessageText.replace('#沉迷禁地', '');
    let code = didian.split('*');
    didian = code[0];
    let i = await convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    let weizhi = await data.forbiddenarea_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    if (player.灵石 < weizhi.Price * 10 * i) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    if (player.修为 < weizhi.experience * 10 * i) {
        Send(Text('你需要积累' + weizhi.experience * 10 * i + '修为，才能抵抗禁地魔气！'));
        return false;
    }
    let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具');
    if (isNotNull(number) && number >= i) {
        await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i);
    }
    else {
        Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    let Price = weizhi.Price * 10 * i;
    let Exp = weizhi.experience * 10 * i;
    await Add___(usr_qq, -Price);
    await Add___$1(usr_qq, -Exp);
    const time = i * 10 * 5 + 10;
    let action_time = 60000 * time;
    let arr = {
        action: '禁地',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '0',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: 10 * i,
        Place_address: weizhi
    };
    if (e.name === 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'));
});

export { res as default, name, regular, selects };
