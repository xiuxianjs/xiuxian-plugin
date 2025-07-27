import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { existplayer, readPlayer, readForum, writeForum, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?取消[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let Forum = [];
    let player = await readPlayer(usr_qq);
    let x = parseInt(e.MessageText.replace(/^(#|＃|\/)?取消/, '')) - 1;
    try {
        Forum = await readForum();
    }
    catch {
        await writeForum([]);
    }
    if (x >= Forum.length) {
        Send(Text(`没有编号为${x + 1}的宝贝需求`));
        return false;
    }
    if (Forum[x].qq != usr_qq) {
        Send(Text('不能取消别人的宝贝需求'));
        return false;
    }
    await addCoin(usr_qq, Forum[x].whole);
    Send(Text(player.名号 +
        '取消' +
        Forum[x].name +
        '成功,返还' +
        Forum[x].whole +
        '灵石'));
    Forum.splice(x, 1);
    await writeForum(Forum);
});

export { res as default, regular };
