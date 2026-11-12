import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import jsPDF from 'jspdf';

export interface AtsResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  headline: string;
  summary: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    location?: string;
    duration: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
    grade?: string;
  }>;
  certifications?: string[];
  languages?: string[];
}

/**
 * Generates and downloads an ATS-compliant Word Document (.docx)
 */
export async function downloadAtsWord(data: AtsResumeData): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // 1. Candidate Name (Header)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: (data.fullName || 'Candidate').toUpperCase(),
                bold: true,
                size: 32, // 16pt font
                font: 'Calibri'
              })
            ]
          }),

          // Contact Information Line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: [
                  data.email,
                  data.phone,
                  data.location,
                  data.linkedin,
                  data.portfolio
                ]
                  .filter(Boolean)
                  .join('  |  '),
                size: 20, // 10pt
                font: 'Calibri'
              })
            ]
          }),

          // Professional Title / Headline
          ...(data.headline
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 240 },
                  children: [
                    new TextRun({
                      text: data.headline.toUpperCase(),
                      bold: true,
                      size: 22, // 11pt
                      font: 'Calibri',
                      color: '2D3748'
                    })
                  ]
                })
              ]
            : []),

          // 2. PROFESSIONAL SUMMARY
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 24, // 12pt
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: data.summary || 'Results-oriented professional focused on delivering measurable impact.',
                size: 20,
                font: 'Calibri'
              })
            ]
          }),

          // 3. CORE COMPETENCIES & SKILLS
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'CORE COMPETENCIES & TECHNICAL SKILLS',
                bold: true,
                size: 24,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: data.skills.length > 0 ? data.skills.join('  •  ') : 'Team Collaboration, Problem Solving, Communication',
                size: 20,
                font: 'Calibri'
              })
            ]
          }),

          // 4. PROFESSIONAL EXPERIENCE
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 24,
                font: 'Calibri'
              })
            ]
          }),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              spacing: { before: 140, after: 40 },
              children: [
                new TextRun({
                  text: exp.role || 'Professional Role',
                  bold: true,
                  size: 22,
                  font: 'Calibri'
                }),
                new TextRun({
                  text: ` — ${exp.company || 'Organization'}`,
                  size: 22,
                  font: 'Calibri'
                }),
                new TextRun({
                  text: `  (${exp.duration || 'Dates'})`,
                  italics: true,
                  size: 20,
                  font: 'Calibri'
                })
              ]
            }),
            ...(exp.location
              ? [
                  new Paragraph({
                    spacing: { after: 80 },
                    children: [
                      new TextRun({
                        text: exp.location,
                        italics: true,
                        size: 18,
                        font: 'Calibri',
                        color: '555555'
                      })
                    ]
                  })
                ]
              : []),
            ...exp.bullets.map(
              (bullet) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: bullet,
                      size: 20,
                      font: 'Calibri'
                    })
                  ]
                })
            )
          ]),

          // 5. EDUCATION
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 100 },
            children: [
              new TextRun({
                text: 'EDUCATION & CREDENTIALS',
                bold: true,
                size: 24,
                font: 'Calibri'
              })
            ]
          }),
          ...data.education.map(
            (edu) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: edu.degree || 'Degree',
                    bold: true,
                    size: 21,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: `, ${edu.institution || 'University'}${edu.year ? ` (${edu.year})` : ''}${edu.grade ? ` — Grade: ${edu.grade}` : ''}`,
                    size: 20,
                    font: 'Calibri'
                  })
                ]
              })
          ),

          // 6. CERTIFICATIONS (if any)
          ...(data.certifications && data.certifications.length > 0
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 100 },
                  children: [
                    new TextRun({
                      text: 'CERTIFICATIONS & ACCREDITATIONS',
                      bold: true,
                      size: 24,
                      font: 'Calibri'
                    })
                  ]
                }),
                ...data.certifications.map(
                  (cert) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 60 },
                      children: [
                        new TextRun({
                          text: cert,
                          size: 20,
                          font: 'Calibri'
                        })
                      ]
                    })
                )
              ]
            : []),

          // 7. LANGUAGES (if any)
          ...(data.languages && data.languages.length > 0
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 100 },
                  children: [
                    new TextRun({
                      text: 'LANGUAGES',
                      bold: true,
                      size: 24,
                      font: 'Calibri'
                    })
                  ]
                }),
                new Paragraph({
                  spacing: { after: 120 },
                  children: [
                    new TextRun({
                      text: data.languages.join('  •  '),
                      size: 20,
                      font: 'Calibri'
                    })
                  ]
                })
              ]
            : [])
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (data.fullName || 'Candidate').replace(/\s+/g, '_');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_ATS_Resume.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads an ATS-compliant PDF (.pdf)
 */
