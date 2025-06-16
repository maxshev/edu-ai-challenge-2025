require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs').promises;
const readline = require('readline');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Example for few-shot learning
const EXAMPLE_ANALYSIS = `
Service: Netflix

# Brief History
Netflix was founded in 1997 by Reed Hastings and Marc Randolph. Initially a DVD-by-mail service, it transformed into a streaming platform in 2007 and began producing original content in 2013.

# Target Audience
- Primary: Adults 18-49
- Secondary: Families and children
- Global audience across 190+ countries

# Core Features
- Streaming video on demand
- Personalized recommendations
- Multiple user profiles
- Original content production
- Downloads for offline viewing

# Unique Selling Points
- Vast library of original content
- Ad-free experience
- High-quality streaming technology
- Global accessibility
- Competitive pricing

# Business Model
- Subscription-based revenue
- Tiered pricing structure
- Investment in original content
- International expansion strategy

# Tech Stack Insights
- Cloud infrastructure (AWS)
- Advanced recommendation algorithms
- Custom CDN for content delivery
- Microservices architecture
- Advanced video encoding

# Perceived Strengths
- Content quality and variety
- User experience
- Brand recognition
- Innovation in streaming technology
- Global reach

# Perceived Weaknesses
- Increasing competition
- Content licensing costs
- Regional content restrictions
- Dependency on internet infrastructure
`;

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getServiceAnalysis(serviceInput) {
    const prompt = `Analyze the following service and provide a detailed report in Markdown format.
    Include the following sections: Brief History, Target Audience, Core Features, Unique Selling Points,
    Business Model, Tech Stack Insights, Perceived Strengths, and Perceived Weaknesses.
    
    Here's an example of the analysis format:
    
    ${EXAMPLE_ANALYSIS}
    
    Now, please analyze this service:
    ${serviceInput}
    
    Provide the analysis in the same format as the example above, maintaining consistent section headers and depth of analysis.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You are a business and technology analyst providing detailed service analysis." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        });

        return response.choices[0].message.content;
    } catch (error) {
        return `Error during analysis: ${error.message}`;
    }
}

async function saveToFile(content, serviceName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = `analysis_${serviceName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.md`;

    try {
        await fs.writeFile(filename, content, 'utf8');
        return filename;
    } catch (error) {
        return `Error saving file: ${error.message}`;
    }
}

async function main() {
    console.log("Welcome to Service Analyzer!");
    
    try {
        // Get service input
        const serviceInput = await new Promise((resolve) => {
            rl.question("Enter a service name or description (e.g., 'Spotify' or 'A music streaming platform'):\n", resolve);
        });

        if (!serviceInput.trim()) {
            console.log("Error: Input cannot be empty.");
            rl.close();
            return;
        }

        console.log("\nAnalyzing... Please wait.\n");

        // Get analysis
        const analysis = await getServiceAnalysis(serviceInput);
        console.log(analysis);

        // Ask about saving
        const saveChoice = await new Promise((resolve) => {
            rl.question("\nWould you like to save this analysis to a file? (y/n)\n", resolve);
        });

        if (saveChoice.toLowerCase() === 'y') {
            const filename = await saveToFile(analysis, serviceInput.split(' ')[0]);
            console.log(`\nAnalysis saved to: ${filename}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        rl.close();
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log("\nExiting...");
    rl.close();
    process.exit(0);
});

main(); 