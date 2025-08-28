export interface HelpItem {
  icon: string;
  title: string;
  desc: string;
}

export interface HelpGroup {
  group: string;
  list: HelpItem[];
}
