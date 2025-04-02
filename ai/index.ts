import { openai } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';
import { anthropic } from "@ai-sdk/anthropic"
import { wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

// Create a model with RAG middleware
export const customModel = wrapLanguageModel({
  model: google('gemini-2.0-flash-001', {
    useSearchGrounding: true,
  }),
  //model: openai.responses("gpt-4o"),
  //model: anthropic("claude-3-5-haiku-20241022"),
  middleware: ragMiddleware,

});