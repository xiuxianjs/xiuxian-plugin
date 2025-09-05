import { useSend, Image, Text } from 'alemonjs';
import '../../../model/api.js';
import '../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../model/xiuxiandata.js';
import '../../../model/DataList.js';
import '../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import { getPlayerImage } from '../../../model/image.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';

async function showPlayer(e) {
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

export { showPlayer };
