export const sampleAppointments = [
  { date: "2026-06-01", patient_id: "P001", status: "Completed" },
  { date: "2026-06-01", patient_id: "P002", status: "No Show" },
  { date: "2026-06-02", patient_id: "P003", status: "Completed" },
  { date: "2026-06-03", patient_id: "P004", status: "Cancelled" },
  { date: "2026-06-04", patient_id: "P005", status: "Completed" },
  { date: "2026-06-05", patient_id: "P006", status: "Completed" },
];

export const sampleClaims = [
  {
    date: "2026-06-01",
    claim_id: "C001",
    payer: "BCBS",
    amount: 1200,
    status: "Approved",
    reason: "",
  },
  {
    date: "2026-06-01",
    claim_id: "C002",
    payer: "Aetna",
    amount: 850,
    status: "Denied",
    reason: "Eligibility",
  },
  {
    date: "2026-06-02",
    claim_id: "C003",
    payer: "Medicare",
    amount: 1500,
    status: "Approved",
    reason: "",
  },
  {
    date: "2026-06-02",
    claim_id: "C004",
    payer: "BCBS",
    amount: 900,
    status: "Denied",
    reason: "Coding",
  },
  {
    date: "2026-06-03",
    claim_id: "C005",
    payer: "BCBS",
    amount: 1300,
    status: "Denied",
    reason: "Eligibility",
  },
  {
    date: "2026-06-04",
    claim_id: "C006",
    payer: "Aetna",
    amount: 600,
    status: "Pending",
    reason: "",
  },
];