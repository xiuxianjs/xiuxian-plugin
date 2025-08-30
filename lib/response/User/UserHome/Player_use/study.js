import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { Text } from 'alemonjs';
import 'dayjs';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
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
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const handleStudy = async (userId, thingName, message) => {
    const nowPlayer = await readPlayer(userId);
    if (!nowPlayer) {
        return false;
    }
    const islearned = nowPlayer.学习的功法.find(item => item === thingName);
    if (islearned) {
        void message.send(format(Text('你已经学过该功法了')));
        return false;
    }
    await addNajieThing(userId, thingName, '功法', -1);
    nowPlayer.学习的功法.push(thingName);
    await writePlayer(userId, nowPlayer);
    await playerEfficiency(userId);
    void message.send(format(Text(`你学会了${thingName},可以在【#我的炼体】中查看`)));
    return true;
};

export { handleStudy };
