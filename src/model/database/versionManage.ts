import { defaultsDeep } from 'lodash-es';

/**
 * 更安全的解析，并且填充默认值
 */
export function parseWithDefaults<T>(jsonStr: string, defaults: T): T {
  let data = {};

  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    logger.warn('解析数据失败', jsonStr, e);

    return defaults;
  }

  // 如果解析出来的数据，缺少默认值，则进行填充
  return defaultsDeep(data, defaults);
}

/**
 * 迁移数据到新版本
 */
export function migrate<T extends { version: number }>(jsonStr: string, defaults: T, callbacks: { [version: number]: (oldData: T) => T }): T {
  // 得到旧数据
  const oldData = parseWithDefaults(jsonStr, defaults);
  // 查询是否有版本。没有版本则视为 0 版本
  const version = oldData.version ?? 0;

  // 记录当前数据
  let curData = oldData;

  for (let v = version; ; v++) {
    const callback = callbacks[v];

    // 如果没有迁移函数，表示已经是最新版本
    if (!callback) {
      break;
    }

    // 进行迁移
    curData = callback(curData);
  }

  return curData;
}
