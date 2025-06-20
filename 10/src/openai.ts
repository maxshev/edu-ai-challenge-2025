import { OpenAI } from "openai";
import { Product, FilterFunction, FilteredProducts } from "./types";

let openaiClient: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
};

export async function filterProductsByQuery(
  query: string,
  products: Product[]
): Promise<Product[]> {
  try {
    const openai = getOpenAIClient();
    
    // Create a prompt that includes the available products
    const productsContext = JSON.stringify(products, null, 2);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that filters products based on user queries. You will receive a list of available products and a user query. Return only the products that match the user's requirements. Be sure to consider price ranges, categories, ratings, and availability as specified in the query."
        },
        {
          role: "user",
          content: `Available products:\n${productsContext}\n\nUser query: ${query}\n\nPlease filter these products based on the query and return only the matching ones.`
        }
      ],
      functions: [
        {
          name: "filter_products",
          description: "Return the filtered list of products that match the user's requirements",
          parameters: {
            type: "object",
            properties: {
              filtered_products: {
                type: "array",
                description: "Array of products that match the user's criteria",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                    price: { type: "number" },
                    rating: { type: "number" },
                    in_stock: { type: "boolean" }
                  },
                  required: ["name", "category", "price", "rating", "in_stock"]
                }
              }
            },
            required: ["filtered_products"]
          }
        }
      ],
      function_call: { name: "filter_products" }
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error("No function call received from OpenAI");
    }

    const args = JSON.parse(functionCall.arguments);
    return args.filtered_products;
  } catch (error) {
    console.error("Error filtering products:", error);
    throw error;
  }
}
