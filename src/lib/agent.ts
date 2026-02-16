import { apple } from "@react-native-ai/apple";
import { InferAgentUIMessage, ToolLoopAgent } from "ai";

import { systemPrompt } from "@/lib/prompt";

export const agent = new ToolLoopAgent({
  model: apple(),
  instructions: systemPrompt,
});

export type AgentMessage = InferAgentUIMessage<typeof agent>;
