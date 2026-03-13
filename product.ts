export type ProductCategory = "Laptop" | "Smartphone";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  tax: number;
  discount: number;
}
