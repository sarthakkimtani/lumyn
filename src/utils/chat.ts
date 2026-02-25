import { AgentMessage } from "@/lib/agent";

export const getChatTitle = (text: string) => {
  return text.split(/\s+/).slice(0, 6).join(" ");
};

export const extractTextPartsFromMessage = (message: AgentMessage) => {
  return message.parts.filter((part) => part.type === "text").map((part) => part.text);
};

export const extractReasoningPartsFromMessage = (message: AgentMessage) => {
  return message.parts.filter((part) => part.type === "reasoning").map((part) => part.text);
};

export const extractTextFromMessage = (message: AgentMessage) => {
  return extractTextPartsFromMessage(message).join(" ").trim();
};

export const extractReasoningFromMessage = (message: AgentMessage) => {
  return extractReasoningPartsFromMessage(message).join("").trim();
};
