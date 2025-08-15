import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getConfig } from '../../../../model/Config.js';
import { screenshot } from '../../../../image/index.js';
import { postLogCommand, COMMAND_NAME } from '../../../../model/posthog.js';

const regular = /^(#|＃|\/)??(修仙|仙侠)?帮助(\d+)?$/;
var res = onResponse(selects, async (e) => {
    postLogCommand({
        id: e.UserId,
        value: e.MessageText,
        name: COMMAND_NAME.HELP,
        ext: {
            username: e.UserName
        }
    });
    const Send = useSend(e);
    const helpData = getConfig('help', 'help');
    const page = e.MessageText.match(/(\d+)/)?.[1]
        ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1')
        : 1;
    const pageSize = 3;
    const total = Math.ceil(helpData.length / pageSize);
    const data = helpData.slice((page - 1) * 3, page * 3);
    const img = await screenshot('help', `help-${page}`, {
        helpData: data,
        page: page,
        pageSize: pageSize,
        total: total
    }, true);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
