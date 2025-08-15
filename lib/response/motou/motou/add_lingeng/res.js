import { useSend, Text, useObserver } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { readPlayer, existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/settions.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?供奉魔石$/;
const MAGIC_STAGES = [
    {
        from: '一重魔功',
        to: '二重魔功',
        cost: 20,
        prob: 0.9,
        eff: 0.42,
        rate: 0.27
    },
    {
        from: '二重魔功',
        to: '三重魔功',
        cost: 30,
        prob: 0.8,
        eff: 0.48,
        rate: 0.31
    },
    {
        from: '三重魔功',
        to: '四重魔功',
        cost: 30,
        prob: 0.7,
        eff: 0.54,
        rate: 0.36
    },
    {
        from: '四重魔功',
        to: '五重魔功',
        cost: 40,
        prob: 0.6,
        eff: 0.6,
        rate: 0.4
    },
    {
        from: '五重魔功',
        to: '六重魔功',
        cost: 40,
        prob: 0.5,
        eff: 0.66,
        rate: 0.43
    },
    {
        from: '六重魔功',
        to: '七重魔功',
        cost: 40,
        prob: 0.4,
        eff: 0.72,
        rate: 0.47
    },
    {
        from: '七重魔功',
        to: '八重魔功',
        cost: 50,
        prob: 0.3,
        eff: 0.78,
        rate: 0.5
    },
    { from: '八重魔功', to: '九重魔功', cost: 50, prob: 0.2, eff: 1.2, rate: 1.2 }
];
const Res = onResponse(selects, async (e, next) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const player = await readPlayer(usr_qq);
    const choice = e.MessageText;
    if (choice === '放弃魔根') {
        await Send(Text('重拾道心,继续修行'));
        return;
    }
    else if (choice === '转世魔根') {
        const x = await existNajieThing(usr_qq, '魔石', '道具');
        if (!x) {
            Send(Text('你没有魔石'));
            return;
        }
        if (x < 10) {
            Send(Text('你魔石不足10个'));
            return;
        }
        await addNajieThing(usr_qq, '魔石', '道具', -10);
        player.灵根 = {
            name: '一重魔功',
            type: '魔头',
            eff: 0.36,
            法球倍率: 0.23
        };
        await writePlayer(usr_qq, player);
        Send(Text('恭喜你,转世魔头成功!'));
        return;
    }
    else {
        Send(Text('输入错误,请重新输入'));
        next();
    }
});
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return;
    const player = await readPlayer(usr_qq);
    if ((player.魔道值 || 0) < 1000) {
        Send(Text('你不是魔头'));
        return;
    }
    const x = await existNajieThing(usr_qq, '魔石', '道具');
    if (!x) {
        Send(Text('你没有魔石'));
        return;
    }
    if (player.灵根.type !== '魔头') {
        await Send(Text('一旦转为魔根,将会舍弃当前灵根。回复:【放弃魔根】或者【转世魔根】进行选择'));
        const [Observer] = useObserver(e, 'message.create');
        Observer(Res.current, ['UserId']);
        return;
    }
    const stage = MAGIC_STAGES.find(s => s.from === player.灵根.name);
    if (!stage) {
        Send(Text('当前灵根已达最高或无法突破'));
        return;
    }
    if (x < stage.cost) {
        Send(Text(`魔石不足${stage.cost}个,当前魔石数量${x}个`));
        return;
    }
    await addNajieThing(usr_qq, '魔石', '道具', -stage.cost);
    const random = Math.random();
    if (random < stage.prob) {
        player.灵根 = {
            name: stage.to,
            type: '魔头',
            eff: stage.eff,
            法球倍率: stage.rate
        };
        await writePlayer(usr_qq, player);
        Send(Text(`恭喜你,灵根突破成功,当前灵根${stage.to}!`));
    }
    else {
        Send(Text('灵根突破失败'));
    }
});

export { res as default, regular, selects };
