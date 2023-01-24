class UserAction {
    /**
     * 
     * @param {e, data} parameter 
     * @returns 
     */
    forwardMsg = async (parameter) => {
        const { e, data } = parameter
        if (data.length == 1) {
            await e.reply(data[0])
            return
        }
        const msgList = []
        for (let item of data) {
            msgList.push({
                message: item,
                nickname: Bot.nickname,
                user_id: Bot.uin,
            })
        }
        await e.reply(await Bot.makeForwardMsg(msgList))
        return
    }
    /**
    * 艾特并返回QQ
    */
    at = async (parameter) => {
        const { e } = parameter
        if (!e.message.some((item) => item.type === 'at')) {
            return false
        }
        const atItem = e.message.filter((item) => item.type === 'at')
        if (atItem[0]['qq']) {
            return atItem[0]['qq']
        }
        return false
    }

    /**
     *测回消息
     * @param {e,isreply} parameter 
     * @returns 
     */
    surveySet = async (parameter) => {
        const { e, isreply } = parameter
        if (!e.group) {
            return
        }
        const timeout = 30
        if (timeout > 0 && isreply && isreply.message_id) {
            setTimeout(async () => {
                await e.group.recallMsg(isreply.message_id)
            }, timeout * 1000)
        }
    }
}
export default new UserAction()