import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, readPlayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?入驻洞天.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 == '宗主') {
        logger.info('通过');
    }
    else {
        Send(Text('只有宗主可以操作'));
        return false;
    }
    let ass = await data.getAssociation(player.宗门.宗门名称);
    let blessed_name = e.MessageText.replace(/^(#|＃|\/)?入驻洞天/, '');
    blessed_name = blessed_name.trim();
    let dongTan = await data.bless_list.find(item => item.name == blessed_name);
    if (!dongTan)
        return false;
    if (ass.宗门驻地 == blessed_name) {
        Send(Text(`咋的，要给自己宗门拆了重建啊`));
        return false;
    }
    const keys = await redis.keys(`${__PATH.association}:*`);
    const assList = keys.map(key => key.replace(`${__PATH.association}:`, ''));
    for (let i = 0; i < assList.length; i++) {
        let this_name = assList[i];
        let this_ass = await await data.getAssociation(this_name);
        if (this_ass.宗门驻地 == dongTan.name) {
            let attackPower = 0;
            let defendPower = 0;
            for (let i in ass.所有成员) {
                let member_qq = ass.所有成员[i];
                let member_data = await readPlayer(member_qq);
                let power = member_data.攻击 + member_data.血量上限 * 0.5;
                power = Math.trunc(power);
                attackPower += power;
            }
            for (let i in this_ass.所有成员) {
                let member_qq = this_ass.所有成员[i];
                let member_data = await readPlayer(member_qq);
                let power = member_data.防御 + member_data.血量上限 * 0.5;
                power = Math.trunc(power);
                defendPower += power;
            }
            let randomA = Math.random();
            let randomB = Math.random();
            if (randomA > 0.75) {
                attackPower = Math.trunc(attackPower * 1.1);
            }
            if (randomA < 0.25) {
                attackPower = Math.trunc(attackPower * 0.9);
            }
            if (randomB > 0.75) {
                defendPower = Math.trunc(defendPower * 1.1);
            }
            if (randomB < 0.25) {
                defendPower = Math.trunc(defendPower * 0.9);
            }
            attackPower += ass.宗门建设等级 * 100 + ass.大阵血量 / 2;
            defendPower += this_ass.宗门建设等级 * 100 + this_ass.大阵血量;
            if (attackPower > defendPower) {
                this_ass.宗门驻地 = ass.宗门驻地;
                ass.宗门驻地 = dongTan.name;
                ass.宗门建设等级 = this_ass.宗门建设等级;
                if (this_ass.宗门建设等级 - 10 < 0) {
                    this_ass.宗门建设等级 = 0;
                }
                else {
                    this_ass.宗门建设等级 = this_ass.宗门建设等级 - 10;
                }
                this_ass.大阵血量 = 0;
                data.setAssociation(ass.宗门名称, ass);
                data.setAssociation(this_ass.宗门名称, this_ass);
                Send(Text(`当前洞天已有宗门占据，${ass.宗门名称}造成了${attackPower}伤害！,一举攻破了${this_ass.宗门名称} ${defendPower}的防御，将对方赶了出去,占据了${dongTan.name}`));
            }
            else if (attackPower < defendPower) {
                data.setAssociation(this_ass.宗门名称, this_ass);
                Send(Text(`${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}的防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}的防御就回复到了${defendPower}`));
            }
            else {
                data.setAssociation(this_ass.宗门名称, this_ass);
                Send(Text(`${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}的防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}的防御就回复到了${defendPower}`));
            }
            return false;
        }
    }
    ass.宗门驻地 = dongTan.name;
    ass.宗门建设等级 = 0;
    await data.setAssociation(ass.宗门名称, ass);
    Send(Text(`入驻成功,${ass.宗门名称}当前驻地为：${dongTan.name}`));
});

export { res as default, regular };
