import { pushInfo } from '../model/api.js';
import { readTemp, writeTemp } from '../model/temp.js';
import { screenshot } from '../image/index.js';

const getUniqueGroupIds = (tempMessages) => {
    const groupIds = new Set();
    for (const message of tempMessages) {
        if (message.qq_group) {
            groupIds.add(message.qq_group);
        }
    }
    return Array.from(groupIds);
};
const groupMessagesByGroupId = (tempMessages, groupIds) => {
    const groupedMessages = [];
    for (const groupId of groupIds) {
        const messages = tempMessages.filter(message => message.qq_group === groupId).map(message => message.msg);
        groupedMessages.push({
            groupId,
            messages
        });
    }
    return groupedMessages;
};
const processGroupMessages = async (groupMessage) => {
    try {
        const { groupId, messages } = groupMessage;
        if (messages.length === 0) {
            return false;
        }
        const tempData = { temp: messages };
        const img = await screenshot('temp', groupId, tempData);
        if (!img) {
            return false;
        }
        pushInfo(groupId, true, img);
        return true;
    }
    catch (error) {
        logger.error(error);
        return false;
    }
};
const processAllGroupMessages = async (groupedMessages) => {
    let processedGroups = 0;
    let errorCount = 0;
    for (const groupMessage of groupedMessages) {
        try {
            const success = await processGroupMessages(groupMessage);
            if (success) {
                processedGroups++;
            }
            else {
                errorCount++;
            }
        }
        catch (error) {
            logger.error(error);
            errorCount++;
        }
    }
    return {
        success: processedGroups > 0,
        processedGroups,
        errorCount
    };
};
const MsgTask = async () => {
    try {
        const tempMessages = await readTemp();
        if (!tempMessages || tempMessages.length === 0) {
            return;
        }
        const groupIds = getUniqueGroupIds(tempMessages);
        if (groupIds.length === 0) {
            return;
        }
        const groupedMessages = groupMessagesByGroupId(tempMessages, groupIds);
        await processAllGroupMessages(groupedMessages);
        await writeTemp([]);
    }
    catch (error) {
        logger.error(error);
    }
};

export { MsgTask };
