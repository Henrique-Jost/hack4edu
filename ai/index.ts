import { openai } from "@ai-sdk/openai";
import { wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

// Create a model with RAG middleware
export const customModel = wrapLanguageModel({
  model: openai.responses("gpt-4o-mini"),
  middleware: ragMiddleware,
});