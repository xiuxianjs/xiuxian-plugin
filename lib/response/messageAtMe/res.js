import '../../model/api.js';
import { keys } from '../../model/keys.js';
import { getIoRedis } from '@alemonjs/db';
import '../../model/DataList.js';
import { useMessage, Text, Image } from 'alemonjs';
import 'dayjs';
import { existplayer } from '../../model/xiuxiandata.js';
import '../../model/settions.js';
import { screenshot } from '../../image/index.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import mw, { selects } from '../mw-captcha.js';

const regular = /^(#|＃|\/)?我的消息/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const redis = getIoRedis();
    const id = String(e.UserId);
    const [message] = useMessage(e);
    void redis.lrange(keys.proactiveMessageLog(id), 0, 5).then(async (list) => {
        if (!list || list.length === 0) {
            void message.send(format(Text('暂无消息')));
            return;
        }
        const messages = list
            .map(v => {
            try {
                return JSON.parse(v);
            }
            catch {
                return null;
            }
        })
            .filter(v => !!v)
            .filter(v => Array.isArray(v.message) && v.message.length > 0)
            .sort((a, b) => b.timestamp - a.timestamp);
        if (messages.length === 0) {
            void message.send(format(Text('暂无消息')));
            return;
        }
        const img = await screenshot('MessageBox', id, {
            message: messages.map(v => {
                return {
                    UserId: id,
                    CreateAt: v.timestamp,
                    data: v.message
                };
            }),
            UserId: id
        });
        if (!Buffer.isBuffer(img)) {
            void message.send(format(Text('消息渲染失败')));
            return;
        }
        void message.send(format(Image(img)));
    });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
