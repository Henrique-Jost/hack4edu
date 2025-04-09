import { openai } from "@ai-sdk/openai";
import { deepseek } from '@ai-sdk/deepseek';
import { google } from '@ai-sdk/google';
import { anthropic } from "@ai-sdk/anthropic"
import { wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

// Create a model with RAG middleware
export const customModel = wrapLanguageModel({
  //model: google('gemini-2.0-flash-001', {
  //  useSearchGrounding: true,
  //}),
  model: deepseek('deepseek-chat'),
  //model: openai.responses("gpt-4o-mini"),
  //model: anthropic("claude-3-5-haiku-20241022"),
  middleware: ragMiddleware,

});