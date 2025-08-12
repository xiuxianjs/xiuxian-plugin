import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { sleep } from '../../../../model/common.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?供奉奇怪的石头$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const x = await existNajieThing(usr_qq, '长相奇怪的小石头', '道具');
    if (!x) {
        Send(Text('你翻遍了家里的院子，也没有找到什么看起来奇怪的石头\n于是坐下来冷静思考了一下。\n等等，是不是该去一趟精神病院？\n自己为什么突然会有供奉石头的怪念头？'));
        return false;
    }
    const player = await data.getData('player', usr_qq);
    if (player.轮回点 >= 10 && player.lunhui == 0) {
        Send(Text('你梳洗完毕，将小石头摆在案上,点上香烛，拜上三拜！'));
        await sleep(3000);
        player.当前血量 = 1;
        player.血气 -= 500000;
        Send(Text(`奇怪的小石头灵光一闪，你感受到胸口一阵刺痛，喷出一口鲜血：\n` +
            `“不好，这玩意一定是个邪物！不能放在身上！\n是不是该把它卖了补贴家用？\n` +
            `或者放拍卖行骗几个自认为识货的人回本？”`));
        data.setData('player', usr_qq, player);
        return false;
    }
    await addNajieThing(usr_qq, '长相奇怪的小石头', '道具', -1);
    Send(Text('你梳洗完毕，将小石头摆在案上,点上香烛，拜上三拜！'));
    await sleep(3000);
    player.当前血量 = Math.floor(player.当前血量 / 3);
    player.血气 = Math.floor(player.血气 / 3);
    Send(Text('小石头灵光一闪，化作一道精光融入你的体内。\n' +
        '你喷出一口瘀血，顿时感受到天地束缚弱了几分，可用轮回点+1'));
    await sleep(1000);
    player.轮回点++;
    data.setData('player', usr_qq, player);
    return false;
});

export { res as default, regular };
