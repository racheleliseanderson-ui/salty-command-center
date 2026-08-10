import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

/** Counts up to `value` when scrolled into view. Suffix is rendered verbatim. */
export function CountUp({
  value,
  suffix = "",
  className,
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}
