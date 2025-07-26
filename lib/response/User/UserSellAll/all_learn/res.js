import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, readPlayer, addNajieThing, Add_player_学习功法 as Add_player_____ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键学习$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await data.getData('najie', usr_qq);
    let player = await readPlayer(usr_qq);
    let name = '';
    for (let l of najie.功法) {
        let islearned = player.学习的功法.find(item => item == l.name);
        if (!islearned) {
            await addNajieThing(usr_qq, l.name, '功法', -1);
            await Add_player_____(usr_qq, l.name);
            name = name + ' ' + l.name;
        }
    }
    if (name) {
        Send(Text(`你学会了${name},可以在【#我的炼体】中查看`));
    }
    else {
        Send(Text('无新功法'));
    }
});

export { res as default, regular };
