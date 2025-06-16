# Service Analyzer

A Node.js console application that analyzes services using OpenAI's GPT-4 to provide detailed, structured reports about various services or business concepts.

## Features

- Analyzes any service or business concept using AI
- Provides structured analysis in Markdown format
- Includes sections like Brief History, Target Audience, Core Features, and more
- Option to save analysis to a file
- Uses few-shot learning for better quality responses

## Requirements

- Node.js 16.x or higher
- OpenAI API key
- Required Node.js packages (installed via npm):
  - openai
  - dotenv

## Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install required packages:
```bash
npm install
```

3. Create a `.env` file in the project root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

1. Run the script:
```bash
npm start
```

2. When prompted, enter either:
   - A known service name (e.g., "Spotify", "Instagram")
   - A description of a service (e.g., "A food delivery platform")

3. Wait for the analysis to complete

4. The analysis will be displayed in the console

5. You'll be asked if you want to save the analysis to a file
   - If you choose 'y', the analysis will be saved as a Markdown file with a timestamp

## Output Format

The analysis includes the following sections:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

## Sample Usage

```
Welcome to Service Analyzer!
Enter a service name or description (e.g., 'Spotify' or 'A music streaming platform'):
Spotify

Analyzing... Please wait.

[Analysis will appear here]

Would you like to save this analysis to a file? (y/n)
y

Analysis saved to: analysis_spotify_20240315T123456.md
```

## Note

Make sure to keep your OpenAI API key confidential and never commit the `.env` file to version control. 