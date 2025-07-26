import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Go, readPlayer, isNotNull, existNajieThing, addNajieThing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?镇守仙境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await readPlayer(usr_qq);
    let didian = e.MessageText.replace(/^(#|＃|\/)?镇守仙境/, '');
    didian = didian.trim();
    let weizhi = await data.Fairyrealm_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    let now_level_id;
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 42 && player.lunhui == 0) {
        return false;
    }
    let dazhe = 1;
    if ((await existNajieThing(usr_qq, '杀神崖通行证', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41) &&
        didian == '杀神崖') {
        dazhe = 0;
        Send(Text(player.名号 + '使用了道具杀神崖通行证,本次仙境免费'));
        await addNajieThing(usr_qq, '杀神崖通行证', '道具', -1);
    }
    else if ((await existNajieThing(usr_qq, '仙境优惠券', '道具')) &&
        player.魔道值 < 1 &&
        (player.灵根.type == '转生' || player.level_id > 41)) {
        dazhe = 0.5;
        Send(Text(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%'));
        await addNajieThing(usr_qq, '仙境优惠券', '道具', -1);
    }
    let Price = weizhi.Price * dazhe;
    await Add___(usr_qq, -Price);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.secretplace;
    let action_time = 60000 * time;
    let arr = {
        action: '历练',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        Place_address: weizhi
    };
    if (e.name == 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
