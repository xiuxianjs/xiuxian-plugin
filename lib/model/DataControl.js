import { __PATH } from './paths.js';
import { redis } from '../api/api.js';

const filePathMap = {
    player: __PATH.player_path,
    equipment: __PATH.equipment_path,
    najie: __PATH.najie_path,
    lib: __PATH.lib_path,
    Timelimit: __PATH.Timelimit,
    Level: __PATH.Level,
    association: __PATH.association,
    occupation: __PATH.occupation
};
const existDataByPath = (key, from, name) => {
    const dir = `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`;
    return redis.exists(dir);
};
const readDataByPath = async (key, from, name) => {
    try {
        const data = await redis.get(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`);
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('读取文件错误：' + error);
        return null;
    }
};
const writeDataByPath = (key, from, name, data) => {
    redis.set(`${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`, JSON.stringify(data));
};
class DataControl {
    async existData(file_path_type, file_name) {
        const res = await redis.exists(`${filePathMap[file_path_type]}:${file_name}`);
        return res === 1;
    }
    async getData(file_name, user_qq) {
        if (user_qq) {
            const data = await redis.get(`${filePathMap[file_name]}:${user_qq}`);
            return data ? JSON.parse(data) : null;
        }
        else {
            const data = await redis.get(`${filePathMap[file_name]}`);
            return data ? JSON.parse(data) : null;
        }
    }
    setData(file_name, user_qq, data) {
        redis.set(`${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`, JSON.stringify(data));
        return;
    }
}
var DataControl$1 = new DataControl();

export { DataControl$1 as default, existDataByPath, readDataByPath, writeDataByPath };
