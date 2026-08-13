import { getExcerpt } from './posts';

const GENERATION_DELAY_MS = 1200;
const MOCK_FAILURE_RATE = 0.25;

export const generateAiSummary = (content: string): Promise<string> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < MOCK_FAILURE_RATE) {
        reject(new Error('AI 요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'));
        return;
      }
      resolve(`${getExcerpt(content, 160)} — AI가 핵심 내용을 요약했습니다.`);
    }, GENERATION_DELAY_MS);
  });
