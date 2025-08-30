import { addNajieThing, playerEfficiency, readPlayer, writePlayer } from '@src/model';
import { Text } from 'alemonjs';

// 学习处理主函数
export const handleStudy = async (userId: string, thingName: string, message: any): Promise<boolean> => {
  const nowPlayer = await readPlayer(userId);

  if (!nowPlayer) {
    return false;
  }
  const islearned = nowPlayer.学习的功法.find(item => item === thingName);

  if (islearned) {
    void message.send(format(Text('你已经学过该功法了')));

    return false;
  }
  await addNajieThing(userId, thingName, '功法', -1);

  nowPlayer.学习的功法.push(thingName);
  await writePlayer(userId, nowPlayer);
  await playerEfficiency(userId);

  void message.send(format(Text(`你学会了${thingName},可以在【#我的炼体】中查看`)));

  return true;
};
