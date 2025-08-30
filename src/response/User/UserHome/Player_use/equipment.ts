import { Image, Text, useSend } from 'alemonjs';
import { insteadEquipment } from '@src/model/najie';
import { getEquipmentImage } from '@src/model/image';

// 装备处理
export const handleEquipment = async (userId: string, thingName: string, pinji: number | undefined, najie: any, e: any): Promise<boolean> => {
  const findItem = najie.装备.find((i: any) => i.name === thingName && i.pinji === pinji);

  const sorted = najie.装备.filter((i: any) => i.name === thingName).sort((a: any, b: any) => (b.pinji ?? 0) - (a.pinji ?? 0));

  const equ = pinji !== undefined ? findItem : sorted[0];

  if (!equ) {
    return false;
  }

  await insteadEquipment(userId, equ);
  const img = await getEquipmentImage(e);
  const Send = useSend(e);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));

    return true;
  }

  void Send(Text('图片加载失败'));

  return true;
};
