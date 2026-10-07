// ── Mock Comprehensive Cross-Camp Database ───────────────────────
export const MOCK_REFEREES = {
  "marcus johnson": {
    name: "Marcus Johnson",
    id: "REF-104",
    experienceYears: 6,
    certifiedLevel: "NCAA D2 / High School Varsity",
    overallScore: 9.2,
    campsAttended: 5,
    lastActive: "July 2026",
    camps: ["midwest-2026", "great-lakes-2025", "chicago-2024"],
    history: [
      {
        year: 2026,
        camp: "Midwest Elite Summit",
        campId: "midwest-2026",
        score: 9.4,
        evaluator: "Greg Vance (NCAA D1)",
        notes: "Exceptional court coverage in transition. Calm demeanour during late-game tension. Very strong block/charge judgment.",
        strengths: ["Transition Speed", "Lead Mechanics", "Conflict De-escalation"],
        improvements: ["Trail rotation on skip passes"],
      },
      {
        year: 2025,
        camp: "Great Lakes Ref Camp",
        campId: "great-lakes-2025",
        score: 9.1,
        evaluator: "Mark Henderson",
        notes: "Strong voice and whistle mechanics. Communicates effectively with table and coaches.",
        strengths: ["Whistle Authority", "Bench Decorum"],
        improvements: ["Consistency on hand-check perimeter fouls"],
      },
      {
        year: 2024,
        camp: "Chicago Officiating Clinic",
        campId: "chicago-2024",
        score: 8.9,
        evaluator: "Sarah Jenkins",
        notes: "Promising mechanics; improved rapidly over the weekend.",
        strengths: ["Rules Knowledge", "Physical Conditioning"],
        improvements: ["Pre-game briefing with partners"],
      },
    ],
    stats: {
      positioning: 94,
      rulesKnowledge: 96,
      foulAccuracy: 91,
      gameManagement: 93,
      fitness: 95,
    },
  },
  "david rivera": {
    name: "David Rivera",
    id: "REF-208",
    experienceYears: 4,
    certifiedLevel: "High School Varsity / Junior College",
    overallScore: 8.6,
    campsAttended: 3,
    lastActive: "June 2026",
    camps: ["midwest-2026", "great-lakes-2025"],
    history: [
      {
        year: 2026,
        camp: "Midwest Elite Summit",
        campId: "midwest-2026",
        score: 8.8,
        evaluator: "Greg Vance (NCAA D1)",
        notes: "Great presence in the paint. Needs to avoid getting caught too deep under the basket.",
        strengths: ["Post Play Contact", "Signal Sharpness"],
        improvements: ["Spacing under the rim", "Secondary whistle timing"],
      },
      {
        year: 2025,
        camp: "Windy City Officials Camp",
        campId: "great-lakes-2025",
        score: 8.4,
        evaluator: "Robert Craig",
        notes: "Solid hustle and strong signals. Occasionally rushed out-of-bounds calls.",
        strengths: ["Endurance", "Professional Conduct"],
        improvements: ["Patience on boundary deflections"],
      },
    ],
    stats: {
      positioning: 85,
      rulesKnowledge: 90,
      foulAccuracy: 86,
      gameManagement: 84,
      fitness: 92,
    },
  },
  "elena vasquez": {
    name: "Elena Vasquez",
    id: "REF-312",
    experienceYears: 8,
    certifiedLevel: "NCAA D1 / State Championship Official",
    overallScore: 9.6,
    campsAttended: 7,
    lastActive: "August 2026",
    camps: ["midwest-2026", "chicago-2024"],
    history: [
      {
        year: 2026,
        camp: "National Championship Showcase",
        campId: "midwest-2026",
        score: 9.7,
        evaluator: "Tom Bailey",
        notes: "Elite command of the game. Flawless 3-person mechanics. Excellent coach rapport.",
        strengths: ["3-Person Mechanics", "Decisive Whistles", "Crew Leadership"],
        improvements: ["None noted - ready for D1 postseason"],
      },
      {
        year: 2025,
        camp: "Midwest Elite Summit",
        campId: "midwest-2026",
        score: 9.5,
        evaluator: "Greg Vance (NCAA D1)",
        notes: "Best communicator on the floor. elevated the play of her entire crew.",
        strengths: ["Game Control", "Shooting Foul Accuracy"],
        improvements: ["Minor pacing during blowouts"],
      },
    ],
    stats: {
      positioning: 98,
      rulesKnowledge: 98,
      foulAccuracy: 96,
      gameManagement: 97,
      fitness: 94,
    },
  },
  "alex carter": {
    name: "Alex Carter",
    id: "REF-119",
    experienceYears: 3,
    certifiedLevel: "Sub-Varsity / High School",
    overallScore: 8.1,
    campsAttended: 2,
    lastActive: "July 2025",
    camps: ["great-lakes-2025", "chicago-2024"],
    history: [
      {
        year: 2025,
        camp: "Great Lakes Ref Camp",
        campId: "great-lakes-2025",
        score: 8.2,
        evaluator: "Mark Henderson",
        notes: "High energy official. Improving foul discrimination in transition.",
        strengths: ["Hustle", "Eagerness to Learn"],
        improvements: ["Slow down signals at the table", "Position adjustment as Trail"],
      },
    ],
    stats: {
      positioning: 79,
      rulesKnowledge: 85,
      foulAccuracy: 80,
      gameManagement: 82,
      fitness: 89,
    },
  },
};

