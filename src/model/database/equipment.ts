import { migrate } from './versionManage';

const defaultsEquipment = {
  version: 1,
  value: {}
};

export type Equipment = typeof defaultsEquipment;

const versions = {
  0: oldData => {
    const { version: _, ...rest } = oldData;

    return {
      value: rest,
      version: 1
    };
  }
};

/**
 * 解析玩家数据
 * @param dataStr
 * @returns
 */
export const parsePlayerData = (dataStr: string): Equipment['value'] => {
  return migrate(dataStr, defaultsEquipment, versions).value;
};
