// ./app/page.tsx
import ClientComponent from "@/components/ClientComponent";
import { fetchAccessToken } from "hume";

export default async function Voice() {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  const configId = String(process.env.NEXT_PUBLIC_HUME_CONFIG_ID);
  console.log(configId)

  if (!accessToken) {
    throw new Error();
  }

  return <ClientComponent accessToken={accessToken} configId={configId}  />;
}