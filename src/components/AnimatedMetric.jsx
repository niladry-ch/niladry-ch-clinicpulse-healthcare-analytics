import { useEffect, useState } from "react";

export default function AnimatedMetric({ value }) {
  const valueText = String(value);
  const numericMatch = valueText.match(/[-\d,.]+/);
  const numericValue = numericMatch
    ? Number(numericMatch[0].replace(/,/g, ""))
    : null;
  const [displayValue, setDisplayValue] = useState(numericValue ?? valueText);

  useEffect(() => {
    if (numericValue === null || !Number.isFinite(numericValue)) {
      setDisplayValue(valueText);
      return;
    }

    let frame;
    const duration = 750;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(numericValue * easedProgress);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [numericValue, valueText]);

  if (numericValue === null || !Number.isFinite(numericValue)) {
    return <>{valueText}</>;
  }

  const prefix = valueText.trim().startsWith("$") ? "$" : "";
  const suffix = valueText.includes("%")
    ? "%"
    : valueText.includes("/100")
    ? "/100"
    : "";
  const hasDecimal = valueText.includes(".");
  const formattedValue = hasDecimal
    ? Number(displayValue).toFixed(1)
    : Math.round(Number(displayValue)).toLocaleString();

  return (
    <>
      {prefix}
      {formattedValue}
      {suffix}
    </>
  );
}