export const MOCK_EVALUATORS = {
  "greg vance": {
    name: "Greg Vance",
    id: "EVAL-01",
    role: "NCAA D1 Lead Evaluator",
    camps: ["midwest-2026", "great-lakes-2025", "chicago-2024"],
    evalsSubmitted: 48,
    avgScoreGiven: "9.1",
    variance: "Low (High Consistency)",
    note: "Provides thorough transition mechanics notes and conflict de-escalation ratings.",
  },
  "sarah jenkins": {
    name: "Sarah Jenkins",
    id: "EVAL-02",
    role: "National Clinician & Evaluator",
    camps: ["chicago-2024", "midwest-2026"],
    evalsSubmitted: 36,
    avgScoreGiven: "8.8",
    variance: "Very Low (Benchmark Standard)",
    note: "Specializes in pre-game briefing quality and coach decorum tracking.",
  },
  "mark henderson": {
    name: "Mark Henderson",
    id: "EVAL-03",
    role: "Senior Officials Evaluator",
    camps: ["great-lakes-2025"],
    evalsSubmitted: 32,
    avgScoreGiven: "8.9",
    variance: "Moderate",
    note: "Strong focus on primary whistle authority and boundary call timing.",
  },
  "tom bailey": {
    name: "Tom Bailey",
    id: "EVAL-04",
    role: "Showcase Tournament Evaluator",
    camps: ["midwest-2026"],
    evalsSubmitted: 24,
    avgScoreGiven: "9.3",
    variance: "Low",
    note: "Scouts top varsity officials ready for collegiate D1/D2 postseason recommendation.",
  },
};

/**
 * Get referees filtered by camp scope (or all)
 */
export const getRefereesForCamp = (campScope = "all") => {
  const allRefs = Object.values(MOCK_REFEREES);
  if (!campScope || campScope === "all") return allRefs;
  const filtered = allRefs.filter((ref) => ref.camps?.includes(campScope));
  return filtered.length > 0 ? filtered : allRefs;
};

/**
 * Get evaluators filtered by camp scope (or all)
 */
export const getEvaluatorsForCamp = (campScope = "all") => {
  const allEvals = Object.values(MOCK_EVALUATORS);
  if (!campScope || campScope === "all") return allEvals;
  const filtered = allEvals.filter((ev) => ev.camps?.includes(campScope));
  return filtered.length > 0 ? filtered : allEvals;
};

