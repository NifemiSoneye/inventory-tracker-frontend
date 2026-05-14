export interface InventoryItem {
  id: string;
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "In stock" | "Low stock" | "Out of stock";
}
