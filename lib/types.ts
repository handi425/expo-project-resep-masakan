export type Category =
  | "Ayam"
  | "Daging"
  | "Sayuran"
  | "Seafood"
  | "Sup"
  | "Mie"
  | "Nasi"
  | "Dessert"
  | "Sarapan"
  | "Minuman";

export type Recipe = {
  id: string;
  title: string;
  category: Category;
  image: string | number; // URL string or local require(resource)
  duration: number; // minutes
  difficulty: "Mudah" | "Sedang" | "Sulit";
  servings: number;
  calories?: number;
  ingredients: string[];
  steps: string[];
  tags?: string[];
};

