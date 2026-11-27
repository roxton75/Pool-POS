/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

import { ThemedText } from "./ThemedText";

type Props = {
  value: string | number;
  ready: boolean;
  variant?: "display" | "heading1" | "heading2";
  duration?: number;
};

function getNumbers(value: string | number): number[] {
  const matches = String(value).match(/\d[\d,]*/g) ?? [];

  return matches.map((item) => Number(item.replace(/,/g, "")));
}

function formatValue(template: string, values: number[]): string {
  let index = 0;

  return template.replace(/\d[\d,]*/g, () => {
    const value = Math.round(values[index++] ?? 0);

    return value.toLocaleString("en-IN");
  });
}

export default function AnimatedCounter({
  value,
  ready,
  variant = "display",
  duration = 900,
}: Props) {
  const template = String(value);
  const targets = getNumbers(value);

  const [displayValues, setDisplayValues] = useState(() =>
    targets.map(() => 0),
  );

  const currentValues = useRef(targets.map(() => 0));

  useEffect(() => {
    if (!ready) {
      const zeros = targets.map(() => 0);

      currentValues.current = zeros;
      setDisplayValues(zeros);
      return;
    }

    const startValues = [...currentValues.current];

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a smooth counting effect.
      const eased = 1 - Math.pow(1 - progress, 3);

      const nextValues = targets.map((target, index) => {
        const start = startValues[index] ?? 0;

        return start + (target - start) * eased;
      });

      currentValues.current = nextValues;
      setDisplayValues(nextValues);

      if (progress >= 1) {
        currentValues.current = targets;
        setDisplayValues(targets);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [ready, template, duration]);

  return (
    <ThemedText variant={variant}>
      {formatValue(template, displayValues)}
    </ThemedText>
  );
}
