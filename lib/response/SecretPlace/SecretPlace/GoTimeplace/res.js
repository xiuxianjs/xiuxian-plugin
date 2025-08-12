import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import { Go, notUndAndNull, sleep } from '../../../../model/common.js';
import { addCoin, addExp } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
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
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?探索仙府$/;
const FAIL_PRICE = 50_000;
const MIN_REQ_LEVEL_ID = 21;
const MIN_REQ_EXP = 100_000;
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await Go(e)))
        return false;
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据不存在'));
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    const didianList = ['无欲天仙', '仙遗之地'];
    const selectedName = pickRandom(didianList);
    const luck = Math.random();
    await sleep(1000);
    Send(Text('你在冲水堂发现有人上架了一份仙府地图'));
    await sleep(1000);
    if (luck > 0.9) {
        if (player.灵石 < FAIL_PRICE) {
            Send(Text('还没看两眼就被看堂的打手撵了出去说:“哪来的穷小子,不买别看”'));
            return false;
        }
        Send(Text('价格为5w,你觉得特别特别便宜,赶紧全款拿下了,历经九九八十天,到了后发现居然是仙湖游乐场！'));
        await addCoin(usr_qq, -FAIL_PRICE);
        return false;
    }
    const levelInfo = data.Level_list.find(l => l.level_id === player.level_id);
    if (!levelInfo) {
        Send(Text('境界数据缺失'));
        return false;
    }
    const nowLevelId = levelInfo.level_id;
    if (nowLevelId < MIN_REQ_LEVEL_ID) {
        Send(Text('到了地图上的地点，结果你发现,你尚未达到化神,无法抵御灵气压制'));
        return false;
    }
    const place = data.timeplace_list.find(t => t.name === selectedName);
    if (!place || !notUndAndNull(place.Price)) {
        Send(Text('报错！地点错误，请找群主反馈'));
        return false;
    }
    if (player.灵石 < place.Price) {
        Send(Text(`你发现标价是${place.Price},你买不起赶紧溜了`));
        return false;
    }
    if (player.修为 < MIN_REQ_EXP) {
        Send(Text('到了地图上的地点，发现洞府前有一句前人留下的遗言:‘至少有10w修为才能抵御仙威！’'));
        return false;
    }
    let discountFactor = 1;
    const hasTicket = await existNajieThing(usr_qq, '仙府通行证', '道具');
    if (hasTicket &&
        player.魔道值 < 1 &&
        (player.灵根.type === '转生' || player.level_id > 41)) {
        discountFactor = 0;
        Send(Text(`${player.名号}使用了道具仙府通行证,本次仙府免费`));
        await addNajieThing(usr_qq, '仙府通行证', '道具', -1);
    }
    const priceToPay = Math.trunc(place.Price * discountFactor);
    if (priceToPay > 0)
        await addCoin(usr_qq, -priceToPay);
    const cf = config.getConfig('xiuxian', 'xiuxian') || { CD: { timeplace: 10 } };
    const minutes = Number(cf?.CD?.timeplace) || 10;
    const actionTime = minutes * 60_000;
    const actionRecord = {
        action: '探索',
        end_time: Date.now() + actionTime,
        time: actionTime,
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        Place_address: place
    };
    if (e.name === 'message.create')
        actionRecord.group_id = e.ChannelId;
    await redis.set(`xiuxian@1.3.0:${usr_qq}:action`, JSON.stringify(actionRecord));
    await addExp(usr_qq, -MIN_REQ_EXP);
    const baseMsg = `你买下了那份地图,历经九九八十一天,终于到达了地图上的${selectedName === '无欲天仙' ? '仙府' : '地点'},` +
        (selectedName === '无欲天仙'
            ? `洞府上模糊得刻着[${place.name}仙府]`
            : '这座洞府仿佛是上个末法时代某个仙人留下的遗迹') +
        `,你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了${MIN_REQ_EXP}修为成功突破封锁闯了进去${minutes}分钟后归来!`;
    Send(Text(baseMsg));
    return false;
});

export { res as default, regular };
