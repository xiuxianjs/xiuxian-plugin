import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';

import { getIoRedis } from '@alemonjs/db';
import { __PATH, keys } from '@src/model/keys';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';

const redis = getIoRedis();

// 获取玩家背包列表（支持分页）
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    // 获取参数
    const page = parseInt(ctx.request.query.page as string) || 1;
    const pageSize = parseInt(ctx.request.query.pageSize as string) || 20;
    const search = (ctx.request.query.search as string) || '';
    const category = (ctx.request.query.category as string) || 'all';
    const stats = ctx.request.query.stats === 'true';

    const najieList: any[] = [];
    let total = 0;

    // 使用SCAN命令获取所有背包keys
    const scanPattern = `${__PATH.najie_path}:*`;
    let cursor = 0;
    const allKeys: string[] = [];

    do {
      const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);

      cursor = parseInt(result[0]);
      allKeys.push(...result[1]);
    } while (cursor !== 0);

    // 如果需要搜索或分类筛选，需要遍历所有数据
    if (search || category !== 'all') {
      for (const key of allKeys) {
        const userId = key.replace(`${__PATH.najie_path}:`, '');
        const najieData = await redis.get(key);

        if (najieData) {
          try {
            // 先尝试解码URI
            const najie = JSON.parse(najieData);
            const najieWithId = {
              userId,
              ...najie
            };

            // 应用搜索过滤
            const matchesSearch = !search || userId.includes(search);

            // 应用分类过滤
            const matchesCategory = category === 'all' || najie[category];

            if (matchesSearch && matchesCategory) {
              total++;
              // 只添加当前页的数据
              const startIndex = (page - 1) * pageSize;

              if (najieList.length < pageSize && total > startIndex) {
                najieList.push(najieWithId);
              }
            }
          } catch (error) {
            logger.error(`解析背包数据失败 ${userId}:`, error);

            // 添加损坏的数据到正常列表，但内容为空，显示原始JSON
            const corruptedNajie = {
              userId,
              灵石: 0,
              装备: [],
              丹药: [],
              道具: [],
              功法: [],
              草药: [],
              材料: [],
              仙宠: [],
              仙宠口粮: [],
              数据状态: 'corrupted',
              原始数据: najieData,
              错误信息: error.message
            };

            // 应用搜索过滤
            const matchesSearch = !search || userId.includes(search);

            // 应用分类过滤（损坏数据默认匹配所有分类）
            const matchesCategory = category === 'all' || true;

            if (matchesSearch && matchesCategory) {
              total++;
              // 只添加当前页的数据
              const startIndex = (page - 1) * pageSize;

              if (najieList.length < pageSize && total > startIndex) {
                najieList.push(corruptedNajie);
              }
            }
          }
        }
      }
    } else {
      // 无搜索和筛选，直接分页获取数据
      total = allKeys.length;

      // 计算分页范围
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedKeys = allKeys.slice(startIndex, endIndex);

      // 只获取当前页的数据
      for (const key of paginatedKeys) {
        const userId = key.replace(`${__PATH.najie_path}:`, '');
        const najieData = await redis.get(key);

        if (najieData) {
          try {
            // 先尝试解码URI
            const najie = JSON.parse(najieData);
            const najieWithId = {
              userId,
              ...najie
            };

            najieList.push(najieWithId);
          } catch (error) {
            logger.error(`解析背包数据失败 ${userId}:`, error);

            // 添加损坏的数据到正常列表，但内容为空，显示原始JSON
            const corruptedNajie = {
              userId,
              灵石: 0,
              装备: [],
              丹药: [],
              道具: [],
              功法: [],
              草药: [],
              材料: [],
              仙宠: [],
              仙宠口粮: [],
              数据状态: 'corrupted',
              原始数据: najieData,
              错误信息: error.message
            };

            najieList.push(corruptedNajie);
            total++;
          }
        }
      }
    }

    // 如果是统计请求，返回统计信息
    if (stats) {
      let totalLingshi = 0;
      let totalItems = 0;
      const categoryStats = {
        装备: 0,
        丹药: 0,
        道具: 0,
        功法: 0,
        草药: 0,
        材料: 0,
        仙宠: 0,
        仙宠口粮: 0
      };

      // 遍历所有数据计算统计信息
      for (const key of allKeys) {
        const userId = key.replace(`${__PATH.najie_path}:`, '');
        const najieData = await redis.get(key);

        if (najieData) {
          try {
            const najie = JSON.parse(najieData);

            // 应用搜索过滤
            const matchesSearch = !search || userId.includes(search);

            if (matchesSearch) {
              totalLingshi += najie.灵石 || 0;

              // 统计各类物品数量
              Object.keys(categoryStats).forEach(cat => {
                if (Array.isArray(najie[cat])) {
                  categoryStats[cat] += najie[cat].length;
                  totalItems += najie[cat].length;
                }
              });
            }
          } catch (error) {
            logger.error(`解析背包数据失败 ${userId}:`, error);
          }
        }
      }

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '获取统计信息成功',
        data: {
          total,
          totalLingshi,
          totalItems,
          categoryStats
        }
      };

      return;
    }

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取背包列表成功',
      data: {
        list: najieList,
        pagination: {
          current: page,
          pageSize: pageSize,
          total: total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    logger.error('获取背包列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 获取单个玩家背包详情
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { userId } = body as { userId?: string };

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    const najie = await getDataJSONParseByKey(keys.najie(userId));

    if (!najie) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '背包不存在',
        data: null
      };

      return;
    }

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取背包详情成功',
      data: {
        userId,
        ...(typeof najie === 'object' ? najie : {})
      }
    };
  } catch (error) {
    logger.error('获取背包详情错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 更新背包数据
export const PUT = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { userId, 灵石, 灵石上限, 等级, 装备, 丹药, 道具, 功法, 草药, 材料, 仙宠, 仙宠口粮 } = body as {
      userId: string;
      [key: string]: unknown;
    };

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    // 构建背包数据
    const najieData = {
      灵石: 灵石 || 0,
      灵石上限: 灵石上限 || 0,
      等级: 等级 || 1,
      装备: Array.isArray(装备) ? 装备 : [],
      丹药: Array.isArray(丹药) ? 丹药 : [],
      道具: Array.isArray(道具) ? 道具 : [],
      功法: Array.isArray(功法) ? 功法 : [],
      草药: Array.isArray(草药) ? 草药 : [],
      材料: Array.isArray(材料) ? 材料 : [],
      仙宠: Array.isArray(仙宠) ? 仙宠 : [],
      仙宠口粮: Array.isArray(仙宠口粮) ? 仙宠口粮 : []
    };

    // 保存到Redis
    await setDataJSONStringifyByKey(keys.najie(userId), najieData);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '背包更新成功',
      data: {
        userId,
        ...najieData
      }
    };
  } catch (error) {
    logger.error('更新背包数据错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
