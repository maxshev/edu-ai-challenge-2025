import * as dotenv from 'dotenv';
dotenv.config();

import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import { Product } from './types';
import { filterProductsByQuery } from './openai';

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

// Load products from JSON file
const loadProducts = (): Product[] => {
  try {
    const data = fs.readFileSync('products.json', 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error loading products:', error);
    process.exit(1);
    return [];
  }
};

// Format product for display
const formatProduct = (product: Product, index: number): string => {
  return `${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${product.in_stock ? 'In Stock' : 'Out of Stock'}`;
};

async function main() {
  console.log('Welcome to the Product Filter AI!');
  console.log('Enter your product search query in natural language.');
  console.log('Example: "I want to buy headphones under $200 with good ratings"\n');

  // Get user input
  const query = readlineSync.question('Your query: ');

  try {
    const products = loadProducts();
    console.log('\nSearching for products...\n');

    const filteredProducts = await filterProductsByQuery(query, products);

    if (filteredProducts.length === 0) {
      console.log('No products found matching your criteria.');
    } else {
      console.log('Filtered Products:');
      filteredProducts.forEach((product, index) => {
        console.log(formatProduct(product, index));
      });
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main(); 