export const SUGGESTED_PROMPTS = [
  {
    title: "Referee History",
    prompt: "I need the overall history and past 2 years of performance for Marcus Johnson.",
    category: "Official Audit",
    badge: "Marcus Johnson",
  },
  {
    title: "Compare Referees",
    prompt: "Compare Marcus Johnson with David Rivera across all camps.",
    category: "Head-to-Head",
    badge: "Comparison",
  },
  {
    title: "Highest Performers",
    prompt: "Who are the highest-performing referees eligible for postseason recommendation?",
    category: "Rankings",
    badge: "Top Tier",
  },
  {
    title: "Evaluator Insights",
    prompt: "Give me an evaluator reliability breakdown and scoring consistency summary.",
    category: "Evaluators",
    badge: "Staff Audit",
  },
  {
    title: "Camp Analytics",
    prompt: "Summarize the overall camp performance metrics and scoring averages for 2025–2026.",
    category: "Analytics",
    badge: "Camp Metrics",
  },
];

export const INITIAL_WELCOME_TEXT =
  "Hello Director! I'm your **WhistleWorks AI Director Assistant**. Ask me anything about referee historical evaluations, side-by-side head-to-head comparisons, evaluator scoring consistency, or aggregate camp performance metrics.";

/**
 * AI Response Generator based on Director Queries & active Camp Scope
 */
