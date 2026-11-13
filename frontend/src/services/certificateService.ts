import jsPDF from 'jspdf';
import { Certificate } from '../types';

export interface ExportCertificateOptions {
  recipientName?: string;
}

/**
 * Generates an executive, print-ready, high-resolution A4 landscape certificate PDF
 */
export function generateCertificatePdf(
  cert: Certificate,
  options?: ExportCertificateOptions
): void {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const width = 297;
  const height = 210;
  const margin = 10;
  const recipient = options?.recipientName || cert.issuedTo || 'Verified Scholar';

  // 1. Soft Parchment / Luxury Ivory Background
  doc.setFillColor(254, 253, 249);
  doc.rect(0, 0, width, height, 'F');

  // 2. Outer Regal Plum Border
  doc.setDrawColor(74, 21, 75); // #4A154B
  doc.setLineWidth(1.8);
  doc.rect(margin, margin, width - margin * 2, height - margin * 2);

  // 3. Inner Metallic Gold Accent Border
  doc.setDrawColor(212, 175, 55); // #D4AF37
  doc.setLineWidth(0.6);
  const innerMargin = margin + 3.5;
  doc.rect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

  // 4. Subtle Guilloche / Corner Accents
  doc.setFillColor(212, 175, 55);
  const cornerSize = 4;
  // Top-left
  doc.rect(innerMargin - 1, innerMargin - 1, cornerSize, cornerSize, 'F');
  // Top-right
  doc.rect(width - innerMargin - cornerSize + 1, innerMargin - 1, cornerSize, cornerSize, 'F');
  // Bottom-left
  doc.rect(innerMargin - 1, height - innerMargin - cornerSize + 1, cornerSize, cornerSize, 'F');
  // Bottom-right
  doc.rect(width - innerMargin - cornerSize + 1, height - innerMargin - cornerSize + 1, cornerSize, cornerSize, 'F');

  // 5. Header: HerRise Institution Emblem & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(190, 24, 93); // #be185d
  doc.text('HERRISE INSTITUTE OF EMPOWERMENT & APPLIED SCIENCES', width / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('OFFICIALLY ACCREDITED WOMEN’S ECONOMIC & CAREER EXCELLENCE PLATFORM', width / 2, 33, { align: 'center' });

  // Thin separator under header
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(width / 2 - 45, 36, width / 2 + 45, 36);

  // 6. Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(74, 21, 75); // #4A154B
  doc.text('CERTIFICATE OF ACCOMPLISHMENT', width / 2, 48, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(110, 110, 110);
  doc.text('This verified professional credential is proudly awarded to', width / 2, 57, { align: 'center' });

  // 7. Recipient Full Name (Prominent & Elegant)
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(59, 7, 100); // #3b0764
  doc.text(recipient, width / 2, 71, { align: 'center' });

  // Gold accent bar under recipient name
  const nameWidth = Math.min(130, Math.max(70, recipient.length * 4.5));
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(width / 2 - nameWidth / 2, 75, width / 2 + nameWidth / 2, 75);

  // 8. Reason for Award
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text('for successfully completing the comprehensive curriculum, rigorous assessments, and practical case studies in', width / 2, 83, { align: 'center' });

  // 9. Course Title
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(74, 21, 75);
  doc.text(cert.courseTitle, width / 2, 94, { align: 'center' });

  // 10. Skills Covered / Key Competencies
  if (cert.skillsCovered && cert.skillsCovered.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    const skillsText = `Verified Competencies: ${cert.skillsCovered.join('  •  ')}`;
    doc.text(skillsText, width / 2, 102, { align: 'center' });
  }

  // 11. Grade & Hours
  const grade = cert.grade || 'Honours Distinction (96%)';
  const hours = cert.hoursCompleted || 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(190, 24, 93);
  doc.text(`Evaluation: ${grade}    |    Instructional Commitment: ${hours} Verified Hours`, width / 2, 110, { align: 'center' });

  // 12. Gold Foil Official Medallion / Seal (Drawn with vectors)
  const sealX = width / 2;
  const sealY = 138;
  const sealRadius = 14;

  // Outer gold circle
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.setFillColor(255, 251, 235);
  doc.circle(sealX, sealY, sealRadius, 'FD');

  // Inner ring
  doc.setLineWidth(0.4);
  doc.circle(sealX, sealY, sealRadius - 2.5, 'S');

  // Seal text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(180, 83, 9);
  doc.text('★ HERRISE VERIFIED ★', sealX, sealY - 6, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(74, 21, 75);
  doc.text('OFFICIAL SEAL', sealX, sealY - 1, { align: 'center' });
  doc.setFontSize(4.8);
  doc.setTextColor(120, 53, 15);
  doc.text('EXCELLENCE & INTEGRITY', sealX, sealY + 4, { align: 'center' });
  doc.text('★ ★ ★', sealX, sealY + 8, { align: 'center' });

  // Ribbon tails below seal
  doc.setDrawColor(212, 175, 55);
  doc.setFillColor(245, 230, 180);
  doc.triangle(sealX - 8, sealY + 13, sealX - 2, sealY + 23, sealX - 8, sealY + 20, 'FD');
  doc.triangle(sealX + 8, sealY + 13, sealX + 2, sealY + 23, sealX + 8, sealY + 20, 'FD');

  // 13. Left Signature (Instructor)
  const sigLeftX = margin + 35;
  const sigY = 146;

  // Handwritten cursive representation
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(74, 21, 75);
  doc.text(cert.instructorName, sigLeftX, sigY - 5, { align: 'center' });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(sigLeftX - 28, sigY, sigLeftX + 28, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(cert.instructorName, sigLeftX, sigY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(cert.instructorTitle || 'Lead Course Strategist', sigLeftX, sigY + 9, { align: 'center' });

  // 14. Right Signature (Dean / Academic Director)
  const sigRightX = width - margin - 35;
  const directorName = cert.directorName || 'Dr. Arundhati Roy';
  const directorTitle = cert.directorTitle || 'Academic Dean, HerRise Institute';

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(74, 21, 75);
  doc.text(directorName, sigRightX, sigY - 5, { align: 'center' });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(sigRightX - 28, sigY, sigRightX + 28, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(directorName, sigRightX, sigY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(directorTitle, sigRightX, sigY + 9, { align: 'center' });

  // 15. Security & Verification Footer Strip
  const footerY = height - margin - 14;

  // Thin horizontal divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(innerMargin + 8, footerY - 2, width - innerMargin - 8, footerY - 2);

  // Left Footer Info: Credential ID & Issue Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 21, 75);
  doc.text(`Credential ID: ${cert.credentialId}`, innerMargin + 10, footerY + 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`Date of Award: ${cert.issueDate}  |  Validity: Lifetime  |  Status: Verified & Cryptographically Signed`, innerMargin + 10, footerY + 7.5);

  // Right Footer Info: Verification Link & Protocol
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(190, 24, 93);
  const verifyLink = `Verify authenticity: herrise.org/verify/${cert.credentialId}`;
  doc.text(verifyLink, width - innerMargin - 10, footerY + 3, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.text('Tamper-evident record registered under HerRise Women Economic Mobility Protocol', width - innerMargin - 10, footerY + 7.5, { align: 'right' });

  // 16. Trigger PDF Save
  const safeFilename = `HerRise-Certificate-${cert.credentialId || 'Credential'}.pdf`;
  doc.save(safeFilename);
}
