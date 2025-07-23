import dayjs from 'dayjs';

function getTimeStr(timeStamp) {
    return dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss');
}

export { getTimeStr };
