import { AgentMessage } from "@/lib/agent";

export const getChatTitle = (text: string) => {
  return text.split(/\s+/).slice(0, 6).join(" ");
};
export const extractTextFromMessage = (message: AgentMessage) => {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
};
