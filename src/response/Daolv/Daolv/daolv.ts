import { readQinmidu } from '@src/model/index';
import { useMessage, Text } from 'alemonjs';

export const Daolv = {
  x: 0,
  chaoshi_time: null,
  user_A: null,
  user_B: null,
  set_x(value) {
    this.x = value;
  },
  set_chaoshi_time(value) {
    this.chaoshi_time = value;
  },
  set_user_A(value) {
    this.user_A = value;
  },
  set_user_B(value) {
    this.user_B = value;
  }
};

export function chaoshi(e) {
  const [message] = useMessage(e);
  const chaoshiTime = setTimeout(() => {
    if (Daolv.x === 1 || Daolv.x === 2) {
      Daolv.set_x(0);
      void message.send(format(Text('对方没有搭理你')));

      return false;
    }
  }, 30000);

  Daolv.set_chaoshi_time(chaoshiTime);
}
export async function found(A, B) {
  const qinmidu = await readQinmidu();
  let i;

  for (i = 0; i < qinmidu.length; i++) {
    if ((qinmidu[i].QQ_A === A && qinmidu[i].QQ_B === B) || (qinmidu[i].QQ_A === B && qinmidu[i].QQ_B === A)) {
      break;
    }
  }

  return i;
}
