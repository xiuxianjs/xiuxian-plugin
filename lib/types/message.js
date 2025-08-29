var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["UNREAD"] = 0] = "UNREAD";
    MessageStatus[MessageStatus["READ"] = 1] = "READ";
    MessageStatus[MessageStatus["DELETED"] = 2] = "DELETED";
})(MessageStatus || (MessageStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["SYSTEM"] = "system";
    MessageType["ANNOUNCEMENT"] = "announcement";
    MessageType["REWARD"] = "reward";
    MessageType["ACTIVITY"] = "activity";
    MessageType["PERSONAL"] = "personal";
})(MessageType || (MessageType = {}));
var MessagePriority;
(function (MessagePriority) {
    MessagePriority[MessagePriority["LOW"] = 1] = "LOW";
    MessagePriority[MessagePriority["NORMAL"] = 2] = "NORMAL";
    MessagePriority[MessagePriority["HIGH"] = 3] = "HIGH";
    MessagePriority[MessagePriority["URGENT"] = 4] = "URGENT";
})(MessagePriority || (MessagePriority = {}));

export { MessagePriority, MessageStatus, MessageType };
