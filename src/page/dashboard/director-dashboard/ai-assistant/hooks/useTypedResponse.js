import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function useTypedResponse(text, animate) {
  const reduced = useReducedMotion();
  const characters = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(
    animate && !reduced ? 0 : characters.length,
  );
  const [skipped, setSkipped] = useState(false);
  const typing = Boolean(
    animate && !reduced && !skipped && count < characters.length,
  );
  useEffect(() => {
    if (!typing) return;
    const step = Math.max(1, Math.ceil(characters.length / 90));
    const timer = window.setInterval(
      () => setCount((current) => Math.min(current + step, characters.length)),
      24,
    );
    return () => window.clearInterval(timer);
  }, [characters.length, typing]);
  return {
    text: typing ? characters.slice(0, count).join("") : text,
    typing,
    finish: () => setSkipped(true),
  };
}
