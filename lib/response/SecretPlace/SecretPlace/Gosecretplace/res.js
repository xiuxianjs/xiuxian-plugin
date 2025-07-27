import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
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
import { Go, readPlayer, isNotNull, existHunyin, findQinmidu, addQinmidu, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?降临秘境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await readPlayer(usr_qq);
    let didian = e.MessageText.replace(/^(#|＃|\/)?降临秘境/, '');
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
        let exist_B = await existHunyin(usr_qq);
        if (!exist_B) {
            Send(Text(`还请少侠找到道侣之后再来探索吧`));
            return false;
        }
        let qinmidu = await findQinmidu(usr_qq, exist_B);
        if (qinmidu < 550) {
            Send(Text('少侠还是先和道侣再联络联络感情吧'));
            return false;
        }
        await addQinmidu(usr_qq, exist_B, -50);
    }
    let Price = weizhi.Price;
    await addCoin(usr_qq, -Price);
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

export { res as default, regular };
