import { auth } from "@/app/(auth)/auth";
import { notFound } from "next/navigation";
import ClientComponent from "@/components/ClientComponent";

export default async function VoicePage() {
  const session = await auth();
  const humeApiKey = process.env.HUME_API_KEY;

  // Redirect to 404 if no authenticated session exists
  if (!session?.user?.email) {
    notFound();
  }

  // Validate API key exists
  if (!humeApiKey) {
    throw new Error("Missing HUME_API_KEY environment variable");
  }

  return (
    <ClientComponent 
      accessToken={humeApiKey}
      configId="836d6a92-113d-4f3e-bf30-daf985710be1"
    />
  );
}