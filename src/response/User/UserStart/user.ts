import { Image, PrivateEventMessageCreate, EventsMessageCreateEnum, useSend, Text } from 'alemonjs';
import { existplayer } from '@src/model/index';
import { getPlayerImage } from '@src/model/image';

export async function showSlayer(e: EventsMessageCreateEnum | PrivateEventMessageCreate) {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  try {
    const img = await getPlayerImage(e);

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));

      return false;
    }
    void Send(Text('图片加载失败'));

    return false;
  } catch {
    void Send(Text('角色卡生成失败'));

    return false;
  }
}
