export default function Upload({
  uploadMessage,
  handleCSVUpload,
  resetSampleData,
}) {
  return (
    <section className="page-card">
      <h2>Upload Clinic Data</h2>

      <p>
        Upload CSV files. ClinicPulse now recognizes common real-world column
        names and standardizes them automatically.
      </p>

      {uploadMessage && (
        <p style={{ fontWeight: "bold", color: "green" }}>
          {uploadMessage}
        </p>
      )}

      <div className="upload-box">
        <h3>Appointments CSV</h3>

        <p>
          Accepted fields include appointment date, patient ID, and status
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleCSVUpload(e, "appointments")}
        />
      </div>

      <div className="upload-box">
        <h3>Claims CSV</h3>

        <p>
          Accepted fields include date, claim ID, payer, amount, and status
        </p>

        <p>
          Optional field for stronger insights: denial reason / reject reason
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleCSVUpload(e, "claims")}
        />
      </div>

      <button
        onClick={resetSampleData}
        style={{ marginTop: "20px", padding: "10px 14px" }}
      >
        Reset Sample Data
      </button>
    </section>
  );
}
