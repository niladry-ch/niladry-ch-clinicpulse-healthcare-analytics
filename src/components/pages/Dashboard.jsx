import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";

export default function Dashboard({
  metrics,
  healthScore,
  revenueByDate,
  payerData,
}) {
  return (
    <>
      <div className="header">
        <h2>Operations Dashboard</h2>
        <span>ClinicPulse MVP</span>
      </div>

      <section className="hero-banner">
        <div>
          <span className="eyebrow">Real-Time Healthcare Intelligence</span>
          <h2>Operational, claims, and revenue insights in one executive view.</h2>
          <p>
            ClinicPulse converts appointment and claims data into action-ready
            insights for denial management, leakage detection, and performance
            monitoring.
          </p>
        </div>

        <div className="hero-score">
          <span>Health Score</span>
          <strong>{healthScore}/100</strong>
          <small>Based on denials, no-shows, and leakage</small>
        </div>
      </section>

      <section className="cards">
        <KpiCard
          title="Approved Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          variant="revenue"
        />
        <KpiCard
          title="Appointments"
          value={metrics.totalAppointments}
          variant="clinical"
        />
        <KpiCard
          title="No-Show Rate"
          value={`${metrics.noShowRate}%`}
          variant="warning"
        />
        <KpiCard
          title="Claim Denial Rate"
          value={`${metrics.denialRate}%`}
          variant="claims"
        />
        <KpiCard
          title="Operational Health Score"
          value={`${healthScore}/100`}
          variant="health"
        />
      </section>

      <section className="grid">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Claims by Payer">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={payerData}>
              <XAxis dataKey="payer" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#1944b0"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="table-card">
        <h3>Operational Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Completed Appointments</td>
              <td>{metrics.completed}</td>
            </tr>
            <tr>
              <td>No Shows</td>
              <td>{metrics.noShows}</td>
            </tr>
            <tr>
              <td>Cancelled</td>
              <td>{metrics.cancelled}</td>
            </tr>
            <tr>
              <td>Approved Claims</td>
              <td>{metrics.approvedClaims}</td>
            </tr>
            <tr>
              <td>Denied Claims</td>
              <td>{metrics.deniedClaims}</td>
            </tr>
            <tr>
              <td>Pending Claims</td>
              <td>{metrics.pendingClaims}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}