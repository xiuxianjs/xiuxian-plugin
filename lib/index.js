import { getAppCofig } from './model/Config.js';
import '@alemonjs/db';
import './model/settions.js';
import './model/DataList.js';
import './model/xiuxian_impl.js';
import 'alemonjs';
import 'lodash-es';
import './model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import './resources/img/state.jpg.js';
import './resources/styles/tw.scss.js';
import './resources/font/tttgbnumber.ttf.js';
import './resources/img/player.jpg.js';
import './resources/img/player_footer.png.js';
import './resources/img/user_state.png.js';
import 'classnames';
import './resources/img/fairyrealm.jpg.js';
import './resources/img/card.jpg.js';
import './resources/img/road.jpg.js';
import './resources/img/user_state2.png.js';
import './resources/html/help.js';
import './resources/img/najie.jpg.js';
import './resources/img/shituhelp.jpg.js';
import './resources/img/icon.png.js';
import './resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import { initDefaultAdmin } from './route/core/auth.js';
import { initPostlog } from './model/posthog.js';
import { startAllTasks } from './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
        initPostlog();
        initDefaultAdmin();
        const value = getAppCofig();
        if (typeof value?.task !== 'boolean' || value.task) {
            startAllTasks().catch(error => {
                logger.error('启动定时任务失败:', error);
            });
        }
    }
});

export { index as default };
