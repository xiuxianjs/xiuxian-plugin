import { useSend, Image, Text } from 'alemonjs';
import { insteadEquipment } from '../../../../model/najie.js';
import { getEquipmentImage } from '../../../../model/image.js';

const handleEquipment = async (userId, thingName, pinji, najie, e) => {
    const findItem = najie.装备.find((i) => i.name === thingName && (i?.pinji ?? 0) === (pinji ?? 0));
    const sorted = najie.装备.filter((i) => i.name === thingName).sort((a, b) => (b.pinji ?? 0) - (a.pinji ?? 0));
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

export { handleEquipment };
