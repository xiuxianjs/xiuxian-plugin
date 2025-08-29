import { useSend, Image, Text } from 'alemonjs';
import '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../model/xiuxiandata.js';
import '../../../model/DataList.js';
import 'lodash-es';
import '../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../model/currency.js';
import { getPlayerImage } from '../../../model/image.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';

async function showSlayer(e) {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    try {
        const img = await getPlayerImage(e);
        if (Buffer.isBuffer(img)) {
            void Send(Image(img));
            return false;
        }
        void Send(Text('图片加载失败'));
        return false;
    }
    catch {
        void Send(Text('角色卡生成失败'));
        return false;
    }
}

export { showSlayer };
