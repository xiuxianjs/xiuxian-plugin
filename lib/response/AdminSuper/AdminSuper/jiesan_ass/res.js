import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import { redis } from '../../../../api/api.js';
import 'lodash-es';
import '@alemonjs/db';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?解散宗门.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        let didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();
        if (didian == '') {
            Send(Text('请输入要解散的宗门名称'));
            return false;
        }
        const ass = await redis.get(`${__PATH.association}:${didian}`);
        if (!ass) {
            Send(Text('该宗门不存在'));
            return false;
        }
        for (let qq of ass.所有成员) {
            let player = await await data.getData('player', qq);
            if (player.宗门) {
                if (player.宗门.宗门名称 == didian) {
                    delete player.宗门;
                    await writePlayer(qq, player);
                }
            }
        }
        await redis.del(`${__PATH.association}:${didian}`);
        Send(Text('解散成功!'));
        return false;
    }
});

export { res as default, regular };
