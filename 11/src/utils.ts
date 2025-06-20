import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

export function createOutputDirectory(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.join(process.cwd(), 'output', timestamp);
  fs.mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

export function saveToFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf-8');
}

export function formatDuration(durationInSeconds: number): string {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.round(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateWordsPerMinute(wordCount: number, durationInSeconds: number): number {
  const minutes = durationInSeconds / 60;
  return Math.round(wordCount / minutes);
}

const STOP_WORDS = new Set([
  // Common English stop words
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now',
  // Pronouns
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'his', 'hers',
  'ours', 'theirs',
  // Common conversational words
  'like', 'well', 'yeah', 'yes', 'no', 'okay', 'ok', 'right', 'um', 'uh', 'oh',
  'actually', 'basically', 'literally', 'really', 'simply', 'look', 'see', 'hey',
  'hi', 'hello', 'bye', 'goodbye', 'please', 'thank', 'thanks', 'sorry',
  // Question words and auxiliaries
  'do', 'does', 'did', 'done', 'doing', 'would', 'could', 'should', 'might',
  'must', 'shall', 'will', 'have', 'has', 'had', 'having', 'get', 'got', 'getting',
  'goes', 'going', 'went', 'gone',
  // Numbers and time-related
  'one', 'two', 'three', 'four', 'five', 'ten', 'time', 'day', 'week', 'month',
  'year', 'today', 'tomorrow', 'yesterday', 'now', 'then', 'always', 'never'
]);

interface TopicMention {
  topic: string;
  mentions: number;
  weight: number;
}

function normalizeWord(word: string): string {
  return word.toLowerCase()
    .replace(/ing$/, '')   // running -> run
    .replace(/ed$/, '')    // talked -> talk
    .replace(/es$/, '')    // watches -> watch
    .replace(/s$/, '')     // talks -> talk
    .replace(/\'s$/, '')   // person's -> person
    .trim();
}

function getNGrams(words: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    const ngramWords = words.slice(i, i + n);
    // Only include ngrams where at least one word is not a stop word
    if (ngramWords.some(word => !STOP_WORDS.has(word.toLowerCase()))) {
      ngrams.push(ngramWords.join(' '));
    }
  }
  return ngrams;
}

function isValidTopic(phrase: string): boolean {
  const words = phrase.split(' ');
  return (
    // At least one word is not a stop word
    words.some(word => !STOP_WORDS.has(word.toLowerCase())) &&
    // All words are at least 4 characters
    words.every(word => word.length >= 4) &&
    // For single words, must be at least 5 characters
    (words.length > 1 || words[0].length >= 5) &&
    // Entire phrase should be at least 5 characters
    phrase.length >= 5 &&
    // Avoid phrases that start with common non-topical words
    !STOP_WORDS.has(words[0].toLowerCase())
  );
}

function calculatePhraseWeight(phrase: string, count: number): number {
  const words = phrase.split(' ');
  let weight = count;

  // Give higher weight to multi-word phrases
  if (words.length > 1) {
    weight *= 1.5;
  }
  if (words.length > 2) {
    weight *= 1.2;
  }

  // Give lower weight to very short words
  if (words.some(w => w.length <= 4)) {
    weight *= 0.8;
  }

  // Give higher weight to phrases with specific patterns
  if (/^[A-Z]/.test(phrase)) { // Starts with capital (potential proper nouns)
    weight *= 1.2;
  }

  return weight;
}

function mergeRelatedTopics(topics: TopicMention[]): TopicMention[] {
  const merged: { [key: string]: TopicMention } = {};

  topics.forEach(topic => {
    const normalizedTopic = topic.topic.toLowerCase();
    let found = false;

    // Check if this topic is part of or contains any existing topics
    for (const [key, existing] of Object.entries(merged)) {
      if (key.includes(normalizedTopic) || normalizedTopic.includes(key)) {
        // Merge into the topic with higher weight
        if (topic.weight > existing.weight) {
          merged[normalizedTopic] = {
            topic: topic.topic,
            mentions: topic.mentions + existing.mentions,
            weight: Math.max(topic.weight, existing.weight) * 1.2
          };
          delete merged[key];
        } else {
          merged[key] = {
            topic: existing.topic,
            mentions: topic.mentions + existing.mentions,
            weight: Math.max(topic.weight, existing.weight) * 1.2
          };
        }
        found = true;
        break;
      }
    }

    if (!found) {
      merged[normalizedTopic] = topic;
    }
  });

  return Object.values(merged);
}

export async function extractFrequentTopics(text: string, minOccurrences: number = 3): Promise<Array<{ topic: string; mentions: number }>> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a topic extraction expert. Analyze the given text and identify the main discussion topics and themes.

Rules for topic extraction:
1. Extract meaningful phrases that capture the context, not just single words
   - GOOD: "Heart Attack Symptoms", "Chest Pain Description"
   - BAD: "Heart", "Pain", "Symptoms"

2. Combine related mentions into coherent topics
   - If someone talks about "chest discomfort", "heart pain", and "cardiac symptoms", 
     combine them into a topic like "Chest Pain and Heart Symptoms"

3. Focus on the actual subjects being discussed
   - Include the context of what was said about the topic
   - Capture the main points of discussion, not just mentioned terms

4. Count meaningful references to each topic
   - Count when the topic is actually being discussed
   - Don't count casual mentions or references
   - Combine counts of related subtopics

5. Prioritize topics that represent:
   - Main discussion points
   - Key concerns or issues raised
   - Specific scenarios or cases discussed
   - Important concepts or themes

Your response must be a valid JSON array of objects with 'topic' and 'mentions' fields, like this:
[
  { "topic": "Heart Attack Warning Signs", "mentions": 5 },
  { "topic": "Chest Pain Characteristics", "mentions": 4 },
  { "topic": "Medical History Discussion", "mentions": 3 }
]`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const topics = JSON.parse(response.choices[0].message.content || '[]');
    return topics.slice(0, 10); // Return top 10 topics

  } catch (error) {
    console.error('Error extracting topics with GPT:', error);
    // Fallback to simple word frequency if GPT fails
    return simpleTopicExtraction(text, minOccurrences);
  }
}

// Keep the simple version as a fallback, but improve it to look for phrases
function simpleTopicExtraction(text: string, minOccurrences: number): Array<{ topic: string; mentions: number }> {
  // First try to extract common phrases (2-3 words)
  const phrases = text.match(/\b\w+(?:\s+\w+){1,2}\b/g) || [];
  const phraseCounts: { [key: string]: number } = {};
  
  phrases.forEach(phrase => {
    const words = phrase.split(/\s+/);
    // Only count phrases where none of the words are stop words and all are 3+ chars
    if (words.every(word => word.length > 3 && !STOP_WORDS.has(word.toLowerCase()))) {
      const normalized = phrase.toLowerCase();
      phraseCounts[normalized] = (phraseCounts[normalized] || 0) + 1;
    }
  });

  // Then get single words as backup
  const words = text.match(/\b\w+\b/g) || [];
  const wordCount: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 4 && !STOP_WORDS.has(word.toLowerCase())) {
      const normalized = word.toLowerCase();
      wordCount[normalized] = (wordCount[normalized] || 0) + 1;
    }
  });

  // Combine and sort results, preferring phrases over single words
  const combined = [
    ...Object.entries(phraseCounts)
      .filter(([_, count]) => count >= minOccurrences)
      .map(([phrase, count]) => ({
        topic: phrase.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        mentions: count * 1.5 // Give phrases slightly higher weight
      })),
    ...Object.entries(wordCount)
      .filter(([_, count]) => count >= minOccurrences)
      .map(([word, count]) => ({
        topic: word.charAt(0).toUpperCase() + word.slice(1),
        mentions: count
      }))
  ];

  return combined
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10);
} 