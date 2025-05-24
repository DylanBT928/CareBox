export default interface Item {
  id: string;
  name: string;
  usagePerDay: number;
  quantityLeft: number;
  daysLeft: number;
  reorderLink: string;
};