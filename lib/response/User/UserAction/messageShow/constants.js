const CD_MS = 5 * 1000;
const MESSAGE_TYPE_MAP = {
    system: '系统消息',
    announcement: '公告',
    reward: '奖励通知',
    activity: '活动通知',
    personal: '个人消息'
};
const PRIORITY_MAP = {
    1: '低',
    2: '普通',
    3: '高',
    4: '紧急'
};
const STATUS_MAP = {
    0: '未读',
    1: '已读',
    2: '已删除'
};
const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 5
};

export { CD_MS, MESSAGE_TYPE_MAP, PAGINATION_CONFIG, PRIORITY_MAP, STATUS_MAP };
