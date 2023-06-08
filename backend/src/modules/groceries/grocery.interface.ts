export enum SinceParam {
  Today = 'today',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum SortParam {
  Name = 'name',
  WhatIsNew = 'new',
  Expiry = 'expiry',
}

export type TotalWasteCost = {
  totalCost: number;
  totalItems: number;
};
