import { postLogCommand, COMMAND_NAME } from '../model/posthog.js';

const selects = onSelects([
    'message.create',
    'private.message.create',
    'private.interaction.create',
    'interaction.create'
]);
var mw = onResponse(selects, async (e) => {
    postLogCommand({
        id: e.UserId,
        value: e.MessageText,
        name: COMMAND_NAME.HELP,
        ext: {
            username: e.UserName
        }
    });
    return true;
});

export { mw as default, selects };
