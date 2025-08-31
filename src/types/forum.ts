export interface ForumItem {
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
