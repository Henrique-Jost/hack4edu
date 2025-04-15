import { useEffect, useRef, RefObject } from "react";
import { Message } from "ai"; // Import the Message type if needed, or use any[]

export function useScrollToBottom<T extends HTMLElement>(
  dependencies: ReadonlyArray<any> = [] // Add a dependency array parameter
): [RefObject<T>, RefObject<T>] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const end = endRef.current;
    if (end) {
        // Scroll instantly the first time and smoothly on subsequent changes
        const behavior = dependencies.length > 0 ? 'smooth' : 'instant';
        end.scrollIntoView({ behavior: behavior, block: 'end' });
    }
    // Rerun this effect whenever the dependencies change
  }, [dependencies]); // Use the passed dependencies

  // Return the refs
  return [containerRef, endRef];
}