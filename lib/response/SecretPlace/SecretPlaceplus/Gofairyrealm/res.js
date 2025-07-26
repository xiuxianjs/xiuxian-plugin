import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Go, convert2integer, isNotNull, readPlayer, existNajieThing, addNajieThing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?沉迷仙境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷仙境/, '');
    let code = didian.split('*');
    didian = code[0];
    let i = await convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    let weizhi = await data.Fairyrealm_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    let player = await readPlayer(usr_qq);
    if (player.灵石 < weizhi.Price * 10 * i) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    let now_level_id;
    if (didian == '仙界矿场') {
        Send(Text('打工本不支持沉迷哦'));
        return false;
    }
    player = await readPlayer(usr_qq);
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 42 && player.lunhui == 0) {
        return false;
    }
    let number = await existNajieThing(usr_qq, '秘境之匙', '道具');
    if (isNotNull(number) && number >= i) {
        await addNajieThing(usr_qq, '秘境之匙', '道具', -i);
    }
    else {
        Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    let Price = weizhi.Price * 10 * i;
    await Add___(usr_qq, -Price);
    const time = i * 10 * 5 + 10;
    let action_time = 60000 * time;
    let arr = {
        action: '历练',
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
    Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
