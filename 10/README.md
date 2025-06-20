# Product Filter AI

A Node.js application that uses OpenAI's GPT to filter products based on natural language queries.

## Features

- Natural language product search
- OpenAI function calling for intelligent filtering
- TypeScript implementation
- Console-based user interface

## Prerequisites

- Node.js (v16 or higher)
- npm
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```
4. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Usage

Run the application in development mode:
```bash
npm run dev
```

Or run the built version:
```bash
npm start
```

When prompted, enter your product search query in natural language. For example:
- "I want to buy headphones under $200 with good ratings"
- "Show me fitness equipment that costs less than $100"
- "Find me kitchen appliances that are in stock and have a rating above 4.5"

## File Structure

- `src/` - TypeScript source files
  - `index.ts` - Main application file
  - `openai.ts` - OpenAI API integration
  - `types.ts` - TypeScript interfaces
- `products.json` - Product database
- `.env` - Environment variables
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project configuration and dependencies 