export function downloadAtsPdf(data: AtsResumeData): void {
  const pdf = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin;
    }
  };

  // Header: Full Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(20, 20, 20);
  const nameText = (data.fullName || 'CANDIDATE NAME').toUpperCase();
  pdf.text(nameText, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 22;

  // Contact line
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(80, 80, 80);
  const contactParts = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.portfolio
  ].filter(Boolean);
  const contactLine = contactParts.join('  |  ');
  pdf.text(contactLine, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 16;

  // Professional Headline
  if (data.headline) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(45, 55, 72);
    pdf.text(data.headline.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 18;
  }

  // Horizontal divider rule
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.75);
  pdf.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 16;

  const renderSectionHeader = (title: string) => {
    checkPageBreak(35);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(20, 20, 20);
    pdf.text(title.toUpperCase(), margin, cursorY);
    cursorY += 4;
    pdf.setDrawColor(160, 160, 160);
    pdf.setLineWidth(0.5);
    pdf.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 12;
  };

  // 1. PROFESSIONAL SUMMARY
  if (data.summary) {
    renderSectionHeader('Professional Summary');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(50, 50, 50);
    const summaryLines = pdf.splitTextToSize(data.summary, contentWidth);
    checkPageBreak(summaryLines.length * 13 + 10);
    pdf.text(summaryLines, margin, cursorY);
    cursorY += summaryLines.length * 13 + 12;
  }

  // 2. CORE COMPETENCIES & SKILLS
  if (data.skills && data.skills.length > 0) {
    renderSectionHeader('Core Competencies & Technical Skills');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(50, 50, 50);
    const skillsText = data.skills.join('   •   ');
    const skillLines = pdf.splitTextToSize(skillsText, contentWidth);
    checkPageBreak(skillLines.length * 13 + 10);
    pdf.text(skillLines, margin, cursorY);
    cursorY += skillLines.length * 13 + 12;
  }

  // 3. PROFESSIONAL EXPERIENCE
  if (data.experience && data.experience.length > 0) {
    renderSectionHeader('Professional Experience');

    data.experience.forEach((exp) => {
      checkPageBreak(40);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(25, 25, 25);

      // Role and dates on opposite ends or inline
      pdf.text(exp.role || 'Role', margin, cursorY);
      if (exp.duration) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(90, 90, 90);
        pdf.text(exp.duration, pageWidth - margin, cursorY, { align: 'right' });
      }
      cursorY += 13;

      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9.5);
      pdf.setTextColor(60, 60, 60);
      pdf.text(
        `${exp.company || 'Organization'}${exp.location ? ` — ${exp.location}` : ''}`,
        margin,
        cursorY
      );
      cursorY += 12;

      // Bullets
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(40, 40, 40);

      exp.bullets.forEach((bullet) => {
        const bulletText = `•   ${bullet}`;
        const bulletLines = pdf.splitTextToSize(bulletText, contentWidth - 10);
        checkPageBreak(bulletLines.length * 12 + 4);
        pdf.text(bulletLines, margin + 8, cursorY);
        cursorY += bulletLines.length * 12 + 3;
      });

      cursorY += 6;
    });
  }

  // 4. EDUCATION
  if (data.education && data.education.length > 0) {
    renderSectionHeader('Education & Credentials');

    data.education.forEach((edu) => {
      checkPageBreak(25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(25, 25, 25);
      pdf.text(edu.degree || 'Degree', margin, cursorY);

      if (edu.year) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(90, 90, 90);
        pdf.text(edu.year, pageWidth - margin, cursorY, { align: 'right' });
      }
      cursorY += 12;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(70, 70, 70);
      pdf.text(
        `${edu.institution || 'University'}${edu.grade ? ` | Grade: ${edu.grade}` : ''}`,
        margin,
        cursorY
      );
      cursorY += 14;
    });
  }

  // 5. CERTIFICATIONS
  if (data.certifications && data.certifications.length > 0) {
    renderSectionHeader('Certifications & Accreditations');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(40, 40, 40);

    data.certifications.forEach((cert) => {
      const line = `•   ${cert}`;
      const certLines = pdf.splitTextToSize(line, contentWidth);
      checkPageBreak(certLines.length * 12);
      pdf.text(certLines, margin + 8, cursorY);
      cursorY += certLines.length * 12 + 2;
    });
    cursorY += 8;
  }

  // 6. LANGUAGES
  if (data.languages && data.languages.length > 0) {
    renderSectionHeader('Languages');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    pdf.text(data.languages.join('   •   '), margin, cursorY);
    cursorY += 14;
  }

  const safeName = (data.fullName || 'Candidate').replace(/\s+/g, '_');
  pdf.save(`${safeName}_ATS_Resume.pdf`);
}

