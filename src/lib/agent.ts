import { llama } from "@react-native-ai/llama";
import { InferAgentUIMessage, ToolLoopAgent } from "ai";

import { modelDownloader } from "@/lib/model-downloader";
import { systemPrompt } from "@/lib/prompt";

export const MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct-GGUF/qwen2.5-1.5b-instruct-q4_k_m.gguf";

const modelPath = modelDownloader.getModelPath(MODEL_ID);
const model = llama.languageModel(modelPath, {
  projectorUseGpu: true,
  contextParams: {
    n_ctx: 2048,
    n_gpu_layers: 99,
  },
});

export async function prepareAgent(): Promise<void> {
  await model.prepare();
}

export const agent = new ToolLoopAgent({
  model,
  instructions: systemPrompt,
});

export type AgentMessage = InferAgentUIMessage<typeof agent>;
