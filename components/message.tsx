import type { ToolInvocation } from "ai"
import type { FC } from "react"
import ReactMarkdown from "react-markdown"

interface MessageProps {
  role: string
  content: string
  toolInvocations?: ToolInvocation[] | any[] // Support both streamText and generateText formats
}

export const Message: FC<MessageProps> = ({ role, content, toolInvocations }) => {
  return (
    <div className={`flex flex-col w-full max-w-[500px] ${role === "user" ? "items-end" : "items-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-full ${
          role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-500 dark:bg-zinc-100 text-zinc-800 dark:text-zinc-900"
        }`}
      >
        <ReactMarkdown>{content}</ReactMarkdown>

        {/* Render tool invocations */}
        {toolInvocations && toolInvocations.length > 0 && (
          <div className="mt-3 border-t border-zinc-300 dark:border-zinc-600 pt-2">
            {toolInvocations.map((tool) => (
              <div key={tool.toolCallId} className="mb-2">
                <div className="font-medium text-sm">{tool.toolName} Results:</div>

                <div className="text-sm bg-zinc-100 dark:bg-zinc-800 p-2 rounded mt-1 overflow-auto max-h-[200px]">
                  {typeof tool.result === "string" ? (
                    <ReactMarkdown>{tool.result}</ReactMarkdown>
                  ) : (
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(tool.result || tool.args, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add debug tool in development */}
        {process.env.NODE_ENV === "development" && toolInvocations && toolInvocations.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs">
            <details>
              <summary className="cursor-pointer font-medium">Debug Tool Calls ({toolInvocations.length})</summary>
              <pre className="mt-2 overflow-auto max-h-[300px]">{JSON.stringify(toolInvocations, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}

