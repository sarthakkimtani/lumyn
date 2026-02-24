import { getModelPath, llama } from "@react-native-ai/llama";
import { InferAgentUIMessage, ToolLoopAgent } from "ai";

import { systemPrompt } from "@/lib/prompt";

export const MODEL_ID =
  "Qwen/Qwen2.5-1.5B-Instruct-GGUF/qwen2.5-1.5b-instruct-q4_k_m.gguf";

const createAgent = (modelPath: string) => {
  const model = llama.languageModel(modelPath, {
    projectorUseGpu: true,
    contextParams: {
      n_ctx: 2048,
      n_gpu_layers: 99,
    },
  });

  return {
    model,
    agent: new ToolLoopAgent({
      model,
      instructions: systemPrompt,
    }),
  };
};

type AgentInstance = ReturnType<typeof createAgent>["agent"];

let _agent: AgentInstance | null = null;
let _preparingAgent: Promise<AgentInstance> | null = null;

export async function prepareAgent(): Promise<AgentInstance> {
  if (_agent) return _agent;
  if (_preparingAgent) return _preparingAgent;

  _preparingAgent = (async () => {
    const modelPath = getModelPath(MODEL_ID);
    const { model, agent } = createAgent(modelPath);
    await model.prepare();
    _agent = agent;
    return agent;
  })();

  try {
    return await _preparingAgent;
  } finally {
    _preparingAgent = null;
  }
}

export function getAgent(): AgentInstance {
  if (!_agent) throw new Error("Agent not prepared. Call prepareAgent() first.");
  return _agent;
}

export type AgentMessage = InferAgentUIMessage<AgentInstance>;