export const generateAiResponse = (userInput, campScope = "all") => {
  const query = userInput.toLowerCase();
  const scopeLabel =
    campScope === "all"
      ? "All Camps (2024–2026)"
      : campScope === "midwest-2026"
      ? "Midwest Elite Summit (2026)"
      : campScope === "great-lakes-2025"
      ? "Great Lakes Ref Camp (2025)"
      : campScope === "chicago-2024"
      ? "Chicago Officiating Clinic (2024)"
      : campScope;

  // 1. Comparison Query
  if (
    query.includes("compare") ||
    (query.includes("vs") &&
      (query.includes("marcus") || query.includes("david") || query.includes("elena") || query.includes("alex")))
  ) {
    const refA = query.includes("elena") ? MOCK_REFEREES["elena vasquez"] : MOCK_REFEREES["marcus johnson"];
    const refB = query.includes("david")
      ? MOCK_REFEREES["david rivera"]
      : query.includes("alex")
      ? MOCK_REFEREES["alex carter"]
      : MOCK_REFEREES["david rivera"];

    return {
      type: "comparison",
      title: `Head-to-Head Comparison: ${refA.name} vs ${refB.name}`,
      refA,
      refB,
      scope: scopeLabel,
      text: `Here is the comprehensive head-to-head performance breakdown across **${scopeLabel}** between **${refA.name}** and **${refB.name}**:`,
      verdict:
        refA.overallScore > refB.overallScore
          ? `**${refA.name}** holds a +${(refA.overallScore - refB.overallScore).toFixed(1)} advantage in overall rating, specifically leading in foul accuracy (${refA.stats.foulAccuracy}% vs ${refB.stats.foulAccuracy}%) and transition positioning.`
          : `**${refB.name}** holds a +${(refB.overallScore - refA.overallScore).toFixed(1)} rating advantage with superior 3-person mechanics leadership.`,
    };
  }

  // 2. Specific Referee History (Marcus, David, Elena, Alex)
  for (const [key, ref] of Object.entries(MOCK_REFEREES)) {
    if (query.includes(key) || query.includes(ref.name.toLowerCase().split(" ")[0])) {
      return {
        type: "referee-history",
        referee: ref,
        scope: scopeLabel,
        text: `Found complete multi-year camp history for **${ref.name}** (ID: ${ref.id}) within **${scopeLabel}**. They have attended **${ref.campsAttended} camps** with an overall average rating of **${ref.overallScore}/10**.`,
      };
    }
  }

  // 3. Specific Evaluator Query (@Greg Vance, etc.)
  for (const [key, ev] of Object.entries(MOCK_EVALUATORS)) {
    if (query.includes(key) || query.includes(ev.name.toLowerCase().split(" ")[0])) {
      return {
        type: "evaluator-report",
        scope: scopeLabel,
        text: `Evaluator Staff Profile & Consistency Audit for **${ev.name}** (${ev.role}) within **${scopeLabel}**:`,
        evaluators: [ev],
      };
    }
  }

  // 4. Highest Performers / Top Referees
  if (
    query.includes("highest") ||
    query.includes("top") ||
    query.includes("best") ||
    query.includes("postseason") ||
    query.includes("ranking")
  ) {
    return {
      type: "top-performers",
      scope: scopeLabel,
      text: `Based on aggregate multi-camp evaluation scorecards across **${scopeLabel}**, here are your top-ranking officials:`,
      list: [
        {
          rank: 1,
          name: "Elena Vasquez",
          score: 9.6,
          camps: 7,
          level: "NCAA D1 / State Finals",
          status: "Recommended for D1 Advancement",
        },
        {
          rank: 2,
          name: "Marcus Johnson",
          score: 9.2,
          camps: 5,
          level: "NCAA D2 / Varsity",
          status: "Ready for Regional Showcase",
        },
        {
          rank: 3,
          name: "David Rivera",
          score: 8.6,
          camps: 3,
          level: "Varsity / JuCo",
          status: "Strong Varsity Lead",
        },
        {
          rank: 4,
          name: "Alex Carter",
          score: 8.1,
          camps: 2,
          level: "Sub-Varsity",
          status: "High Growth Potential",
        },
      ],
    };
  }

  // 5. Evaluator Reliability / History
  if (query.includes("evaluator") || query.includes("grading") || query.includes("consistency")) {
    return {
      type: "evaluator-report",
      scope: scopeLabel,
      text: `Evaluator Reliability & Scoring Consistency Analysis across **${scopeLabel}**:`,
      evaluators: Object.values(MOCK_EVALUATORS),
    };
  }

  // 6. Camp Performance Analytics
  if (
    query.includes("camp") ||
    query.includes("summary") ||
    query.includes("metrics") ||
    query.includes("average")
  ) {
    return {
      type: "camp-metrics",
      scope: scopeLabel,
      text: `Operational & Officiating Analytics Summary for **${scopeLabel}**:`,
      metrics: {
        totalCamps: 6,
        totalRefereesTracked: 142,
        totalEvaluationsLogged: 418,
        averageCampScore: 8.85,
        topSport: "HS Basketball (68%)",
        retentionRate: "78% return rate",
      },
    };
  }

  // 7. Generic Fallback
  return {
    type: "generic",
    scope: scopeLabel,
    text: `I've analyzed your query against all camp records, official registries, and evaluator notes for **${scopeLabel}**.

Here is what I found in the active index:
• **Scope**: ${scopeLabel}
• **Indexed Roster**: 142 Referees, 8 Evaluators, 6 Camp Sessions.
• **Suggestions**:
  - Mention an official or evaluator using **@** (e.g. *"@Marcus Johnson performance"* or *"@Greg Vance notes"*)
  - Compare two officials: *"Compare @Marcus Johnson vs @David Rivera"*
  - Surface top candidates: *"Who are the highest-performing referees?"*
  - Review evaluator grading: *"Show evaluator reliability"*`,
  };
};

/**
 * Formats and downloads a specific AI response as a structured text/markdown report
 */
