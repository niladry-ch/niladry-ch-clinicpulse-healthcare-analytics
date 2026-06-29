import React, { useMemo, useState } from "react";

import Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import Claims from "./components/pages/Claims";
import Revenue from "./components/pages/Revenue";
import Clinical from "./components/pages/Clinical";
import Predictive from "./components/pages/Predictive";
import Population from "./components/pages/Population";
import UploadPage from "./components/pages/Upload";
import Reports from "./components/pages/Reports";
import SettingsPage from "./components/pages/Settings";

import {
  parseNumber,
  cleanCSVData,
  standardizeRows,
} from "./utils/helpers";

import {
  getApprovedClaims,
  getDeniedClaims,
  getPendingClaims,
  getCompletedAppointments,
  getNoShowAppointments,
  getCancelledAppointments,
  groupRevenueByDate,
  groupClaimsByPayer,
  groupDeniedClaimsByPayer,
  groupDeniedClaimsByReason,
  getTopDeniedPayer,
  getTopDenialReason,
  getPayerRiskRanking,
  getClaimRiskScore,
  getClaimRiskLevel,
  calculateHealthScore,
  getPriorityActions,
} from "./utils/analytics";

import {
  sampleAppointments,
  sampleClaims,
} from "./data/sampleData";

import "./style.css";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";






export default function ClinicPulseDashboard() {
  const [page, setPage] = useState("dashboard");
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [claims, setClaims] = useState(sampleClaims);
  const [uploadMessage, setUploadMessage] = useState("");
  const [themeMode, setThemeMode] = useState("light");
  const navigate = useNavigate();

async function handleLogout() {
  await supabase.auth.signOut();
  navigate("/login");
}

  const metrics = useMemo(() => {

    const totalAppointments = appointments.length;
    const completed = getCompletedAppointments(appointments).length;
    const noShows = getNoShowAppointments(appointments).length;
    const cancelled = getCancelledAppointments(appointments).length;

    const totalClaims = claims.length;
    const approvedClaims = getApprovedClaims(claims).length;
    const deniedClaims = getDeniedClaims(claims).length;
    const pendingClaims = getPendingClaims(claims).length;

    const revenue = getApprovedClaims(claims).reduce(
      (sum, claim) => sum + parseNumber(claim.amount),
      0
    );

    const revenueLost = getDeniedClaims(claims).reduce(
      (sum, claim) => sum + parseNumber(claim.amount),
      0
    );

    const expectedRevenue = claims.reduce(
      (sum, claim) => sum + parseNumber(claim.amount),
      0
    );

    const collectedRevenue = revenue;
    const leakageAmount = Math.max(expectedRevenue - collectedRevenue, 0);
    const leakageRate = expectedRevenue
      ? ((leakageAmount / expectedRevenue) * 100).toFixed(1)
      : "0.0";

    const appealableRecovery = getDeniedClaims(claims).reduce(
      (sum, claim) => sum + parseNumber(claim.amount),
      0
      
    );

    return {
      totalAppointments,
      completed,
      noShows,
      cancelled,
      noShowRate: totalAppointments
        ? ((noShows / totalAppointments) * 100).toFixed(1)
        : "0.0",
      totalClaims,
      approvedClaims,
      deniedClaims,
      pendingClaims,
      denialRate: totalClaims
        ? ((deniedClaims / totalClaims) * 100).toFixed(1)
        : "0.0",
      revenue,
      revenueLost,
      expectedRevenue,
      collectedRevenue,
      leakageAmount,
      leakageRate,
      appealableRecovery,
    };
  }, [appointments, claims]);

  const revenueByDate = useMemo(() => groupRevenueByDate(claims), [claims]);
  const payerData = useMemo(() => groupClaimsByPayer(claims), [claims]);
  const deniedPayerData = useMemo(() => groupDeniedClaimsByPayer(claims), [claims]);
  const denialReasonData = useMemo(() => groupDeniedClaimsByReason(claims), [claims]);
  const topDeniedPayer = useMemo(() => getTopDeniedPayer(claims), [claims]);
  const topDenialReason = useMemo(() => getTopDenialReason(claims), [claims]);
  const payerRiskRanking = useMemo(() => getPayerRiskRanking(claims), [claims]);
  const healthScore = useMemo(() => calculateHealthScore(metrics), [metrics]);

  const claimRiskRows = useMemo(
    () =>
      claims.map((claim) => ({
        ...claim,
        riskScore: getClaimRiskScore(claim),
        riskLevel: getClaimRiskLevel(claim),
      })),
    [claims]
  );

  const priorityActions = useMemo(
    () => getPriorityActions(metrics, topDeniedPayer, topDenialReason),
    [metrics, topDeniedPayer, topDenialReason]
  );

  function handleCSVUpload(event, type) {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanData = cleanCSVData(results.data);
        const standardizedData = standardizeRows(cleanData, type);

        if (type === "appointments") {
          setAppointments(standardizedData);
          setUploadMessage(
            `Appointments uploaded and standardized: ${standardizedData.length} rows from ${file.name}`
          );
        }

        if (type === "claims") {
          setClaims(standardizedData);
          setUploadMessage(
            `Claims uploaded and standardized: ${standardizedData.length} rows from ${file.name}`
          );
        }

        event.target.value = "";
      },
      error: () => {
        alert("Could not read CSV file.");
      },
    });
  }

  async function exportPDF() {
    const element = document.getElementById("monthly-report");

    if (!element) {
      alert("Report section was not found.");
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("ClinicPulse_Monthly_Report.pdf");
    } catch (error) {
      alert("Could not export PDF report.");
    }
  }

  function resetSampleData() {
    setAppointments(sampleAppointments);
    setClaims(sampleClaims);
    setUploadMessage("Sample data restored.");
  }

  return (
    <div className={`app ${themeMode}`}>
      <Sidebar
          page={page}
  setPage={setPage}
  themeMode={themeMode}
  setThemeMode={setThemeMode}
  handleLogout={handleLogout}
      />

      <main className="main">
        {page === "dashboard" && (
          <Dashboard
            metrics={metrics}
            healthScore={healthScore}
            revenueByDate={revenueByDate}
            payerData={payerData}
          />
        )}

        {page === "claims" && (
          <Claims
            metrics={metrics}
            topDeniedPayer={topDeniedPayer}
            topDenialReason={topDenialReason}
            deniedPayerData={deniedPayerData}
            denialReasonData={denialReasonData}
            payerRiskRanking={payerRiskRanking}
            claimRiskRows={claimRiskRows}
            priorityActions={priorityActions}
            parseNumber={parseNumber}
          />
        )}

        {page === "revenue" && (
          <Revenue
            metrics={metrics}
            topDeniedPayer={topDeniedPayer}
            claims={claims}
            getPendingClaims={getPendingClaims}
            parseNumber={parseNumber}
          />
        )}

        {page === "clinical" && <Clinical />}

        {page === "predictive" && (
          <Predictive claimRiskRows={claimRiskRows} />
        )}

        {page === "population" && <Population />}

        {page === "upload" && (
          <UploadPage
            uploadMessage={uploadMessage}
            handleCSVUpload={handleCSVUpload}
            resetSampleData={resetSampleData}
          />
        )}

        {page === "reports" && (
          <Reports
            exportPDF={exportPDF}
            metrics={metrics}
            healthScore={healthScore}
            topDeniedPayer={topDeniedPayer}
            topDenialReason={topDenialReason}
            priorityActions={priorityActions}
          />
        )}

        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}


