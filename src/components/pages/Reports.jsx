export default function Reports({
  exportPDF,
  metrics,
  healthScore,
  topDeniedPayer,
  topDenialReason,
  priorityActions,
}) {
  return (
    <section className="page-card">
      <h2>Monthly Report</h2>

      <p>
        Export a PDF version of the current ClinicPulse performance summary.
      </p>

      <button
        onClick={exportPDF}
        style={{ marginBottom: "20px", padding: "10px 14px" }}
      >
        Export PDF Report
      </button>

      <div id="monthly-report" className="report">
        <h3>Clinic Performance Summary</h3>

        <p>
          Total approved revenue:
          <strong> ${metrics.revenue.toLocaleString()}</strong>
        </p>

        <p>
          Total appointments:
          <strong> {metrics.totalAppointments}</strong>
        </p>

        <p>
          No-show rate:
          <strong> {metrics.noShowRate}%</strong>
        </p>

        <p>
          Claim denial rate:
          <strong> {metrics.denialRate}%</strong>
        </p>

        <p>
          Operational health score:
          <strong> {healthScore}/100</strong>
        </p>

        <p>
          Expected revenue:
          <strong> ${metrics.expectedRevenue.toLocaleString()}</strong>
        </p>

        <p>
          Estimated revenue leakage:
          <strong> ${metrics.leakageAmount.toLocaleString()}</strong>
        </p>

        <p>
          Revenue leakage rate:
          <strong> {metrics.leakageRate}%</strong>
        </p>

        <p>
          Estimated denied revenue:
          <strong> ${metrics.revenueLost.toLocaleString()}</strong>
        </p>

        {topDeniedPayer && (
          <p>
            Highest denial contributor:
            <strong> {topDeniedPayer.payer}</strong>.
          </p>
        )}

        {topDenialReason && (
          <p>
            Top denial reason:
            <strong> {topDenialReason.reason}</strong>.
          </p>
        )}

        <h4>Priority Actions</h4>

        <ol>
          {priorityActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}