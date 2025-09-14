import { Image, useSend, Text } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import { getForumImage } from '@src/model/image';
import { existplayer } from '@src/model/index';
import type { NajieCategory } from '@src/types/model';

export const regular = /^(#|＃|\/)?聚宝堂(装备|丹药|功法|道具|草药|仙宠|材料)?$/;

const VALID: ReadonlyArray<NajieCategory> = ['装备', '丹药', '功法', '道具', '草药', '仙宠', '材料'];

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const ext = await existplayer(userId);

  if (!ext) {
    return;
  }

  const raw = e.MessageText.replace(/^(#|＃|\/)?聚宝堂/, '').trim();
  const cate = VALID.find(v => v === raw);

  if (raw && !cate) {
    void Send(Text('类别无效，可选: ' + VALID.join('/')));

    return;
  }

  const img = await getForumImage(e, cate);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  } else {
    void Send(Text('生成列表失败，请稍后再试'));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