export const exportAiResponseToFile = (message) => {
  if (!message) return;

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let reportContent = `# WHISTLEWORKS AI DIRECTOR REPORT\n`;
  reportContent += `Generated: ${dateStr} at ${timeStr}\n`;
  reportContent += `Scope: ${message.scope || "All Camps"}\n`;
  reportContent += `==========================================================\n\n`;

  reportContent += `## SUMMARY\n${message.text}\n\n`;

  if (message.type === "referee-history" && message.referee) {
    const ref = message.referee;
    reportContent += `## REFEREE PROFILE: ${ref.name} (ID: ${ref.id})\n`;
    reportContent += `- Certified Level: ${ref.certifiedLevel}\n`;
    reportContent += `- Experience: ${ref.experienceYears} Years\n`;
    reportContent += `- Overall Rating: ${ref.overallScore}/10\n`;
    reportContent += `- Total Camps Attended: ${ref.campsAttended}\n\n`;

    reportContent += `### MECHANICS & SKILLS METRICS\n`;
    reportContent += `- Positioning & Floor Spacing: ${ref.stats.positioning}%\n`;
    reportContent += `- Rules & Foul Accuracy: ${ref.stats.foulAccuracy}%\n`;
    reportContent += `- Rules Knowledge: ${ref.stats.rulesKnowledge}%\n`;
    reportContent += `- Game Management: ${ref.stats.gameManagement}%\n`;
    reportContent += `- Physical Fitness: ${ref.stats.fitness}%\n\n`;

    reportContent += `### EVALUATION HISTORY\n`;
    ref.history.forEach((h, idx) => {
      reportContent += `${idx + 1}. [${h.year}] ${h.camp} — Rating: ${h.score}/10\n`;
      reportContent += `   Evaluator: ${h.evaluator}\n`;
      reportContent += `   Notes: "${h.notes}"\n`;
      reportContent += `   Strengths: ${h.strengths?.join(", ") || "N/A"}\n`;
      reportContent += `   Areas of Growth: ${h.improvements?.join(", ") || "N/A"}\n\n`;
    });
  } else if (message.type === "comparison" && message.refA && message.refB) {
    reportContent += `## HEAD-TO-HEAD COMPARISON\n`;
    reportContent += `[Official A: ${message.refA.name}] vs [Official B: ${message.refB.name}]\n\n`;
    reportContent += `Metric | ${message.refA.name} | ${message.refB.name}\n`;
    reportContent += `---|---|---\n`;
    reportContent += `Overall Score | ${message.refA.overallScore}/10 | ${message.refB.overallScore}/10\n`;
    reportContent += `Experience | ${message.refA.experienceYears} Years | ${message.refB.experienceYears} Years\n`;
    reportContent += `Camps Attended | ${message.refA.campsAttended} | ${message.refB.campsAttended}\n`;
    reportContent += `Foul Accuracy | ${message.refA.stats.foulAccuracy}% | ${message.refB.stats.foulAccuracy}%\n`;
    reportContent += `Positioning | ${message.refA.stats.positioning}% | ${message.refB.stats.positioning}%\n\n`;
    reportContent += `### AI RECOMMENDATION & VERDICT\n${message.verdict}\n\n`;
  } else if (message.type === "top-performers" && message.list) {
    reportContent += `## TOP-RANKING OFFICIALS\n`;
    message.list.forEach((item) => {
      reportContent += `#${item.rank} - ${item.name} | Score: ${item.score}/10 | Level: ${item.level} | Status: ${item.status}\n`;
    });
    reportContent += `\n`;
  } else if (message.type === "evaluator-report" && message.evaluators) {
    reportContent += `## EVALUATOR RELIABILITY & VARIANCE BREAKDOWN\n`;
    message.evaluators.forEach((ev) => {
      reportContent += `- ${ev.name}: ${ev.evalsSubmitted} Evaluations (${ev.camps?.length || 1} Camps) | Avg Score: ${ev.avgScoreGiven} | Variance: ${ev.variance}\n`;
      reportContent += `  Notes: ${ev.note}\n`;
    });
    reportContent += `\n`;
  } else if (message.type === "camp-metrics" && message.metrics) {
    reportContent += `## CAMP OPERATIONAL METRICS\n`;
    reportContent += `- Total Camps: ${message.metrics.totalCamps}\n`;
    reportContent += `- Total Referees Tracked: ${message.metrics.totalRefereesTracked}\n`;
    reportContent += `- Total Evaluations Logged: ${message.metrics.totalEvaluationsLogged}\n`;
    reportContent += `- Average Camp Score: ${message.metrics.averageCampScore}/10\n`;
    reportContent += `- Retention Rate: ${message.metrics.retentionRate}\n\n`;
  }

  reportContent += `----------------------------------------------------------\n`;
  reportContent += `WhistleWorks Officiating Platform • Confidential Director Intelligence\n`;

  const blob = new Blob([reportContent], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `whistleworks-ai-report-${(message.type || "insights").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.md`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
};
