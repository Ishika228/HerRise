import jsPDF from 'jspdf';
import { BusinessPlan } from '../types';
import { GeneratedIdeaPlan } from '../pages/HerBusiness/components/BusinessIdeaGenerator';

/**
 * Sanitizes text for standard jsPDF fonts (converts ₹ to 'Rs. ', curly quotes to plain ASCII,
 * removes unprintable unicode glyphs that cause blank or corrupt text)
 */
function clean(str?: string | number): string {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/₹/g, 'Rs. ')
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, '-')
    .replace(/[✓✔]/g, '[v]')
    .replace(/[⚠️⚡🔥🌿✨📚☕💡🚀🎯📢⚖️]/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// =========================================================================
// 1. AI GENERATED BUSINESS BLUEPRINT PDF (Exact website matching)
// =========================================================================
export function downloadGeneratedBlueprintPdf(blueprint: GeneratedIdeaPlan): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 35) {
      addFooter();
      doc.addPage();
      cursorY = margin + 10;
      drawHeaderAccent();
    }
  };

  const drawHeaderAccent = () => {
    doc.setFillColor(74, 21, 75); // #4A154B
    doc.rect(margin, 16, contentWidth, 3, 'F');
  };

  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `HerRise AI Entrepreneurship Studio  |  Official Business Blueprint  |  Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 18,
      { align: 'center' }
    );
  };

  drawHeaderAccent();

  // ─── HERO HEADER BANNER (Matches Website Purple Gradient Header) ────────
  doc.setFillColor(74, 21, 75); // #4A154B
  doc.roundedRect(margin, cursorY, contentWidth, 80, 8, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(244, 114, 182); // pink-300
  doc.text('HERRISE AI ENTREPRENEURSHIP INCUBATOR STUDIO', margin + 16, cursorY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(clean(blueprint.businessName), margin + 16, cursorY + 42);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(243, 232, 255); // purple-100
  const taglineStr = clean(`"${blueprint.tagline}"`);
  doc.text(taglineStr, margin + 16, cursorY + 60);

  // Industry & Level Badges on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Sector: ${clean(blueprint.industry)}`, margin + contentWidth - 16, cursorY + 20, { align: 'right' });
  doc.text(`Level: ${clean(blueprint.difficulty)}`, margin + contentWidth - 16, cursorY + 36, { align: 'right' });

  cursorY += 95;

  // ─── 4 METRIC CARDS (Matches Website Est. Capital, Margin, Revenue, Breakeven) ───
  const cardGap = 8;
  const cardW = (contentWidth - cardGap * 3) / 4;
  const cardH = 46;

  const metricCards = [
    { label: 'EST. STARTING CAPITAL', val: clean(blueprint.initialInvestment), color: [243, 232, 255], border: [216, 180, 254], textCol: [74, 21, 75] },
    { label: 'TARGET GROSS MARGIN', val: clean(blueprint.profitMargin), color: [236, 253, 245], border: [167, 243, 208], textCol: [6, 95, 70] },
    { label: 'YEAR 1 REVENUE', val: clean(blueprint.projectedRevenueYear1), color: [253, 242, 248], border: [251, 207, 232], textCol: [190, 24, 93] },
    { label: 'BREAKEVEN HORIZON', val: clean(blueprint.breakevenTimeline), color: [254, 243, 199], border: [253, 230, 138], textCol: [146, 64, 14] }
  ];

  metricCards.forEach((c, idx) => {
    const x = margin + idx * (cardW + cardGap);
    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.setDrawColor(c.border[0], c.border[1], c.border[2]);
    doc.roundedRect(x, cursorY, cardW, cardH, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 110, 110);
    doc.text(c.label, x + 8, cursorY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(c.textCol[0], c.textCol[1], c.textCol[2]);
    const valLines = doc.splitTextToSize(c.val, cardW - 14);
    doc.text(valLines[0] || c.val, x + 8, cursorY + 32);
  });

  cursorY += cardH + 18;

  // ─── PART 1: The Problem & The Solution (Matches Website Exact Cards) ────
  checkPageBreak(90);

  // 1. The Core Market Problem
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('THE CORE MARKET PROBLEM', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const probLines = doc.splitTextToSize(clean(blueprint.problemStatement), contentWidth);
  checkPageBreak(probLines.length * 13 + 10);
  doc.text(probLines, margin, cursorY);
  cursorY += probLines.length * 13 + 14;

  // 2. Your Proposed Solution & Edge
  checkPageBreak(90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('YOUR PROPOSED SOLUTION & EDGE', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const solLines = doc.splitTextToSize(clean(blueprint.solution), contentWidth);
  checkPageBreak(solLines.length * 13 + 24);
  doc.text(solLines, margin, cursorY);
  cursorY += solLines.length * 13 + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(74, 21, 75);
  const uspLines = doc.splitTextToSize(`USP: ${clean(blueprint.uniqueSellingProposition)}`, contentWidth);
  doc.text(uspLines, margin, cursorY);
  cursorY += uspLines.length * 13 + 16;

  // ─── PART 2: Target Customer Profile & Persona (Matches Website Exact Cards) ──
  checkPageBreak(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('TARGET CUSTOMER PROFILE & PERSONA', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  const personaItems = [
    { label: 'Demographics', text: blueprint.targetAudience.demographics },
    { label: 'Psychographics & Lifestyle', text: blueprint.targetAudience.psychographics },
    { label: 'Primary Buying Trigger', text: blueprint.targetAudience.painPoint }
  ];

  personaItems.forEach((item) => {
    checkPageBreak(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 21, 75);
    doc.text(`[+] ${clean(item.label)}:`, margin, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const bodyLines = doc.splitTextToSize(clean(item.text), contentWidth - 140);
    doc.text(bodyLines, margin + 130, cursorY);
    cursorY += Math.max(16, bodyLines.length * 12 + 4);
  });
  cursorY += 10;

  // ─── PART 3: Tiered Product Architecture & Pricing Strategy (Matches Website) ──
  checkPageBreak(90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('TIERED PRODUCT ARCHITECTURE & PRICING STRATEGY', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  blueprint.productTiers.forEach((tier) => {
    checkPageBreak(40);
    doc.setFillColor(250, 247, 252);
    doc.setDrawColor(230, 220, 240);
    doc.roundedRect(margin, cursorY - 8, contentWidth, 34, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(74, 21, 75);
    doc.text(`${clean(tier.tierName)}  --  Price: ${clean(tier.price)}`, margin + 10, cursorY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text(`Margin: ${clean(tier.margin)}  (COGS: ${clean(tier.cogs)})`, margin + contentWidth - 10, cursorY + 4, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const descLines = doc.splitTextToSize(clean(tier.description), contentWidth - 20);
    doc.text(descLines, margin + 10, cursorY + 18);
    cursorY += 40;
  });
  cursorY += 8;

  // ─── PART 4: Step-by-Step 4-Phase Launch Roadmap (Matches Website) ────────
  checkPageBreak(90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('STEP-BY-STEP 4-PHASE LAUNCH ROADMAP', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 14;

  blueprint.roadmapPhases.forEach((phase) => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(190, 24, 93);
    doc.text(`${clean(phase.phase)}  [Timeline: ${clean(phase.timeline)}]`, margin, cursorY);
    cursorY += 12;

    phase.tasks.forEach((task) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      const tLines = doc.splitTextToSize(`[v]  ${clean(task)}`, contentWidth - 10);
      doc.text(tLines, margin + 10, cursorY);
      cursorY += tLines.length * 11.5 + 2;
    });
    cursorY += 6;
  });

  // ─── PART 5: Itemized Startup Budget & Capital Allocation (Matches Website) ──
  checkPageBreak(90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('ITEMIZED STARTUP BUDGET & CAPITAL ALLOCATION', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  // Table header
  doc.setFillColor(245, 240, 250);
  doc.rect(margin, cursorY, contentWidth, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('Budget Category / Description', margin + 8, cursorY + 11);
  doc.text('Estimated Cost (INR)', margin + contentWidth - 10, cursorY + 11, { align: 'right' });
  cursorY += 20;

  let totalAllocated = 0;
  blueprint.startupBudget.forEach((item, idx) => {
    checkPageBreak(18);
    totalAllocated += item.cost;
    if (idx % 2 === 1) {
      doc.setFillColor(252, 250, 254);
      doc.rect(margin, cursorY - 10, contentWidth, 16, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    const itemText = `${clean(item.category)} - ${clean(item.description)}`;
    const itLines = doc.splitTextToSize(itemText, contentWidth - 110);
    doc.text(itLines, margin + 8, cursorY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${item.cost.toLocaleString('en-IN')}`, margin + contentWidth - 10, cursorY, { align: 'right' });
    cursorY += Math.max(16, itLines.length * 10 + 4);
  });

  checkPageBreak(24);
  doc.setDrawColor(180, 160, 200);
  doc.line(margin, cursorY - 2, margin + contentWidth, cursorY - 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(74, 21, 75);
  doc.text('TOTAL ESTIMATED LAUNCH CAPITAL', margin + 8, cursorY + 10);
  doc.text(`Rs. ${totalAllocated.toLocaleString('en-IN')}`, margin + contentWidth - 10, cursorY + 10, { align: 'right' });
  cursorY += 26;

  // ─── PART 6: Customer Acquisition Playbook (Matches Website) ─────────────
  checkPageBreak(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('CUSTOMER ACQUISITION PLAYBOOK', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  blueprint.marketingPlaybook.forEach((play, pIdx) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 24, 93);
    doc.text(`${pIdx + 1}.`, margin + 6, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const pLines = doc.splitTextToSize(clean(play), contentWidth - 30);
    doc.text(pLines, margin + 22, cursorY);
    cursorY += pLines.length * 11.5 + 5;
  });
  cursorY += 6;

  // ─── PART 7: Mandatory Registrations & Legal Checklist (Matches Website) ──
  checkPageBreak(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('MANDATORY REGISTRATIONS & LEGAL CHECKLIST', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  blueprint.legalChecklist.forEach((legal) => {
    checkPageBreak(18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const lLines = doc.splitTextToSize(`[v]  ${clean(legal)}`, contentWidth - 10);
    doc.text(lLines, margin + 6, cursorY);
    cursorY += lLines.length * 11.5 + 4;
  });
  cursorY += 6;

  // ─── PART 8: Risk Management & Defensive Strategy (Matches Website) ──────
  checkPageBreak(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('RISK MANAGEMENT & DEFENSIVE STRATEGY', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  blueprint.riskMitigation.forEach((rm) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(`Risk: ${clean(rm.risk)}`, margin + 6, cursorY);
    cursorY += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const solLines = doc.splitTextToSize(`Solution: ${clean(rm.solution)}`, contentWidth - 20);
    doc.text(solLines, margin + 16, cursorY);
    cursorY += solLines.length * 10.5 + 7;
  });

  addFooter();

  // Save the PDF
  const cleanName = clean(blueprint.businessName).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`HerRise_Business_Blueprint_${cleanName}.pdf`);
}

// =========================================================================
// 2. 10-SECTION BUSINESS PLAN PDF (Exact website matching)
// =========================================================================
export function downloadBusinessPlanPdf(plan: BusinessPlan, ventureName?: string): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const title = clean(ventureName || plan.businessName || 'HerRise Venture Project');

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 35) {
      addFooter();
      doc.addPage();
      cursorY = margin + 10;
      drawHeaderAccent();
    }
  };

  const drawHeaderAccent = () => {
    doc.setFillColor(74, 21, 75);
    doc.rect(margin, 16, contentWidth, 3, 'F');
  };

  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `HerRise AI Entrepreneurship Studio  |  10-Section Executive Plan  |  Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 18,
      { align: 'center' }
    );
  };

  drawHeaderAccent();

  // Header Banner
  doc.setFillColor(74, 21, 75);
  doc.roundedRect(margin, cursorY, contentWidth, 75, 8, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(244, 114, 182);
  doc.text('HERRISE AI ENTREPRENEURSHIP INCUBATOR STUDIO', margin + 16, cursorY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(title, margin + 16, cursorY + 42);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(243, 232, 255);
  const tagStr = clean(plan.tagline || 'Strategic Micro-Enterprise Blueprint');
  doc.text(tagStr, margin + 16, cursorY + 58);

  cursorY += 90;

  // Metadata Box
  doc.setFillColor(250, 248, 253);
  doc.setDrawColor(230, 220, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 26, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.text(`Sector: ${clean(plan.category || 'D2C Retail')}`, margin + 12, cursorY + 16);
  doc.text(`Date: ${dateStr}`, margin + 200, cursorY + 16);
  doc.text(`Year 1 Target: Rs. ${(plan.projectedRevenueYear1 || 1850000).toLocaleString('en-IN')}`, margin + contentWidth - 12, cursorY + 16, { align: 'right' });
  cursorY += 40;

  // Helper for 10 sections
  const printSection = (num: number, titleStr: string, bodyText: string) => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(74, 21, 75);
    doc.text(`${num}. ${clean(titleStr).toUpperCase()}`, margin, cursorY);
    cursorY += 6;
    doc.setDrawColor(230, 220, 240);
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(clean(bodyText || 'Strategy details outlined in live plan.'), contentWidth);
    checkPageBreak(lines.length * 12.5 + 8);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 12.5 + 14;
  };

  // Exact 10 Sections matching the HerBusiness 10-Section Plan Tab
  printSection(1, 'Business Overview & Brand', `${title} - ${plan.tagline || ''}`);
  printSection(2, 'Problem Statement', plan.problemStatement);
  printSection(3, 'Proposed Solution', plan.solution);
  printSection(4, 'Target Audience Persona', plan.targetAudience);
  printSection(5, 'Market Opportunity (TAM / SAM)', plan.marketOpportunity);
  printSection(6, 'Competitor Analysis & Moat', plan.competitorAnalysis);
  printSection(7, 'Revenue Model & Channels', plan.revenueModel);
  printSection(8, 'Pricing Strategy & Margins', plan.pricingStrategy);
  printSection(9, 'Marketing & Go-To-Market', plan.marketingStrategy);

  // Section 10: Year 1 Projected Revenue & Startup Costs
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(74, 21, 75);
  doc.text('10. YEAR 1 PROJECTED REVENUE & STARTUP COSTS', margin, cursorY);
  cursorY += 6;
  doc.setDrawColor(230, 220, 240);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);
  cursorY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(`Projected Year 1 Gross Turnover: Rs. ${(plan.projectedRevenueYear1 || 1850000).toLocaleString('en-IN')}`, margin, cursorY);
  cursorY += 18;

  if (plan.startupCosts && plan.startupCosts.length > 0) {
    // Startup table
    doc.setFillColor(245, 240, 250);
    doc.rect(margin, cursorY, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text('Startup Expense Item', margin + 8, cursorY + 11);
    doc.text('Allocated Cost (INR)', margin + contentWidth - 10, cursorY + 11, { align: 'right' });
    cursorY += 20;

    let totalCosts = 0;
    plan.startupCosts.forEach((sc, idx) => {
      checkPageBreak(16);
      totalCosts += sc.cost;
      if (idx % 2 === 1) {
        doc.setFillColor(252, 250, 254);
        doc.rect(margin, cursorY - 10, contentWidth, 16, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(clean(sc.item), margin + 8, cursorY);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs. ${sc.cost.toLocaleString('en-IN')}`, margin + contentWidth - 10, cursorY, { align: 'right' });
      cursorY += 16;
    });

    checkPageBreak(22);
    doc.setDrawColor(180, 160, 200);
    doc.line(margin, cursorY - 2, margin + contentWidth, cursorY - 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(74, 21, 75);
    doc.text('TOTAL STARTUP CAPITAL', margin + 8, cursorY + 10);
    doc.text(`Rs. ${totalCosts.toLocaleString('en-IN')}`, margin + contentWidth - 10, cursorY + 10, { align: 'right' });
    cursorY += 24;
  }

  addFooter();

  const cleanName = title.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`HerRise_Business_Plan_${cleanName}.pdf`);
}
