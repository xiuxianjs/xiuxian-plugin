import { defaultsDeep } from 'lodash-es';

function parseWithDefaults(jsonStr, defaults) {
    let data = {};
    try {
        data = JSON.parse(jsonStr);
    }
    catch (e) {
        logger.warn('解析数据失败', jsonStr, e);
        return defaults;
    }
    return defaultsDeep(data, defaults);
}
function migrate(jsonStr, defaults, callbacks) {
    const oldData = parseWithDefaults(jsonStr, defaults);
    const version = oldData.version ?? 0;
    let curData = oldData;
    for (let v = version;; v++) {
        const callback = callbacks[v];
        if (!callback) {
            break;
        }
        curData = callback(curData);
    }
    return curData;
}

export { migrate, parseWithDefaults };
