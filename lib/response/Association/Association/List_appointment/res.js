import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import { 宗门人数上限 as ______ } from '../../../../model/settions.js';
import { screenshot } from '../../../../image/index.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?宗门列表$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return;
    }
    const assList = await keysByPath(__PATH.association);
    if (assList.length === 0) {
        void Send(Text('暂时没有宗门数据'));
        return;
    }
    const temp = [];
    await Promise.all(assList.map(async (associationName) => {
        const ass = await getDataJSONParseByKey(keys.association(associationName));
        if (!ass) {
            return;
        }
        const this_ass = ass;
        const baseLevel = Number(this_ass.宗门等级 ?? 1);
        let this_ass_xiuxian = 0;
        const baseEff = baseLevel * 0.05 * 100;
        if (!this_ass.宗门驻地 || this_ass.宗门驻地 === 0) {
            this_ass_xiuxian = baseEff;
        }
        else {
            const blessData = await getDataList('Bless');
            const dongTan = (blessData || []).find(item => item.name === this_ass.宗门驻地);
            const addEff = dongTan && typeof dongTan.efficiency === 'number' ? dongTan.efficiency * 100 : 5;
            this_ass_xiuxian = baseEff + addEff;
        }
        this_ass_xiuxian = Math.trunc(this_ass_xiuxian);
        const shenshou = this_ass.宗门神兽 && this_ass.宗门神兽 !== 0 ? this_ass.宗门神兽 : '暂无';
        const zhudi = this_ass.宗门驻地 && this_ass.宗门驻地 !== 0 ? this_ass.宗门驻地 : '暂无';
        const power = this_ass.power === 0 ? '凡界' : '仙界';
        const minLevelId = Number(this_ass.最低加入境界 ?? 0);
        const levelListData = await getDataList('Level1');
        const levelItem = levelListData.find(item => item.level_id === minLevelId);
        const levelText = levelItem ? levelItem.level : '未知';
        const memberList = Array.isArray(this_ass.所有成员) ? this_ass.所有成员 : [];
        const capIndex = Math.max(0, Math.min(______.length - 1, baseLevel - 1));
        const arr = {
            宗名: this_ass.宗门名称 || associationName,
            人数: memberList.length,
            宗门人数上限: ______[capIndex],
            位置: power,
            等级: baseLevel,
            天赋加成: this_ass_xiuxian,
            宗门建设等级: this_ass.宗门建设等级 ?? 0,
            镇宗神兽: shenshou,
            宗门驻地: zhudi,
            最低加入境界: levelText,
            宗主: this_ass.宗主 || '未知'
        };
        temp.push(arr);
    }));
    if (temp.length === 0) {
        void Send(Text('暂无有效宗门数据'));
        return;
    }
    try {
        const img = await screenshot('zongmeng', e.UserId, { temp });
        if (Buffer.isBuffer(img)) {
            void Send(Image(img));
        }
    }
    catch (_err) {
        void Send(Text('生成宗门列表图片失败'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
