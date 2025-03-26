import { LangfuseWeb } from "langfuse";
import { useState } from "react";

export function UserFeedbackComponent(props: { traceId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const langfuseWeb = new LangfuseWeb({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  });

  const handleUserFeedback = async (value: number) => {
    setSelected(value);
    await langfuseWeb.score({
      traceId: props.traceId,
      name: "user_feedback",
      value,
    });
  };

  return (
    <div className="space-x-1">
      <button 
        onClick={() => handleUserFeedback(1)}
        className={`p-1 rounded ${selected === 1 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
      > 
        👍🏼 
      </button>
      <button 
        onClick={() => handleUserFeedback(0)}
        className={`p-1 rounded ${selected === 0 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
      > 
        👎🏼 
      </button>
    </div>
  );
}