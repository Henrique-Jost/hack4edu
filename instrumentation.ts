import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";
 
export function register() {
  registerOTel({
    serviceName: "compass-project",
    traceExporter: new LangfuseExporter(),
  });
}