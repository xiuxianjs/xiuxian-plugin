import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?解散宗门.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();
        if (didian == '') {
            Send(Text('请输入要解散的宗门名称'));
            return false;
        }
        const assRaw = await redis.get(`${__PATH.association}:${didian}`);
        if (!assRaw) {
            Send(Text('该宗门不存在'));
            return false;
        }
        let ass = null;
        try {
            ass = JSON.parse(assRaw);
        }
        catch {
            Send(Text('宗门数据损坏，无法解散'));
            return false;
        }
        const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
        for (const qq of members) {
            const player = (await data.getData('player', qq));
            if (!player)
                continue;
            const guild = player.宗门;
            if (guild &&
                typeof guild === 'object' &&
                '宗门名称' in guild &&
                guild.宗门名称 === didian) {
                const { 宗门: _ignored, ...rest } = player;
                await writePlayer(qq, rest);
            }
        }
        await redis.del(`${__PATH.association}:${didian}`);
        Send(Text('解散成功!'));
        return false;
    }
});

export { res as default, regular };
