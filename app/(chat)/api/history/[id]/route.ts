import { auth } from "@/app/(auth)/auth";
import { getChatById, deleteChatById } from "@/app/db";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const chatId = params.id;

  if (!session || !session.user || !session.user.email) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  if (!chatId) {
    return Response.json("Chat ID is required", { status: 400 });
  }

  try {
    // First check if the chat exists and belongs to the user
    const existingChat = await getChatById({ id: chatId });
    
    if (!existingChat || existingChat.author !== session.user.email) {
      return Response.json("Chat not found or not authorized to delete", { status: 404 });
    }

    // Proceed with deletion
    await deleteChatById({ id: chatId, author: session.user.email });
    
    return Response.json({ message: "Chat deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}