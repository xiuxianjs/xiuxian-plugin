export interface GardenCrop {
  name: string;
  start_time?: number;
  ts?: number;
  desc?: string;
  who_plant?: string;
}
export interface GardenData {
  药园等级?: number;
  作物?: GardenCrop[];
}
