import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';
import { __PATH, keys, keysByPath } from '@src/model/keys';
import { readPlayer } from '@src/model';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { TiandibangTask } from '@src/task/ranking/Tiandibang';

// 获取排名数据
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    // 获取参数
    const type = ctx.request.query.type as string;
    const limit = parseInt(ctx.request.query.limit as string) || 10;

    if (!type) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '排名类型不能为空',
        data: null
      };

      return;
    }

    let rankingData: Array<{
      id: string;
      name: string;
      value: number;
      extra?: Record<string, unknown>;
    }> = [];

    switch (type) {
      case 'ASSOCIATION_POWER': {
        // 宗门综合实力排名
        const associationList = await keysByPath(__PATH.association);

        for (const assName of associationList) {
          const ass = await getDataJSONParseByKey(keys.association(assName));

          if (ass) {
            const power = ass.power ?? 0;
            const level = ass.宗门等级 ?? 1;
            const members = ass.所有成员?.length ?? 0;
            const lingshi = ass.宗门灵石池 ?? 0;

            // 综合实力计算：等级 * 1000 + 成员数 * 100 + 灵石池 / 10000 + 仙界加成
            const totalPower = level * 1000 + members * 100 + Math.floor(lingshi / 10000) + (power === 1 ? 5000 : 0);

            rankingData.push({
              id: assName,
              name: ass.宗门名称 || assName,
              value: totalPower,
              extra: {
                level,
                members,
                lingshi,
                power: power === 1 ? '仙界' : '凡界'
              }
            });
          }
        }
        break;
      }

      case 'ASSOCIATION_MEMBERS': {
        // 宗门成员数排名
        const associationList = await keysByPath(__PATH.association);

        for (const assName of associationList) {
          const ass = await getDataJSONParseByKey(keys.association(assName));

          if (ass) {
            const members = ass.所有成员?.length || 0;

            rankingData.push({
              id: assName,
              name: ass.宗门名称 || assName,
              value: members,
              extra: {
                level: ass.宗门等级 || 1,
                power: ass.power === 1 ? '仙界' : '凡界'
              }
            });
          }
        }
        break;
      }

      case 'ASSOCIATION_LINGSHI': {
        // 宗门灵石池排名
        const associationList = await keysByPath(__PATH.association);

        for (const assName of associationList) {
          const ass = await getDataJSONParseByKey(keys.association(assName));

          if (ass) {
            const lingshi = ass.宗门灵石池 || 0;

            rankingData.push({
              id: assName,
              name: ass.宗门名称 || assName,
              value: lingshi,
              extra: {
                level: ass.宗门等级 || 1,
                members: ass.所有成员?.length || 0
              }
            });
          }
        }
        break;
      }

      case 'ASSOCIATION_LEVEL': {
        // 宗门等级排名
        const associationList = await keysByPath(__PATH.association);

        for (const assName of associationList) {
          const ass = await getDataJSONParseByKey(keys.association(assName));

          if (ass) {
            const level = ass.宗门等级 || 1;

            rankingData.push({
              id: assName,
              name: ass.宗门名称 || assName,
              value: level,
              extra: {
                members: ass.所有成员?.length || 0,
                power: ass.power === 1 ? '仙界' : '凡界'
              }
            });
          }
        }
        break;
      }

      case 'PLAYER_LEVEL': {
        // 玩家境界排名
        const playerList = await keysByPath(__PATH.player_path);

        for (const qq of playerList) {
          const player = await readPlayer(qq);

          if (player) {
            const levelList = await getDataList('Level1');
            const level = levelList.find(item => item.level_id === player.level_id);

            rankingData.push({
              id: qq,
              name: player.名号 || `玩家${qq}`,
              value: player.level_id || 0,
              extra: {
                level: level?.level || '未知',
                exp: player.修为 || 0
              }
            });
          }
        }
        break;
      }

      case 'PLAYER_ATTACK': {
        // 玩家攻击力排名
        const playerList = await keysByPath(__PATH.player_path);

        for (const qq of playerList) {
          const player = await readPlayer(qq);

          if (player) {
            const attack = player.攻击 || 0;

            rankingData.push({
              id: qq,
              name: player.名号 || `玩家${qq}`,
              value: attack,
              extra: {
                level: player.level_id || 0,
                defense: player.防御 || 0
              }
            });
          }
        }
        break;
      }

      case 'PLAYER_DEFENSE': {
        // 玩家防御力排名
        const playerList = await keysByPath(__PATH.player_path);

        for (const qq of playerList) {
          const player = await readPlayer(qq);

          if (player) {
            const defense = player.防御 || 0;

            rankingData.push({
              id: qq,
              name: player.名号 || `玩家${qq}`,
              value: defense,
              extra: {
                level: player.level_id || 0,
                attack: player.攻击 || 0
              }
            });
          }
        }
        break;
      }

      default:
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '不支持的排名类型',
          data: null
        };

        return;
    }

    // 按数值降序排序
    rankingData.sort((a, b) => b.value - a.value);

    // 添加排名
    rankingData = rankingData.slice(0, limit).map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取排名数据成功',
      data: rankingData
    };
  } catch (error) {
    logger.error('获取排名数据错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 获取排名统计信息
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    // 获取统计数据
    const playerKeys = await keysByPath(__PATH.player_path);
    const associationKeys = await keysByPath(__PATH.association);

    const playerCount = playerKeys.length;
    const associationCount = associationKeys.length;

    // 获取顶级玩家数据
    const topPlayers: Array<{
      id: string;
      name: string;
      value: number;
      rank: number;
      extra?: Record<string, unknown>;
    }> = [];

    for (const qq of playerKeys) {
      const player = await readPlayer(qq);

      if (player) {
        topPlayers.push({
          id: qq,
          name: player.名号 || `玩家${qq}`,
          value: player.level_id || 0,
          rank: 0,
          extra: {
            exp: player.修为 || 0,
            attack: player.攻击 || 0,
            defense: player.防御 || 0
          }
        });
      }
    }

    // 按境界排序
    topPlayers.sort((a, b) => b.value - a.value);
    topPlayers.slice(0, 10).forEach((player, index) => {
      player.rank = index + 1;
    });

    // 获取顶级宗门数据
    const topAssociations: Array<{
      id: string;
      name: string;
      value: number;
      rank: number;
      extra?: Record<string, unknown>;
    }> = [];

    for (const assName of associationKeys) {
      const ass = await getDataJSONParseByKey(keys.association(assName));

      if (ass) {
        const power = ass.power || 0;
        const level = ass.宗门等级 || 1;
        const members = ass.所有成员?.length || 0;
        const lingshi = ass.宗门灵石池 || 0;

        const totalPower = level * 1000 + members * 100 + Math.floor(lingshi / 10000) + (power === 1 ? 5000 : 0);

        topAssociations.push({
          id: assName,
          name: ass.宗门名称 || assName,
          value: totalPower,
          rank: 0,
          extra: {
            level,
            members,
            lingshi,
            power: power === 1 ? '仙界' : '凡界'
          }
        });
      }
    }

    // 按综合实力排序
    topAssociations.sort((a, b) => b.value - a.value);
    topAssociations.slice(0, 10).forEach((ass, index) => {
      ass.rank = index + 1;
    });

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取排名统计成功',
      data: {
        lastUpdate: new Date().toISOString(),
        playerCount,
        associationCount,
        topPlayers: topPlayers.slice(0, 10),
        topAssociations: topAssociations.slice(0, 10)
      }
    };
  } catch (error) {
    logger.error('获取排名统计错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 手动触发排名计算
export const PUT = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    TiandibangTask();

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '排名计算已触发',
      data: {
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logger.error('触发排名计算错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
