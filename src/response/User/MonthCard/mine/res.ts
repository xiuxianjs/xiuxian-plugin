import { checkUserMonthCardStatus, getAvatar, getMonthCard, isUserMonthCardByMothData } from '@src/model';
import mw, { selects } from '@src/response/mw';
import { Image, useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?我的权益$/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);

  const data = await checkUserMonthCardStatus(e.UserId);
  const isMonth = isUserMonthCardByMothData(data);

  const img = await getMonthCard(e.UserId, { isMonth, avatar: getAvatar(e.UserId), data });

  if (!img) {
    return;
  }
  if (Buffer.isBuffer(img)) {
    void message.send(format(Image(img)));

    return false;
  }
  void message.send(format(Text('图片加载失败')));
});

export default onResponse(selects, [mw.current, res.current]);
