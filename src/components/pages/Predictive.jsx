export default function Predictive({ claimRiskRows }) {
  return (
    <section className="page-card">
      <h2>Predictive Analytics</h2>

      <div className="report">
        <h3>Rule-Based Predictive Intelligence</h3>

        <p>
          This MVP uses transparent business rules to estimate claim risk.
          Later, this can be replaced or enhanced with a machine learning model
          trained on historical claim outcomes.
        </p>
      </div>

      <section className="table-card">
        <h3>Claim Risk Preview</h3>

        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Payer</th>
              <th>Status</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
            </tr>
          </thead>

          <tbody>
            {claimRiskRows.map((claim) => (
              <tr key={claim.claim_id}>
                <td>{claim.claim_id}</td>
                <td>{claim.payer}</td>
                <td>{claim.status}</td>
                <td>{claim.riskScore}/100</td>
                <td>{claim.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="table-card">
        <h3>Future Capabilities</h3>

        <table>
          <tbody>
            <tr>
              <td>Disease risk prediction</td>
            </tr>

            <tr>
              <td>Early detection analytics</td>
            </tr>

            <tr>
              <td>AI-assisted diagnostics</td>
            </tr>

            <tr>
              <td>Predictive healthcare intelligence</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}