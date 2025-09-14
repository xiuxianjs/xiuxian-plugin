import { Text, useSend, Image } from 'alemonjs';
import { screenshot } from '@src/image/index.js';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';

export const regular = /^(#|＃|\/)?更新日志$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const data = await getDataList('UpdateRecord');
  const image = await screenshot('updateRecord', e.UserId, {
    Record: data
  });

  if (Buffer.isBuffer(image)) {
    void Send(Image(image));

    return;
  }
  void Send(Text('更新日志获取失败'));
});

export default onResponse(selects, [mw.current, res.current]);
