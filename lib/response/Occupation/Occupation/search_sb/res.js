import { useSend, Text, Image } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import Game from '../../../../model/show.js';
import 'path';
import { existplayer, Read_player, __PATH } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';
import puppeteer from '../../../../image/index.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)悬赏目标$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.occupation != '侠客') {
        Send(Text('只有专业的侠客才能获取悬赏'));
        return false;
    }
    let msg = [];
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':shangjing');
    action = await JSON.parse(action);
    let type = 0;
    if (action != null) {
        if (action.end_time > new Date().getTime()) {
            msg = action.arm;
            let msg_data = { msg, type };
            const data1 = await new Game().get_msg(msg_data);
            let img = await puppeteer.screenshot('msg', e.UserId, { ...data1 });
            Send(Image(img));
            return false;
        }
    }
    let mubiao = [];
    let i = 0;
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    let File_length = File.length;
    for (let k = 0; k < File_length; k++) {
        let this_qq = File[k].replace('.json', '');
        let players = await Read_player(this_qq);
        if (players.魔道值 > 999 && this_qq != usr_qq) {
            mubiao[i] = {
                名号: players.名号,
                赏金: Math.trunc((1000000 *
                    (1.2 + 0.05 * player.occupation_level) *
                    player.level_id *
                    player.Physique_id) /
                    42 /
                    42 /
                    4),
                QQ: this_qq
            };
            i++;
        }
    }
    while (i < 4) {
        mubiao[i] = {
            名号: 'DD大妖王',
            赏金: Math.trunc((1000000 *
                (1.2 + 0.05 * player.occupation_level) *
                player.level_id *
                player.Physique_id) /
                42 /
                42 /
                4),
            QQ: 1
        };
        i++;
    }
    for (let k = 0; k < 3; k++) {
        msg.push(mubiao[Math.trunc(Math.random() * i)]);
    }
    let arr = {
        arm: msg,
        end_time: new Date().getTime() + 60000 * 60 * 20
    };
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':shangjing', JSON.stringify(arr));
    let msg_data = { msg, type };
    const data1 = await new Game().get_msg(msg_data);
    let img = await puppeteer.screenshot('msg', e.UserId, { ...data1 });
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
