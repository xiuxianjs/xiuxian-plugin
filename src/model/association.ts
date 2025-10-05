import { getDataList } from './DataList';
import { 宗门人数上限 } from './index';
import type { Player } from '@src/types/player';
import type { ZongMen } from '@src/types/ass';

/**
 * 宗门加入检查结果
 */
export interface AssociationJoinCheckResult {
  success: boolean;
  message?: string;
  levelEntry?: any;
}

/**
 * 检查玩家是否可以加入宗门
 * @param player 玩家数据
 * @param association 宗门数据
 * @param playerName 玩家名号（用于错误提示）
 * @returns 检查结果
 */
export async function checkPlayerCanJoinAssociation(player: Player, association: ZongMen, playerName?: string): Promise<AssociationJoinCheckResult> {
  const name = playerName || '该玩家';

  // 获取玩家当前境界信息
  const levelList = await getDataList('Level1');
  const levelEntry = levelList.find((item: { level_id: number }) => item.level_id === player.level_id);

  if (!levelEntry) {
    return {
      success: false,
      message: `${name}境界数据缺失`
    };
  }

  const nowLevelId = levelEntry.level_id;

  // 检查仙界/凡界匹配
  if (nowLevelId >= 42 && association.power === 0) {
    return {
      success: false,
      message: `${name}已是仙人，无法加入凡界宗门`
    };
  }

  if (nowLevelId < 42 && association.power === 1) {
    return {
      success: false,
      message: `${name}还未飞升仙界，无法加入仙界宗门`
    };
  }

  // 检查是否满足最低加入境界要求
  const minLevelId = Number(association.最低加入境界 || 0);

  if (minLevelId > nowLevelId) {
    const minLevelEntry = levelList.find((item: { level_id: number }) => item.level_id === minLevelId);
    const minLevel = minLevelEntry?.level ?? '未知境界';

    return {
      success: false,
      message: `${name}当前境界未达到宗门要求(需要${minLevel})`
    };
  }

  // 检查宗门人数上限
  const members = Array.isArray(association.所有成员) ? association.所有成员 : [];
  const guildLevel = Number(association.宗门等级 ?? 1);
  const capIndex = Math.max(0, Math.min(宗门人数上限.length - 1, guildLevel - 1));
  const maxMembers = 宗门人数上限[capIndex];
  const currentMembers = members.length;

  if (maxMembers <= currentMembers) {
    return {
      success: false,
      message: `${association.宗门名称}的弟子人数已经达到目前等级最大,无法加入`
    };
  }

  return {
    success: true,
    levelEntry
  };
}
