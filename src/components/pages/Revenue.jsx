import KpiCard from "../KpiCard";

export default function Revenue({
  metrics,
  topDeniedPayer,
  claims,
  getPendingClaims,
  parseNumber,
}) {
  return (
    <section className="page-card">
      <h2>Revenue Leakage Intelligence</h2>

      <div className="report">
        <h3>Executive Revenue Insight</h3>

        <p>
          ClinicPulse estimated total expected revenue of{" "}
          <strong>${metrics.expectedRevenue.toLocaleString()}</strong> and
          collected approved revenue of{" "}
          <strong>${metrics.collectedRevenue.toLocaleString()}</strong>.
        </p>

        <p>
          Estimated revenue leakage is{" "}
          <strong>${metrics.leakageAmount.toLocaleString()}</strong>,
          representing <strong>{metrics.leakageRate}%</strong> of total expected
          revenue.
        </p>

        <p>
          Estimated appealable recovery opportunity is{" "}
          <strong>${metrics.appealableRecovery.toLocaleString()}</strong> from
          denied claim value.
        </p>
      </div>

      <section className="cards">
        <KpiCard
          title="Expected Revenue"
          value={`$${metrics.expectedRevenue.toLocaleString()}`}
          variant="revenue"
        />

        <KpiCard
          title="Collected Revenue"
          value={`$${metrics.collectedRevenue.toLocaleString()}`}
          variant="health"
        />

        <KpiCard
          title="Revenue Leakage"
          value={`$${metrics.leakageAmount.toLocaleString()}`}
          variant="danger"
        />

        <KpiCard
          title="Leakage Rate"
          value={`${metrics.leakageRate}%`}
          variant="warning"
        />
      </section>

      <section className="table-card">
        <h3>Revenue Leakage Breakdown</h3>

        <table>
          <tbody>
            <tr>
              <td>Denied Claim Value</td>
              <td>${metrics.revenueLost.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Pending Claim Value</td>
              <td>
                $
                {getPendingClaims(claims)
                  .reduce(
                    (sum, claim) => sum + parseNumber(claim.amount),
                    0
                  )
                  .toLocaleString()}
              </td>
            </tr>

            <tr>
              <td>Appealable Recovery Opportunity</td>
              <td>${metrics.appealableRecovery.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Highest-Risk Payer</td>
              <td>{topDeniedPayer ? topDeniedPayer.payer : "None"}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}