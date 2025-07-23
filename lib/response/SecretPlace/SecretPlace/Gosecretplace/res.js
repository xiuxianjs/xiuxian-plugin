import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Go, Read_player, isNotNull, exist_hunyin, find_qinmidu, add_qinmidu, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)降临秘境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await Read_player(usr_qq);
    let didian = e.MessageText.replace('#降临秘境', '');
    didian = didian.trim();
    let weizhi = await data.didian_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    if (didian == '桃花岛') {
        let exist_B = await exist_hunyin(usr_qq);
        if (!exist_B) {
            Send(Text(`还请少侠找到道侣之后再来探索吧`));
            return false;
        }
        let qinmidu = await find_qinmidu(usr_qq, exist_B);
        if (qinmidu < 550) {
            Send(Text('少侠还是先和道侣再联络联络感情吧'));
            return false;
        }
        await add_qinmidu(usr_qq, exist_B, -50);
    }
    let Price = weizhi.Price;
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
    if (e.name === 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'));
});

export { res as default, regular, selects };
