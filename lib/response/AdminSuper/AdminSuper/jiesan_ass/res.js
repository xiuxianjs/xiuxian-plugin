import { useSend, Text } from 'alemonjs';
import { __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import data from '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import 'lodash-es';
import '../../../../model/settions.js';
import { redis } from '../../../../model/api.js';
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
import '../../../../route/core/auth.js';
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
