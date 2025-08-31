import '../../model/api.js';
import { keysByPath, __PATH, keysAction, keysLock } from '../../model/keys.js';
import { getDataJSONParseByKey } from '../../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../../model/Config.js';
import 'alemonjs';
import 'dayjs';
import { getDataList } from '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import '../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { withLock } from '../../model/locks.js';
import { handelAction } from '../../model/actions/mojietask.js';
import { handelAction as handelAction$1 } from '../../model/actions/OccupationTask.js';
import { handelAction as handelAction$2 } from '../../model/actions/PlayerControlTask.js';
import { handelAction as handelAction$3 } from '../../model/actions/SecretPlaceTask.js';
import { handelAction as handelAction$4 } from '../../model/actions/SecretPlaceplusTask.js';
import { handelAction as handelAction$5 } from '../../model/actions/shenjietask.js';
import { handelAction as handelAction$6 } from '../../model/actions/Taopaotask.js';
import { handelAction as handelAction$7 } from '../../model/actions/Xijietask.js';

const startTask = async () => {
    try {
        const playerList = await keysByPath(__PATH.player_path);
        if (!playerList || playerList.length === 0) {
            return;
        }
        const npcList = await getDataList('NPC');
        const monsterList = await getDataList('Monster');
        const config = await getConfig('xiuxian', 'xiuxian');
        const mojieDataList = await getDataList('Mojie');
        const shenjieData = await getDataList('Shenjie');
        for (const playerId of playerList) {
            try {
                const action = await getDataJSONParseByKey(keysAction.action(playerId));
                if (!action) {
                    continue;
                }
                void handelAction(playerId, action, { mojieDataList });
                void handelAction$1(playerId, action);
                void handelAction$2(playerId, action, { config });
                void handelAction$3(playerId, action, { monsterList, config });
                void handelAction$4(playerId, action, { monsterList, config });
                void handelAction$5(playerId, action, { shenjieData });
                void handelAction$6(playerId, action, { npcList });
                void handelAction$7(playerId, action, { npcList });
            }
            catch (error) {
                logger.error(error);
            }
        }
    }
    catch (error) {
        logger.error(error);
    }
};
const executeBossBattleWithLock = async () => {
    const lockKey = keysLock.task('ActionsTask');
    const result = await withLock(lockKey, async () => {
        await startTask();
    }, {
        timeout: 1000 * 25,
        retryDelay: 100,
        maxRetries: 0,
        enableRenewal: true,
        renewalInterval: 1000 * 10
    });
    if (!result.success) {
        logger.warn('ActionsTask lock failed:', result.error);
    }
};
const ActionsTask = () => {
    const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;
    setTimeout(() => {
        void executeBossBattleWithLock();
    }, delay * 1000);
};

export { ActionsTask };
