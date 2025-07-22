import '../../api/api.js';
import md5 from 'md5';
import puppeteer from '../../image/index.js';

const helpData = {
    img: null,
    md5: ''
};
async function cache(data, user_id) {
    let tmp = md5(JSON.stringify(data));
    if (helpData.md5 == tmp)
        return helpData.img;
    helpData.img = await puppeteer.screenshot('help', user_id, data);
    helpData.md5 = tmp;
    return helpData.img;
}

export { cache };
