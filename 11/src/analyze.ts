import { extractFrequentTopics } from './utils';

export interface AnalysisResult {
  word_count: number;
  speaking_speed_wpm: number;
  frequently_mentioned_topics: Array<{
    topic: string;
    mentions: number;
  }>;
}

export async function analyzeTranscription(
  transcription: string,
  durationInSeconds: number
): Promise<AnalysisResult> {
  const words = transcription.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const speakingSpeedWpm = Math.round((wordCount / durationInSeconds) * 60);
  const frequentTopics = await extractFrequentTopics(transcription, 3);

  return {
    word_count: wordCount,
    speaking_speed_wpm: speakingSpeedWpm,
    frequently_mentioned_topics: frequentTopics
  };
} 