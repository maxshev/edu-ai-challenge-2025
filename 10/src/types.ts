export interface Product {
  name: string;
  category: string;
  price: number;
  rating: number;
  in_stock: boolean;
}

export interface FilteredProducts {
  products: Product[];
}

export interface FilterFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: {
      products: {
        type: string;
        items: {
          type: string;
          properties: {
            name: { type: string };
            category: { type: string };
            price: { type: string };
            rating: { type: string };
            in_stock: { type: string };
          };
          required: string[];
        };
      };
    };
    required: string[];
  };
} 