export interface ForumItem {
  id: string; // 唯一ID，格式：纯数字6位（时间戳后4位+2位随机数）
  qq: string | number;
  class: string;
  name: string;
  // 单价
  price: number | string;
  // 数量
  aconut: number | string;
  // 总记
  whole: number | string;
  now_time: number;
}

export type ForumOrder = ForumItem;
