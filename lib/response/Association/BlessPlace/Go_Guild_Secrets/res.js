import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Go, Read_player, isNotNull, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?探索宗门秘境.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await Read_player(usr_qq);
    if (!player.宗门) {
        Send(Text('请先加入宗门'));
        return false;
    }
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (ass.宗门驻地 == 0) {
        Send(Text(`你的宗门还没有驻地，不能探索秘境哦`));
        return false;
    }
    let didian = e.MessageText.replace('(#|＃|/)?探索宗门秘境', '');
    didian = didian.trim();
    let weizhi = await data.guildSecrets_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
        return false;
    }
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    let Price = weizhi.Price;
    ass.灵石池 += Price * 0.05;
    data.setAssociation(ass.宗门名称, ass);
    await Add___(usr_qq, -Price);
    let time = config.getConfig('xiuxian', 'xiuxian').CD.secretplace;
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
        Place_address: weizhi,
        XF: ass.power
    };
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始探索' + didian + '宗门秘境,' + time + '分钟后归来!'));
});

export { res as default, regular };
