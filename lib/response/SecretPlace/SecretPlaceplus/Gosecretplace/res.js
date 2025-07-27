import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { Go, convert2integer, isNotNull, readPlayer, existNajieThing, addNajieThing, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?沉迷秘境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷秘境/, '');
    let code = didian.split('*');
    didian = code[0];
    let i = await convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    let weizhi = await data.didian_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    let player = await readPlayer(usr_qq);
    if (player.灵石 < weizhi.Price * 10 * i) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    if (didian == '大千世界' || didian == '桃花岛') {
        Send(Text('该秘境不支持沉迷哦'));
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
    await addCoin(usr_qq, -Price);
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
        cishu: i * 10,
        Place_address: weizhi
    };
    if (e.name == 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
