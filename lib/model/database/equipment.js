import { migrate } from './versionManage.js';

const defaultsEquipment = {
    version: 1,
    value: {}
};
const versions = {
    0: oldData => {
        const { version: _, ...rest } = oldData;
        return {
            value: rest,
            version: 1
        };
    }
};
const parsePlayerData = (dataStr) => {
    return migrate(dataStr, defaultsEquipment, versions).value;
};

export { parsePlayerData };
