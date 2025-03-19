import { customModel } from "@/ai"
import { auth } from "@/app/(auth)/auth"
import { createMessage } from "@/app/db"
import { convertToCoreMessages, generateText, experimental_createMCPClient } from "ai"

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json()

  const session = await auth()

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Initialize MCP clients with SSE transport for both endpoints
  let composioClient = null
  let jiraClient = null

  try {
    // Create MCP client for Composio Search
    composioClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "https://mcp.composio.dev/composio_search/bland-tart-tent-8VDaWy",
      },
    })

    // Create MCP client for Jira
    jiraClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "https://mcp.composio.dev/jira/bland-tart-tent-8VDaWy",
      },
    })

    // Get tools from both MCP servers
    const composioTools = await composioClient.tools()
    const jiraTools = await jiraClient.tools()

    // Combine tools from both sources
    const mcpTools = {
      ...composioTools,
      ...jiraTools,
    }

    // Log available tools for debugging
    console.log("Available MCP tools:", Object.keys(mcpTools))

    // Use generateText instead of streamText
    const { text, toolCalls } = await generateText({
      model: customModel,
      system: `You are an an tutor who helps students learn the concepts of what the professor is currently teaching.
        - Ensure to always be brief and coherent.
        - Follow the material on your vector knowledge base when students ask subjects questions
        - Use the available search tools to find real-time data and relevant materials on the topic
        - IMPORTANT: When using tools, ALWAYS wait for the tool results before continuing your response
        - If a tool call is initiated, make sure to complete the full process and analyze the results`,
      messages: convertToCoreMessages(messages),
      tools: {
        // Add the MCP tools to the available tools
        ...mcpTools,
      },
      maxSteps: 15, // Increase max steps to allow for more tool calls and processing
      experimental_providerMetadata: {
        files: {
          selection: selectedFilePathnames,
        },
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "generate-text",
      },
    })

    // Log completion information
    console.log("Generation completed with tool calls:", toolCalls?.length || 0)

    // Store the message with the text content
    await createMessage({
      id,
      messages: [
        ...messages,
        {
          role: "assistant",
          content: text,
          toolCalls: toolCalls,
        },
      ],
      author: session.user?.email!,
    })

    // Return the complete response as JSON
    return new Response(
      JSON.stringify({
        id,
        role: "assistant",
        content: text,
        toolCalls: toolCalls,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error with MCP clients or text generation:", error)

    // Try to provide more detailed error information
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error occurred"

    // Add a fallback response in case of error
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } finally {
    // Always close the MCP clients to release resources
    try {
      await Promise.all([
        composioClient?.close().catch((e) => console.error("Error closing composio client:", e)),
        jiraClient?.close().catch((e) => console.error("Error closing jira client:", e)),
      ])
    } catch (e) {
      console.error("Error in cleanup:", e)
    }
  }
}

