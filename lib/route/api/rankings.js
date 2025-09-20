import { validatePermission, Permission } from '../core/auth.js';
import { keysByPath, __PATH, keys } from '../../model/keys.js';
import '../../model/api.js';
import { getDataJSONParseByKey } from '../../model/DataControl.js';
import '@alemonjs/db';
import 'alemonjs';
import 'dayjs';
import { readPlayer } from '../../model/xiuxiandata.js';
import { getDataList } from '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { TiandibangTask } from '../../task/ranking/Tiandibang.js';

const GET = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_RANKINGS]);
        if (!res) {
            return;
        }
        const type = ctx.request.query.type;
        const limit = parseInt(ctx.request.query.limit) || 10;
        if (!type) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '排名类型不能为空',
                data: null
            };
            return;
        }
        let rankingData = [];
        switch (type) {
            case 'ASSOCIATION_POWER': {
                const associationList = await keysByPath(__PATH.association);
                for (const assName of associationList) {
                    const ass = await getDataJSONParseByKey(keys.association(assName));
                    if (ass) {
                        const power = ass.power ?? 0;
                        const level = ass.宗门等级 ?? 1;
                        const members = ass.所有成员?.length ?? 0;
                        const lingshi = ass.宗门灵石池 ?? 0;
                        const totalPower = level * 1000 + members * 100 + Math.floor(lingshi / 10000) + (power === 1 ? 5000 : 0);
                        rankingData.push({
                            id: assName,
                            name: ass.宗门名称 || assName,
                            value: totalPower,
                            extra: {
                                level,
                                members,
                                lingshi,
                                power: power === 1 ? '仙界' : '凡界'
                            }
                        });
                    }
                }
                break;
            }
            case 'ASSOCIATION_MEMBERS': {
                const associationList = await keysByPath(__PATH.association);
                for (const assName of associationList) {
                    const ass = await getDataJSONParseByKey(keys.association(assName));
                    if (ass) {
                        const members = ass.所有成员?.length || 0;
                        rankingData.push({
                            id: assName,
                            name: ass.宗门名称 || assName,
                            value: members,
                            extra: {
                                level: ass.宗门等级 || 1,
                                power: ass.power === 1 ? '仙界' : '凡界'
                            }
                        });
                    }
                }
                break;
            }
            case 'ASSOCIATION_LINGSHI': {
                const associationList = await keysByPath(__PATH.association);
                for (const assName of associationList) {
                    const ass = await getDataJSONParseByKey(keys.association(assName));
                    if (ass) {
                        const lingshi = ass.宗门灵石池 || 0;
                        rankingData.push({
                            id: assName,
                            name: ass.宗门名称 || assName,
                            value: lingshi,
                            extra: {
                                level: ass.宗门等级 || 1,
                                members: ass.所有成员?.length || 0
                            }
                        });
                    }
                }
                break;
            }
            case 'ASSOCIATION_LEVEL': {
                const associationList = await keysByPath(__PATH.association);
                for (const assName of associationList) {
                    const ass = await getDataJSONParseByKey(keys.association(assName));
                    if (ass) {
                        const level = ass.宗门等级 || 1;
                        rankingData.push({
                            id: assName,
                            name: ass.宗门名称 || assName,
                            value: level,
                            extra: {
                                members: ass.所有成员?.length || 0,
                                power: ass.power === 1 ? '仙界' : '凡界'
                            }
                        });
                    }
                }
                break;
            }
            case 'PLAYER_LEVEL': {
                const playerList = await keysByPath(__PATH.player_path);
                for (const qq of playerList) {
                    const player = await readPlayer(qq);
                    if (player) {
                        const levelList = await getDataList('Level1');
                        const level = levelList.find(item => item.level_id === player.level_id);
                        rankingData.push({
                            id: qq,
                            name: player.名号 || `玩家${qq}`,
                            value: player.level_id || 0,
                            extra: {
                                level: level?.level || '未知',
                                exp: player.修为 || 0
                            }
                        });
                    }
                }
                break;
            }
            case 'PLAYER_ATTACK': {
                const playerList = await keysByPath(__PATH.player_path);
                for (const qq of playerList) {
                    const player = await readPlayer(qq);
                    if (player) {
                        const attack = player.攻击 || 0;
                        rankingData.push({
                            id: qq,
                            name: player.名号 || `玩家${qq}`,
                            value: attack,
                            extra: {
                                level: player.level_id || 0,
                                defense: player.防御 || 0
                            }
                        });
                    }
                }
                break;
            }
            case 'PLAYER_DEFENSE': {
                const playerList = await keysByPath(__PATH.player_path);
                for (const qq of playerList) {
                    const player = await readPlayer(qq);
                    if (player) {
                        const defense = player.防御 || 0;
                        rankingData.push({
                            id: qq,
                            name: player.名号 || `玩家${qq}`,
                            value: defense,
                            extra: {
                                level: player.level_id || 0,
                                attack: player.攻击 || 0
                            }
                        });
                    }
                }
                break;
            }
            default:
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    message: '不支持的排名类型',
                    data: null
                };
                return;
        }
        rankingData.sort((a, b) => b.value - a.value);
        rankingData = rankingData.slice(0, limit).map((item, index) => ({
            ...item,
            rank: index + 1
        }));
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取排名数据成功',
            data: rankingData
        };
    }
    catch (error) {
        logger.error('获取排名数据错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const POST = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_RANKINGS]);
        if (!res) {
            return;
        }
        const playerKeys = await keysByPath(__PATH.player_path);
        const associationKeys = await keysByPath(__PATH.association);
        const playerCount = playerKeys.length;
        const associationCount = associationKeys.length;
        const topPlayers = [];
        for (const qq of playerKeys) {
            const player = await readPlayer(qq);
            if (player) {
                topPlayers.push({
                    id: qq,
                    name: player.名号 || `玩家${qq}`,
                    value: player.level_id || 0,
                    rank: 0,
                    extra: {
                        exp: player.修为 || 0,
                        attack: player.攻击 || 0,
                        defense: player.防御 || 0
                    }
                });
            }
        }
        topPlayers.sort((a, b) => b.value - a.value);
        topPlayers.slice(0, 10).forEach((player, index) => {
            player.rank = index + 1;
        });
        const topAssociations = [];
        for (const assName of associationKeys) {
            const ass = await getDataJSONParseByKey(keys.association(assName));
            if (ass) {
                const power = ass.power || 0;
                const level = ass.宗门等级 || 1;
                const members = ass.所有成员?.length || 0;
                const lingshi = ass.宗门灵石池 || 0;
                const totalPower = level * 1000 + members * 100 + Math.floor(lingshi / 10000) + (power === 1 ? 5000 : 0);
                topAssociations.push({
                    id: assName,
                    name: ass.宗门名称 || assName,
                    value: totalPower,
                    rank: 0,
                    extra: {
                        level,
                        members,
                        lingshi,
                        power: power === 1 ? '仙界' : '凡界'
                    }
                });
            }
        }
        topAssociations.sort((a, b) => b.value - a.value);
        topAssociations.slice(0, 10).forEach((ass, index) => {
            ass.rank = index + 1;
        });
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取排名统计成功',
            data: {
                lastUpdate: new Date().toISOString(),
                playerCount,
                associationCount,
                topPlayers: topPlayers.slice(0, 10),
                topAssociations: topAssociations.slice(0, 10)
            }
        };
    }
    catch (error) {
        logger.error('获取排名统计错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const PUT = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.GAME_RANKINGS]);
        if (!res) {
            return;
        }
        TiandibangTask();
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '排名计算已触发',
            data: {
                timestamp: new Date().toISOString()
            }
        };
    }
    catch (error) {
        logger.error('触发排名计算错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
