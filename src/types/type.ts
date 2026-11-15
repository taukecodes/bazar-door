export interface ICategory {
  id?: string | number; // এই লাইনটি যোগ করে দিন
  slug: string;
  name: string;
  nameBn: string;
  icon: string;
  description?: string;
  descriptionBn?: string;
}

export interface IMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface IChange {
  dir: string;
  pct: number;
}

export interface IProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: IChange;
  markets: IMarket[];
}
