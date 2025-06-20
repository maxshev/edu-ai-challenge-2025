import { config } from 'dotenv';
import { Command } from 'commander';
import * as path from 'path';
import { createOutputDirectory, saveToFile } from './utils';
import { transcribeAudio } from './whisper';
import { summarizeTranscription } from './summarize';
import { analyzeTranscription, AnalysisResult } from './analyze';
import { getAudioDurationInSeconds } from 'get-audio-duration';

// Load environment variables
config();

const program = new Command();

program
  .name('audio-transcription-analyzer')
  .description('Transcribe and analyze audio files using OpenAI APIs')
  .version('1.0.0')
  .argument('<audioFile>', 'Path to the audio file to analyze')
  .action(async (audioFile: string) => {
    try {
      // Create output directory
      const outputDir = createOutputDirectory();
      console.log(`Processing audio file: ${audioFile}`);
      console.log(`Results will be saved to: ${outputDir}`);

      // Get audio duration
      const duration = await getAudioDurationInSeconds(audioFile);

      // Transcribe audio
      console.log('Transcribing audio...');
      const transcription = await transcribeAudio(audioFile);
      const transcriptionPath = path.join(outputDir, 'transcription.md');
      saveToFile(transcriptionPath, transcription);
      console.log(`Transcription saved to: ${transcriptionPath}`);

      // Generate summary
      console.log('Generating summary...');
      const summary = await summarizeTranscription(transcription);
      const summaryPath = path.join(outputDir, 'summary.md');
      saveToFile(summaryPath, summary);
      console.log(`Summary saved to: ${summaryPath}`);

      // Analyze transcription
      console.log('Analyzing transcription...');
      const analysis = await analyzeTranscription(transcription, duration);
      const analysisPath = path.join(outputDir, 'analysis.json');
      saveToFile(analysisPath, JSON.stringify(analysis, null, 2));
      console.log(`Analysis saved to: ${analysisPath}`);

      // Output results to console
      console.log('\nSummary:');
      console.log(summary);
      console.log('\nAnalysis:');
      console.log(JSON.stringify(analysis, null, 2));

    } catch (error) {
      console.error('Error processing audio file:', error);
      process.exit(1);
    }
  });

program.parse(); 