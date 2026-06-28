import Papa from "papaparse";
import {
  cleanCSVData,
  standardizeRows,
} from "../utils/helpers";

import appointmentsCSV from "../../sample-data/appointments.csv?raw";
import claimsCSV from "../../sample-data/claims.csv?raw";

function parseDemoCSV(csvText, type) {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const cleanData = cleanCSVData(results.data);
  return standardizeRows(cleanData, type);
}

export const sampleAppointments = parseDemoCSV(
  appointmentsCSV,
  "appointments"
);

export const sampleClaims = parseDemoCSV(
  claimsCSV,
  "claims"
);