import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import KpiCard from "../KpiCard";
import ChartCard from "../ChartCard";

export default function Claims({
  metrics,
  topDeniedPayer,
  topDenialReason,
  deniedPayerData,
  denialReasonData,
  payerRiskRanking,
  claimRiskRows,
  priorityActions,
  parseNumber,
}) {
  return (
    <section className="page-card">
      <h2>Claims Intelligence</h2>

      <div className="report">
        <h3>Executive Insights</h3>

        <p>
          Current denial rate is <strong>{metrics.denialRate}%</strong>.
        </p>

        <p>
          Estimated revenue lost from denied claims is{" "}
          <strong>${metrics.revenueLost.toLocaleString()}</strong>.
        </p>

        {topDeniedPayer ? (
          <p>
            Highest denial contributor is{" "}
            <strong>{topDeniedPayer.payer}</strong> with{" "}
            <strong>{topDeniedPayer.deniedCount}</strong> denied claims causing{" "}
            <strong>${topDeniedPayer.lostRevenue.toLocaleString()}</strong> in
            lost revenue.
          </p>
        ) : (
          <p>No denied payer pattern detected yet.</p>
        )}

        {topDenialReason ? (
          <p>
            Most common denial reason is{" "}
            <strong>{topDenialReason.reason}</strong> with{" "}
            <strong>{topDenialReason.count}</strong> denied claims.
          </p>
        ) : (
          <p>
            No denial reason data available yet. Add a{" "}
            <strong>reason</strong> column to the claims CSV.
          </p>
        )}

        <p>
          Recommendation: Review payer-specific denial patterns, denial reasons,
          and front-end eligibility verification processes.
        </p>
      </div>

      <section className="cards">
        <KpiCard title="Total Claims" value={metrics.totalClaims} variant="claims" />
        <KpiCard title="Approved Claims" value={metrics.approvedClaims} variant="health" />
        <KpiCard title="Denied Claims" value={metrics.deniedClaims} variant="danger" />
        <KpiCard title="Pending Claims" value={metrics.pendingClaims} variant="warning" />
      </section>

      <section className="cards">
        <KpiCard title="Denial Rate" value={`${metrics.denialRate}%`} variant="danger" />
        <KpiCard
          title="Revenue Lost to Denials"
          value={`$${metrics.revenueLost.toLocaleString()}`}
          variant="danger"
        />
        <KpiCard
          title="Highest-Risk Payer"
          value={topDeniedPayer ? topDeniedPayer.payer : "None"}
          variant="claims"
        />
        <KpiCard
          title="Top Denial Reason"
          value={topDenialReason ? topDenialReason.reason : "Not Available"}
          variant="warning"
        />
      </section>

      <section className="grid">
        <ChartCard title="Denied Claims by Payer">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deniedPayerData}>
              <XAxis dataKey="payer" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="deniedCount"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Denial Reasons">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={denialReasonData}>
              <XAxis dataKey="reason" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="table-card">
        <h3>Payer Risk Ranking</h3>
        <table>
          <thead>
            <tr>
              <th>Payer</th>
              <th>Denied Claims</th>
              <th>Lost Revenue</th>
            </tr>
          </thead>
          <tbody>
            {payerRiskRanking.length > 0 ? (
              payerRiskRanking.map((payer) => (
                <tr key={payer.payer}>
                  <td>{payer.payer}</td>
                  <td>{payer.deniedCount}</td>
                  <td>${payer.lostRevenue.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No denied claims found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="table-card">
        <h3>Rule-Based Predictive Claim Risk</h3>
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Payer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {claimRiskRows.length > 0 ? (
              claimRiskRows.map((claim) => (
                <tr key={claim.claim_id}>
                  <td>{claim.claim_id}</td>
                  <td>{claim.payer}</td>
                  <td>${parseNumber(claim.amount).toLocaleString()}</td>
                  <td>{claim.status}</td>
                  <td>{claim.riskScore}/100</td>
                  <td>{claim.riskLevel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No claims available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="table-card">
        <h3>Priority Actions</h3>
        <table>
          <tbody>
            {priorityActions.map((action, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}