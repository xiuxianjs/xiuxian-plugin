import { getIoRedis } from '@alemonjs/db';
import { __PATH } from './paths.js';

async function getAssociation(file_name) {
    const redis = getIoRedis();
    const data = await redis.get(`${__PATH.association}:${file_name}`);
    if (!data) {
        return 'error';
    }
    try {
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('读取文件错误：' + error);
        return 'error';
    }
}
async function setAssociation(file_name, data) {
    const redis = getIoRedis();
    await redis.set(`${__PATH.association}:${file_name}`, JSON.stringify(data));
    return;
}
var Association = {
    getAssociation,
    setAssociation
};

export { Association as default };
