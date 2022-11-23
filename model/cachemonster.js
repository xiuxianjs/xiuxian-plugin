const alldata = [];
const addall = [];
const name1 = ['麒麟', '狮', '鹏', '雕', '雀', '豹', '虎', '龟', '猫', '龙'];
const name2 = ['兵', '将', '兽', '妖', '王兽', '大妖', '王', '皇', '帝', '神'];
class Cachemonster {
    constructor() { };
    monsterscache = async (i) => {
        while (true) {
            if (alldata.length <= i) {
                alldata.push({
                    label: 24,
                    data: [],
                });
            }
            else {
                break;
            };
        };
        const time = new Date();
        if (time.getHours() != alldata[i].label) {
            alldata[i].label = time.getHours();
            for (var j = 0; j < 5; j++) {
                let y = Math.trunc(Math.random() * ((i + 2) * 2));
                y = y > 9 ? 9 : y;
                await alldata[i].data.push({
                    name: name1[Math.trunc(Math.random() * 9)] + name2[y],
                    killNum: 1,
                    level: y + 1
                });
            };
            return alldata[i].data;
        }
        else {
            return alldata[i].data;
        };
    };
    /**
     * (7,6)   (7,3)  (3,0)   (4,4)  (1,6)   (2,3)
     * 极光0  朝阳1  兽台2  仙府3    灭仙4   雷鸣5
     */
    monsters = async (a, b, c) => {
        const x = Math.floor(a / 100);
        const y = Math.floor(b / 100);
        const z = Math.floor(c / 100);
        if (x == 7 && y == 6 && z == 0) {
            return 0;
        }
        else if (x == 1 && y == 6 && z == 0) {
            return 4;
        }
        else if (x == 4 && y == 4 && z == 0) {
            return 3;
        }
        else if (x == 7 && y == 3 && z == 0) {
            return 1;
        }
        else if (x == 2 && y == 3 && z == 0) {
            return 5;
        }
        else if (x == 3 && y == 0 && z == 0) {
            return 2;
        };
        return -1;
    };
    add = async (i, num) => {
        while (true) {
            if (addall.length <= i) {
                addall.push({
                    acount: 0,
                });
            }
            else {
                break;
            };
        };
        addall[i].acount += num;
        const p = Math.floor((Math.random() * (50 - 30))) + Number(30);
        if (addall[i].acount > p) {
            addall[i].acount = 0;
            return 1;
        };
        return 0;
    };
};
export default new Cachemonster();