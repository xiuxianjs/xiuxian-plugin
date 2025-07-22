import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player, shijianc } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)踏入神界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (+game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return false;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    let player = await Read_player(usr_qq);
    let now = new Date();
    let nowTime = now.getTime();
    let Today = await shijianc(nowTime);
    let lastdagong_time = await getLastdagong(usr_qq);
    if ((Today.Y != lastdagong_time.Y && Today.M != lastdagong_time.M) ||
        Today.D != lastdagong_time.D) {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastdagong_time', nowTime);
        let n = 1;
        if (player.灵根.name == '二转轮回体') {
            n = 2;
        }
        else if (player.灵根.name == '三转轮回体' ||
            player.灵根.name == '四转轮回体') {
            n = 3;
        }
        else if (player.灵根.name == '五转轮回体' ||
            player.灵根.name == '六转轮回体') {
            n = 4;
        }
        else if (player.灵根.name == '七转轮回体' ||
            player.灵根.name == '八转轮回体') {
            n = 4;
        }
        else if (player.灵根.name == '九转轮回体') {
            n = 5;
        }
        player.神界次数 = n;
        await Write_player(usr_qq, player);
    }
    player = await Read_player(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你没有资格进入神界'));
        return false;
    }
    if (player.灵石 < 2200000) {
        Send(Text('灵石不足'));
        return false;
    }
    player.灵石 -= 2200000;
    if (Today.Y == lastdagong_time.Y &&
        Today.M == lastdagong_time.M &&
        Today.D == lastdagong_time.D &&
        player.神界次数 == 0) {
        Send(Text('今日次数用光了,请明日再来吧'));
        return false;
    }
    else {
        player.神界次数--;
    }
    await Write_player(usr_qq, player);
    let time = 30;
    let action_time = 60000 * time;
    let arr = {
        action: '神界',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '1',
        mojie: '-1',
        Place_actionplus: '1',
        power_up: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: '5'
    };
    if (e.name === 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('开始进入神界,' + time + '分钟后归来!'));
});
async function getLastdagong(usr_qq) {
    let time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastdagong_time');
    console.log(time);
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { res as default, name, regular, selects };
