import { notUndAndNull } from '../model/common.js';
import { readPlayer } from '../model/xiuxian_impl.js';
import { keysByPath, __PATH } from '../model/keys.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import { safeParse } from '../model/utils/safe.js';
import { calcEffectiveMinutes, plant_jiesuan, mine_jiesuan } from '../response/Occupation/api.js';

const OccupationTask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    for (const player_id of playerList) {
        const actionRaw = await getDataByUserId(player_id, 'action');
        const action = safeParse(actionRaw, null);
        if (!action)
            continue;
        let push_address;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            push_address = action.group_id;
        }
        const now_time = Date.now();
        if (action.plant === '0') {
            const end_time = action.end_time - 60000 * 2;
            if (now_time > end_time) {
                if (action.is_jiesuan === 1)
                    continue;
                const start_time = action.end_time - Number(action.time);
                const now = Date.now();
                const timeMin = calcEffectiveMinutes(start_time, action.end_time, now);
                await plant_jiesuan(player_id, timeMin, push_address);
                const arr = { ...action };
                arr.is_jiesuan = 1;
                arr.plant = 1;
                arr.shutup = 1;
                arr.working = 1;
                arr.power_up = 1;
                arr.Place_action = 1;
                arr.Place_actionplus = 1;
                delete arr.group_id;
                await setDataByUserId(player_id, 'action', JSON.stringify(arr));
            }
        }
        if (action.mine === '0') {
            const end_time = action.end_time - 60000 * 2;
            if (now_time > end_time) {
                const playerRaw = await readPlayer(player_id);
                if (!playerRaw || Array.isArray(playerRaw))
                    continue;
                const player = playerRaw;
                if (!notUndAndNull(player.level_id))
                    continue;
                const rawTime2 = typeof action.time === 'string'
                    ? parseInt(action.time)
                    : Number(action.time);
                const timeMin = (isNaN(rawTime2) ? 0 : rawTime2) / 1000 / 60;
                await mine_jiesuan(player_id, timeMin, push_address);
                const arr = { ...action };
                arr.mine = 1;
                arr.shutup = 1;
                arr.working = 1;
                arr.power_up = 1;
                arr.Place_action = 1;
                arr.Place_actionplus = 1;
                delete arr.group_id;
                await setDataByUserId(player_id, 'action', JSON.stringify(arr));
            }
        }
    }
};

export { OccupationTask };
