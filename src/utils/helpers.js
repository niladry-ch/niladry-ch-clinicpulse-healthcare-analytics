export function normalizeText(value) {
  return String(value || "").trim();
}

export function normalizeStatus(value) {
  const status = normalizeText(value).toLowerCase();
    if (["complete", "completed"].includes(status)) {
    return "completed";
  }

  if (
    [
      "no show",
      "no-show",
      "noshow",
      "missed",
      "absent",
      "did not show",
    ].includes(status)
  ) {
    return "no show";
  }

  if (["cancelled", "canceled", "cancel", "void"].includes(status)) {
    return "cancelled";
  }

  // Claim statuses
  if (
    [
      "approved",
      "approve",
      "paid",
      "p",
      "accepted",
      "processed",
      "closed",
      "success",
    ].includes(status)
  ) {
    return "approved";
  }

  if (
    [
      "denied",
      "deny",
      "rejected",
      "reject",
      "declined",
      "not paid",
      "unpaid",
      "failed",
      "d",
    ].includes(status)
  ) {
    return "denied";
  }

  if (
    [
      "pending",
      "in review",
      "under review",
      "processing",
      "open",
      "submitted",
      "waiting",
      "pended",
    ].includes(status)
  ) {
    return "pending";
  }

  return status;
}

export function parseNumber(value) {
  const cleanedValue = String(value ?? "")
    .replace(/[$,%]/g, "")
    .replace(/,/g, "")
    .trim();

  const n = Number(cleanedValue);
  return Number.isFinite(n) ? n : 0;
}

export function cleanCSVData(data) {
  return data.map((row) => {
    const cleaned = {};

    Object.keys(row).forEach((key) => {
      const cleanKey = key.trim();
      const value = row[key];

      cleaned[cleanKey] =
        typeof value === "string" ? value.trim() : value;
    });

    return cleaned;
  });
}

export const columnAliases = {
  claims: {
    date: [
      "date",
      "service date",
      "date of service",
      "dos",
      "claim date",
      "service_date",
      "date_of_service",
      "visit date",
    ],

    claim_id: [
      "claim_id",
      "claim id",
      "claim number",
      "claim no",
      "claim #",
      "claimid",
      "claim_number",
      "id",
      "transaction id",
      "encounter id",
    ],

    payer: [
      "payer",
      "payer name",
      "insurance",
      "insurance payer",
      "insurance company",
      "insurance provider",
      "insurance carrier",
      "carrier",
      "health plan",
      "plan",
      "plan name",
      "primary insurance",
      "secondary insurance",
      "payor",
      "payor name",
    ],

    amount: [
      "amount",
      "claim amount",
      "charge",
      "charges",
      "charge amount",
      "billed amount",
      "billed_amount",
      "total amount",
      "total charges",
      "claim charge",
      "claim_charge",
      "allowed amount",
      "paid amount",
      "payment amount",
      "charge_amt",
      "billed_amt",
      "claim value",
    ],

    status: [
      "status",
      "claim status",
      "claim_status",
      "claim result",
      "result",
      "outcome",
      "claim outcome",
      "era status",
      "payment status",
      "claim state",
    ],

    reason: [
      "reason",
      "denial reason",
      "denial_reason",
      "reject reason",
      "rejection reason",
      "denial code",
      "denial_code",
      "adjustment reason",
      "remark",
      "remarks",
      "reason code",
      "adj_code",
    ],
  },

  appointments: {
    date: [
      "date",
      "appointment date",
      "appt date",
      "visit date",
      "service date",
      "scheduled date",
      "dos",
    ],

    patient_id: [
      "patient_id",
      "patient id",
      "patient number",
      "patient no",
      "patient",
      "member id",
      "member_id",
      "mrn",
      "medical record number",
      "client id",
    ],

    status: [
      "status",
      "appointment status",
      "appt status",
      "visit status",
      "attendance",
      "appointment outcome",
      "outcome",
    ],
  },
};export function normalizeColumnName(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
}

export function findColumn(headers, aliases) {
  const normalizedAliases = aliases.map(normalizeColumnName);

  const exactMatch = headers.find((header) =>
    normalizedAliases.includes(normalizeColumnName(header))
  );

  if (exactMatch) return exactMatch;

  return headers.find((header) => {
    const normalizedHeader = normalizeColumnName(header);

    return normalizedAliases.some(
      (alias) =>
        normalizedHeader.includes(alias) ||
        alias.includes(normalizedHeader)
    );
  });
}

export function standardizeRows(data, type) {
  if (!data.length) return [];

  const headers = Object.keys(data[0]);
  const aliases = columnAliases[type];

  if (!aliases) return data;

  if (type === "claims") {
    const dateColumn = findColumn(headers, aliases.date);
    const claimIdColumn = findColumn(headers, aliases.claim_id);
    const payerColumn = findColumn(headers, aliases.payer);
    const amountColumn = findColumn(headers, aliases.amount);
    const statusColumn = findColumn(headers, aliases.status);
    const reasonColumn = findColumn(headers, aliases.reason);

    return data.map((row, index) => ({
      date: dateColumn ? normalizeText(row[dateColumn]) : "",
      claim_id: claimIdColumn
        ? normalizeText(row[claimIdColumn])
        : `CLAIM-${index + 1}`,
      payer: payerColumn
        ? normalizeText(row[payerColumn])
        : "Unknown",
      amount: amountColumn
        ? parseNumber(row[amountColumn])
        : 0,
      status: statusColumn
        ? normalizeStatus(row[statusColumn])
        : "unknown",
      reason: reasonColumn
        ? normalizeText(row[reasonColumn])
        : "",
    }));
  }

  if (type === "appointments") {
    const dateColumn = findColumn(headers, aliases.date);
    const patientIdColumn = findColumn(headers, aliases.patient_id);
    const statusColumn = findColumn(headers, aliases.status);

    return data.map((row, index) => ({
      date: dateColumn
        ? normalizeText(row[dateColumn])
        : "",
      patient_id: patientIdColumn
        ? normalizeText(row[patientIdColumn])
        : `PATIENT-${index + 1}`,
      status: statusColumn
        ? normalizeStatus(row[statusColumn])
        : "unknown",
    }));
  }

  return data;
}