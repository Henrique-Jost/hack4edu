import { openai } from "@ai-sdk/openai";
import { anthropic } from '@ai-sdk/anthropic';
import { wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

// Create a model with RAG middleware
export const customModel = wrapLanguageModel({
  model: anthropic('claude-3-5-haiku-20241022'),
  //model: openai.responses("gpt-4o-mini"),
  middleware: ragMiddleware,
});