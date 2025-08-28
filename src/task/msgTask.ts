import { pushInfo } from '@src/model/api';
// 细粒度导入避免 barrel 循环
import { readTemp, writeTemp } from '@src/model/temp';
import type { TempMessage } from '@src/types';
import { screenshot } from '@src/image';

/**
 * 读取临时消息（temp）列表，按群分组整理消息。
 * 对每个群，将该群的所有临时消息合并，生成截图图片。
 * 通过 pushInfo 方法将截图推送到对应群。
 * 推送完成后，清空临时消息记录。
 */
export const MsgTask = async () => {
  let temp: TempMessage[] = [];

  try {
    temp = await readTemp();
  } catch {
    await writeTemp([]);
  }
  if (temp.length > 0) {
    const group: string[] = [];

    group.push(temp[0].qq_group);
    f1: for (const i of temp) {
      for (const j of group) {
        if (i.qq_group === j) {
          continue f1;
        }
      }
      group.push(i.qq_group);
    }
    for (const i of group) {
      const msg: string[] = [];

      for (const j of temp) {
        if (i === j.qq_group) {
          msg.push(j.msg);
        }
      }
      const temp_data = { temp: msg };

      const img = await screenshot('temp', i, temp_data);

      if (img) {
        pushInfo(i, true, img);
      }
    }
    await writeTemp([]);
  }
};
