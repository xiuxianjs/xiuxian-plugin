import { Text, useMessage, useSend, useSubscribe } from 'alemonjs';

import { redis } from '@src/model/api';
import { __PATH, keys } from '@src/model/keys';
import {
  existplayer,
  getRandomFromARR,
  Go,
  notUndAndNull,
  writePlayer,
  getConfig,
  readPlayer,
  readNajie,
  addNajieThing,
  formatRemaining
} from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import type { AssociationDetailData } from '@src/types';
import { getRedisKey } from '@src/model/keys';
import mw from '@src/response/mw-captcha';
import { delDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';

export const regular = /^(#|＃|\/)?再入仙途$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
interface ExtAss extends AssociationDetailData {
  宗门名称: string;
  所有成员?: string[];
  长老?: string[];
  内门弟子?: string[];
  宗主?: string;
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}

function parseNum(v, def = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? n : def;
}
function removeFromRole(ass: ExtAss, role: string, qq: string) {
  const list = ass[role];

  if (Array.isArray(list)) {
    ass[role] = list.filter(v => v !== qq);
  }
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const rebornKey = getRedisKey(userId, 'reCreate_acount');

  let acountRaw = await redis.get(rebornKey);

  if (!acountRaw) {
    await redis.set(rebornKey, '1');
    acountRaw = '1';
  }
  let acount = parseNum(acountRaw, 1);

  if (acount <= 0) {
    acount = 1;
    await redis.set(rebornKey, '1');
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据异常'));

    return false;
  }
  if (parseNum(player.灵石) <= 0) {
    void Send(Text('负债无法再入仙途'));

    return false;
  }
  if (!(await Go(e))) {
    return false;
  }
  const najie = await readNajie(userId);

  if (!najie?.道具?.some(item => item.name === '转世卡')) {
    void Send(Text('您没有转世卡'));

    return false;
  }
  await addNajieThing(userId, '转世卡', '道具', -1);

  const nowTime = Date.now();
  const lastKey = getRedisKey(userId, 'last_reCreate_time');
  const lastRestartRaw = await redis.get(lastKey);
  const lastRestart = parseNum(lastRestartRaw);
  const cf = (await getConfig('xiuxian', 'xiuxian')) as Partial<{
    CD?: { reborn?: number };
  }>;
  const rebornMin = cf?.CD?.reborn ?? 60;
  const rebornTime = rebornMin * 60000;

  if (nowTime < lastRestart + rebornTime) {
    const remain = lastRestart + rebornTime - nowTime;

    void Send(Text(`每${rebornTime / 60000}分钟只能转世一次 剩余cd:${formatRemaining(remain)}`));

    return false;
  }

  void Send(Text('一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'));
  const [subscribe] = useSubscribe(e, selects);
  const sub = subscribe.mount(
    async (event, next) => {
      const [message] = useMessage(event);
      const choice = event.MessageText.trim();

      if (choice === '再继仙缘') {
        void message.send([Text('重拾道心,继续修行')]);
        clearTimeout(timeout);

        return;
      }
      if (choice !== '断绝此生') {
        void message.send([Text('请回复:【断绝此生】或者【再继仙缘】进行选择')]);
        next();

        return;
      }
      clearTimeout(timeout);
      const acountValRaw = await redis.get(rebornKey);
      let acountVal = parseNum(acountValRaw, 1);

      if (acountVal >= 15) {
        void message.send([Text('灵魂虚弱，已不可转世！')]);

        return;
      }
      acountVal += 1;

      const playerNow = await readPlayer(userId);

      if (playerNow && notUndAndNull(playerNow.宗门) && isPlayerGuildRef(playerNow.宗门)) {
        const assRaw = await getDataJSONParseByKey(keys.association(playerNow.宗门.宗门名称));

        if (assRaw !== 'error' && isExtAss(assRaw)) {
          const ass = assRaw;

          if (playerNow.宗门.职位 !== '宗主') {
            removeFromRole(ass, playerNow.宗门.职位, userId);
            ass.所有成员 = (ass.所有成员 || []).filter(q => q !== userId);
            if ('宗门' in playerNow) {
              delete (playerNow as { 宗门?: PlayerGuildRef }).宗门;
            }
            await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
            await writePlayer(userId, playerNow);
          } else {
            if ((ass.所有成员 || []).length < 2) {
              try {
                await delDataByKey(keys.association(ass.宗门名称));
              } catch {
                /* ignore */
              }
            } else {
              ass.所有成员 = (ass.所有成员 || []).filter(q => q !== userId);
              let randmemberId: string | undefined;

              if ((ass.长老 || []).length > 0) {
                randmemberId = getRandomFromARR(ass.长老);
              } else if ((ass.内门弟子 || []).length > 0) {
                randmemberId = getRandomFromARR(ass.内门弟子);
              } else {
                randmemberId = getRandomFromARR(ass.所有成员 || []);
              }
              if (randmemberId) {
                const randmember = await readPlayer(randmemberId);

                if (randmember?.宗门 && isPlayerGuildRef(randmember.宗门)) {
                  removeFromRole(ass, randmember.宗门.职位, randmemberId);
                  ass.宗主 = randmemberId;
                  randmember.宗门.职位 = '宗主';
                  await writePlayer(randmemberId, randmember);
                  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
                }
              }
            }
          }
        }
      }

      await redis.del(getRedisKey(userId, 'last_dajie_time'));
      await redis.set(lastKey, String(Date.now()));
      await redis.set(rebornKey, String(acountVal));
      void message.send([Text('来世，信则有，不信则无，岁月悠悠……')]);
    },
    ['UserId']
  );

  const timeout = setTimeout(() => {
    try {
      subscribe.cancel(sub);
      void Send(Text('超时自动取消操作'));
    } catch {
      /* ignore */
    }
  }, 60 * 1000);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
