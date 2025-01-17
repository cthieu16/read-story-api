import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AiChatsService {
  private readonly apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private readonly apiKey = process.env.GEMINI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateContent(prompt: string): Promise<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      return { result: response.data.candidates[0].content.parts[0].text };
    } catch (error) {
      console.error('Error generating content:', error.message);
      throw new Error('Failed to generate content');
    }
  }
}
