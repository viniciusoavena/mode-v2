import * as fal from '@fal-ai/serverless-client';

// @ts-ignore
fal.config({
  proxyUrl: '/api/fal/proxy',
});

interface Img2ImgInput {
  image_url: string;
  prompt: string;
  sync_mode: boolean;
  strength: number;
  seed: number;
}

interface Img2ImgOutput {
  images: {
    url: string;
    content_type: string;
  }[];
  seed: number;
  num_inference_steps: number;
}

export async function generate(prompt: string): Promise<any> {
  const result = await fal.subscribe('fal-ai/illusion-diffusion', {
    input: {
      prompt,
    },
    logs: true,
    onQueueUpdate(update) {
      console.log('queue update', update);
    },
  });
  return result;
}
