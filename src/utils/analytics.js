import {
  normalizeStatus,
  normalizeText,
  parseNumber,
} from "./helpers";

export function getApprovedClaims(claims) {
  return claims.filter((c) => normalizeStatus(c.status) === "approved");
}

export function getDeniedClaims(claims) {
  return claims.filter((c) => normalizeStatus(c.status) === "denied");
}

export function getPendingClaims(claims) {
  return claims.filter((c) => normalizeStatus(c.status) === "pending");
}

export function getCompletedAppointments(appointments) {
  return appointments.filter((a) => normalizeStatus(a.status) === "completed");
}

export function getNoShowAppointments(appointments) {
  return appointments.filter((a) => normalizeStatus(a.status) === "no show");
}

export function getCancelledAppointments(appointments) {
  return appointments.filter((a) => normalizeStatus(a.status) === "cancelled");
}

export function groupRevenueByDate(claims) {
  const map = {};

  getApprovedClaims(claims).forEach((claim) => {
    const date = normalizeText(claim.date) || "Unknown";
    map[date] = (map[date] || 0) + parseNumber(claim.amount);
  });

  return Object.entries(map)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function groupClaimsByPayer(claims) {
  const map = {};

  claims.forEach((claim) => {
    const payer = normalizeText(claim.payer) || "Unknown";
    map[payer] = (map[payer] || 0) + 1;
  });

  return Object.entries(map).map(([payer, count]) => ({ payer, count }));
}

export function groupDeniedClaimsByPayer(claims) {
  const map = {};

  getDeniedClaims(claims).forEach((claim) => {
    const payer = normalizeText(claim.payer) || "Unknown";

    if (!map[payer]) {
      map[payer] = {
        payer,
        deniedCount: 0,
        lostRevenue: 0,
      };
    }

    map[payer].deniedCount += 1;
    map[payer].lostRevenue += parseNumber(claim.amount);
  });

  return Object.values(map).sort((a, b) => b.lostRevenue - a.lostRevenue);
}

export function groupDeniedClaimsByReason(claims) {
  const map = {};

  getDeniedClaims(claims).forEach((claim) => {
    const reason = normalizeText(claim.reason) || "Not Specified";

    if (!map[reason]) {
      map[reason] = {
        reason,
        count: 0,
        lostRevenue: 0,
      };
    }

    map[reason].count += 1;
    map[reason].lostRevenue += parseNumber(claim.amount);
  });

  return Object.values(map).sort((a, b) => b.lostRevenue - a.lostRevenue);
}

export function getTopDeniedPayer(claims) {
  const deniedByPayer = groupDeniedClaimsByPayer(claims);
  return deniedByPayer.length > 0 ? deniedByPayer[0] : null;
}

export function getTopDenialReason(claims) {
  const deniedByReason = groupDeniedClaimsByReason(claims);
  return deniedByReason.length > 0 ? deniedByReason[0] : null;
}

export function getPayerRiskRanking(claims) {
  return groupDeniedClaimsByPayer(claims);
}

export function getClaimRiskScore(claim) {
  let score = 0;

  const amount = parseNumber(claim.amount);
  const payer = normalizeText(claim.payer).toLowerCase();
  const reason = normalizeText(claim.reason);
  const status = normalizeStatus(claim.status);

  if (amount >= 1000) score += 25;
  if (["bcbs", "aetna", "unitedhealth"].includes(payer)) score += 15;
  if (reason) score += 20;
  if (status === "denied") score += 30;
  if (status === "pending") score += 10;

  return Math.min(score, 100);
}

export function getClaimRiskLevel(claim) {
  const score = getClaimRiskScore(claim);

  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium Risk";

  return "Low Risk";
}

export function calculateHealthScore(metrics) {
  let score = 100;

  // Moderate penalties
  score -= Number(metrics.denialRate) * 1.0;
  score -= Number(metrics.noShowRate) * 0.8;
  score -= Number(metrics.leakageRate) * 0.5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getPriorityActions(metrics, topDeniedPayer, topDenialReason) {
  const actions = [];

  if (Number(metrics.denialRate) >= 10) {
    actions.push(
      "Investigate claim denial workflows because the denial rate is above a healthy operating threshold."
    );
  }

  if (topDeniedPayer) {
    actions.push(
      `Audit denied claims from ${topDeniedPayer.payer}, which is currently the highest-risk payer.`
    );
  }

  if (topDenialReason) {
    actions.push(
      `Review ${topDenialReason.reason.toLowerCase()} related denials and strengthen front-end verification or documentation steps.`
    );
  }

  if (metrics.revenueLost > 0) {
    actions.push(
      `Prioritize recovery of approximately $${metrics.revenueLost.toLocaleString()} in denied claim value.`
    );
  }

  if (actions.length === 0) {
    actions.push("No major claim risk detected from the current dataset.");
  }

  return actions;
}