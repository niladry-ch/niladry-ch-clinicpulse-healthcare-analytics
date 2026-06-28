import AnimatedMetric from "./AnimatedMetric";

export default function KpiCard({ title, value, variant = "default" }) {
  return (
    <div className={`kpi-card ${variant}`}>
      <span>{title}</span>
      <strong>
        <AnimatedMetric value={value} />
      </strong>
    </div>
  );
}