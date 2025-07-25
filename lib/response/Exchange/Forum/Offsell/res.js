import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, Read_Forum, Write_Forum, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?取消[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let Forum;
    let player = await Read_player(usr_qq);
    let x = parseInt(e.MessageText.replace(/^(#|＃|\/)?取消/, '')) - 1;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    if (x >= Forum.length) {
        Send(Text(`没有编号为${x + 1}的宝贝需求`));
        return false;
    }
    if (Forum[x].qq != usr_qq) {
        Send(Text('不能取消别人的宝贝需求'));
        return false;
    }
    await Add___(usr_qq, Forum[x].whole);
    Send(Text(player.名号 +
        '取消' +
        Forum[x].name +
        '成功,返还' +
        Forum[x].whole +
        '灵石'));
    Forum.splice(x, 1);
    await Write_Forum(Forum);
});

export { res as default, regular };
