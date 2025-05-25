type Item = {
  id: string;
  name: string;
  quantityLeft: number;
  usagePerDay: number;
  daysLeft: number;
  reorderLink?: string;
  ownerId: string;
};

export type { Item };
