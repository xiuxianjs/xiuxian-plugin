import { useSend, Text, Image } from 'alemonjs';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import { notUndAndNull } from '../../../../model/common.js';
import { getAllExp, sortBy } from '../../../../model/cultivation.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import mw, { selects } from '../../../mw.js';
import { getDataList } from '../../../../model/DataList.js';
import { getRankingPowerImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?天榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const playerList = await keysByPath(__PATH.player_path);
    let File_length = playerList.length;
    const temp = [];
    for (const this_qq of playerList) {
        const player = await readPlayer(this_qq);
        const sum_exp = await getAllExp(this_qq);
        if (!notUndAndNull(player.level_id)) {
            Send(Text('请先#同步信息'));
            return false;
        }
        const levelList = await getDataList('Level1');
        const level = levelList.find(item => item.level_id == player.level_id).level;
        temp.push({
            总修为: sum_exp,
            境界: level,
            名号: player.名号,
            qq: this_qq
        });
    }
    temp.sort(sortBy('总修为'));
    const usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
    const Data = [];
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    const thisplayer = await readPlayer(usr_qq);
    const img = await getRankingPowerImage(e, Data, usr_paiming, thisplayer);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
