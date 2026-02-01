import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { CVData, CVAnalysisResult } from '@/types/cv'

// PDF Generation Configuration
const CONFIG = {
  pageWidth: 612, // Letter size (8.5" x 11")
  pageHeight: 792,
  margins: {
    top: 72, // 1 inch
    bottom: 72,
    left: 72,
    right: 72,
  },
  fonts: {
    titleSize: 24,
    headingSize: 14,
    subheadingSize: 12,
    bodySize: 10,
    smallSize: 9,
  },
  colors: {
    primary: rgb(0.055, 0.647, 0.914), // #0ea5e9
    text: rgb(0.094, 0.094, 0.106), // #18181b
    muted: rgb(0.443, 0.443, 0.478), // #71717a
    accent: rgb(0.063, 0.725, 0.506), // #10b981
  },
  lineHeight: 1.4,
}

// ============================================
// Main PDF Generation Function
// ============================================

export async function generateOptimizedPDF(
  analysisResult: CVAnalysisResult
): Promise<Uint8Array> {
  const { cvData } = analysisResult

  // Create new PDF document
  const pdfDoc = await PDFDocument.create()

  // Load fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Add first page
  let page = pdfDoc.addPage([CONFIG.pageWidth, CONFIG.pageHeight])
  let yPosition = CONFIG.pageHeight - CONFIG.margins.top

  // Helper to add new page if needed
  const checkNewPage = () => {
    if (yPosition < CONFIG.margins.bottom + 100) {
      page = pdfDoc.addPage([CONFIG.pageWidth, CONFIG.pageHeight])
      yPosition = CONFIG.pageHeight - CONFIG.margins.top
    }
  }

  // Draw header with personal info
  yPosition = drawHeader(page, cvData, helvetica, helveticaBold, yPosition)
  yPosition -= 20

  // Draw professional summary if exists
  if (cvData.professionalSummary) {
    checkNewPage()
    yPosition = drawSection(
      page,
      'PROFESSIONAL SUMMARY',
      helveticaBold,
      yPosition
    )
    yPosition = drawParagraph(
      page,
      cvData.professionalSummary,
      helvetica,
      yPosition
    )
    yPosition -= 15
  }

  // Draw experience section
  if (cvData.experience.length > 0) {
    checkNewPage()
    yPosition = drawSection(page, 'PROFESSIONAL EXPERIENCE', helveticaBold, yPosition)

    for (const exp of cvData.experience) {
      checkNewPage()
      yPosition = drawExperience(page, exp, helvetica, helveticaBold, yPosition)
      yPosition -= 10
    }
    yPosition -= 5
  }

  // Draw education section
  if (cvData.education.length > 0) {
    checkNewPage()
    yPosition = drawSection(page, 'EDUCATION', helveticaBold, yPosition)

    for (const edu of cvData.education) {
      checkNewPage()
      yPosition = drawEducation(page, edu, helvetica, helveticaBold, yPosition)
      yPosition -= 8
    }
    yPosition -= 5
  }

  // Draw skills section
  if (cvData.skills) {
    checkNewPage()
    yPosition = drawSection(page, 'SKILLS', helveticaBold, yPosition)
    yPosition = drawSkills(page, cvData.skills, helvetica, helveticaBold, yPosition)
    yPosition -= 10
  }

  // Draw languages if present
  if (cvData.skills.languages && cvData.skills.languages.length > 0) {
    checkNewPage()
    yPosition = drawSection(page, 'LANGUAGES', helveticaBold, yPosition)
    yPosition = drawLanguages(page, cvData.skills.languages, helvetica, yPosition)
    yPosition -= 10
  }

  // Draw certifications if present
  if (cvData.skills.certifications && cvData.skills.certifications.length > 0) {
    checkNewPage()
    yPosition = drawSection(page, 'CERTIFICATIONS', helveticaBold, yPosition)
    for (const cert of cvData.skills.certifications) {
      yPosition = drawBulletPoint(page, cert, helvetica, yPosition)
    }
  }

  // Save and return PDF bytes
  return pdfDoc.save()
}

// ============================================
// Drawing Helper Functions
// ============================================

function drawHeader(
  page: PDFPage,
  cvData: CVData,
  font: PDFFont,
  boldFont: PDFFont,
  yPosition: number
): number {
  const { personalInfo } = cvData
  const contentWidth = CONFIG.pageWidth - CONFIG.margins.left - CONFIG.margins.right

  // Draw name
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`
  page.drawText(fullName, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.titleSize,
    font: boldFont,
    color: CONFIG.colors.text,
  })
  yPosition -= CONFIG.fonts.titleSize * CONFIG.lineHeight + 5

  // Draw contact info line
  const contactParts: string[] = []
  if (personalInfo.email) contactParts.push(personalInfo.email)
  if (personalInfo.phone) contactParts.push(personalInfo.phone)
  if (personalInfo.location) contactParts.push(personalInfo.location)

  if (contactParts.length > 0) {
    page.drawText(contactParts.join('  |  '), {
      x: CONFIG.margins.left,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: font,
      color: CONFIG.colors.muted,
    })
    yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
  }

  // Draw LinkedIn if present
  if (personalInfo.linkedIn) {
    page.drawText(personalInfo.linkedIn, {
      x: CONFIG.margins.left,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: font,
      color: CONFIG.colors.primary,
    })
    yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
  }

  // Draw divider line
  yPosition -= 10
  page.drawLine({
    start: { x: CONFIG.margins.left, y: yPosition },
    end: { x: CONFIG.pageWidth - CONFIG.margins.right, y: yPosition },
    thickness: 1,
    color: CONFIG.colors.primary,
  })
  yPosition -= 10

  return yPosition
}

function drawSection(
  page: PDFPage,
  title: string,
  font: PDFFont,
  yPosition: number
): number {
  page.drawText(title, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.headingSize,
    font: font,
    color: CONFIG.colors.primary,
  })

  return yPosition - CONFIG.fonts.headingSize * CONFIG.lineHeight - 5
}

function drawParagraph(
  page: PDFPage,
  text: string,
  font: PDFFont,
  yPosition: number
): number {
  const contentWidth = CONFIG.pageWidth - CONFIG.margins.left - CONFIG.margins.right
  const words = text.split(' ')
  let currentLine = ''
  const lines: string[] = []

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = font.widthOfTextAtSize(testLine, CONFIG.fonts.bodySize)

    if (textWidth > contentWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }

  for (const line of lines) {
    page.drawText(line, {
      x: CONFIG.margins.left,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: font,
      color: CONFIG.colors.text,
    })
    yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
  }

  return yPosition
}

function drawExperience(
  page: PDFPage,
  exp: CVData['experience'][0],
  font: PDFFont,
  boldFont: PDFFont,
  yPosition: number
): number {
  // Job title and company
  page.drawText(exp.jobTitle, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.subheadingSize,
    font: boldFont,
    color: CONFIG.colors.text,
  })

  // Date range on the right
  const dateText = `${exp.startDate} - ${exp.endDate || 'Present'}`
  const dateWidth = font.widthOfTextAtSize(dateText, CONFIG.fonts.smallSize)
  page.drawText(dateText, {
    x: CONFIG.pageWidth - CONFIG.margins.right - dateWidth,
    y: yPosition,
    size: CONFIG.fonts.smallSize,
    font: font,
    color: CONFIG.colors.muted,
  })

  yPosition -= CONFIG.fonts.subheadingSize * CONFIG.lineHeight

  // Company and location
  const companyText = exp.location
    ? `${exp.company}, ${exp.location}`
    : exp.company
  page.drawText(companyText, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.bodySize,
    font: font,
    color: CONFIG.colors.muted,
  })

  yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight + 5

  // Description bullets
  for (const desc of exp.description) {
    yPosition = drawBulletPoint(page, desc, font, yPosition)
  }

  return yPosition
}

function drawEducation(
  page: PDFPage,
  edu: CVData['education'][0],
  font: PDFFont,
  boldFont: PDFFont,
  yPosition: number
): number {
  // Degree
  page.drawText(edu.degree, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.subheadingSize,
    font: boldFont,
    color: CONFIG.colors.text,
  })

  // Date on the right (only if graduation date is available)
  const graduationDateText = edu.graduationDate || ''
  if (graduationDateText) {
    const dateWidth = font.widthOfTextAtSize(
      graduationDateText,
      CONFIG.fonts.smallSize
    )
    page.drawText(graduationDateText, {
      x: CONFIG.pageWidth - CONFIG.margins.right - dateWidth,
      y: yPosition,
      size: CONFIG.fonts.smallSize,
      font: font,
      color: CONFIG.colors.muted,
    })
  }

  yPosition -= CONFIG.fonts.subheadingSize * CONFIG.lineHeight

  // Institution
  const institutionText = edu.location
    ? `${edu.institution}, ${edu.location}`
    : edu.institution
  page.drawText(institutionText, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.bodySize,
    font: font,
    color: CONFIG.colors.muted,
  })

  yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight

  return yPosition
}

function drawSkills(
  page: PDFPage,
  skills: CVData['skills'],
  font: PDFFont,
  boldFont: PDFFont,
  yPosition: number
): number {
  const contentWidth = CONFIG.pageWidth - CONFIG.margins.left - CONFIG.margins.right

  // Technical skills
  if (skills.technical.length > 0) {
    page.drawText('Technical: ', {
      x: CONFIG.margins.left,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: boldFont,
      color: CONFIG.colors.text,
    })

    const technicalText = skills.technical.join(', ')
    const labelWidth = boldFont.widthOfTextAtSize('Technical: ', CONFIG.fonts.bodySize)

    // Wrap text if needed
    const maxWidth = contentWidth - labelWidth
    const wrappedText = wrapText(technicalText, font, CONFIG.fonts.bodySize, maxWidth)

    let firstLine = true
    for (const line of wrappedText) {
      page.drawText(line, {
        x: firstLine ? CONFIG.margins.left + labelWidth : CONFIG.margins.left,
        y: yPosition,
        size: CONFIG.fonts.bodySize,
        font: font,
        color: CONFIG.colors.text,
      })
      yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
      firstLine = false
    }
    yPosition -= 3
  }

  // Soft skills
  if (skills.soft.length > 0) {
    page.drawText('Soft Skills: ', {
      x: CONFIG.margins.left,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: boldFont,
      color: CONFIG.colors.text,
    })

    const softText = skills.soft.join(', ')
    const labelWidth = boldFont.widthOfTextAtSize('Soft Skills: ', CONFIG.fonts.bodySize)

    page.drawText(softText, {
      x: CONFIG.margins.left + labelWidth,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: font,
      color: CONFIG.colors.text,
    })
    yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
  }

  return yPosition
}

function drawLanguages(
  page: PDFPage,
  languages: CVData['skills']['languages'],
  font: PDFFont,
  yPosition: number
): number {
  const languageText = languages
    .map((lang) => `${lang.name} (${lang.proficiency})`)
    .join(', ')

  page.drawText(languageText, {
    x: CONFIG.margins.left,
    y: yPosition,
    size: CONFIG.fonts.bodySize,
    font: font,
    color: CONFIG.colors.text,
  })

  return yPosition - CONFIG.fonts.bodySize * CONFIG.lineHeight
}

function drawBulletPoint(
  page: PDFPage,
  text: string,
  font: PDFFont,
  yPosition: number
): number {
  const bulletX = CONFIG.margins.left
  const textX = CONFIG.margins.left + 15
  const contentWidth =
    CONFIG.pageWidth - CONFIG.margins.right - textX

  // Draw bullet
  page.drawText('•', {
    x: bulletX,
    y: yPosition,
    size: CONFIG.fonts.bodySize,
    font: font,
    color: CONFIG.colors.text,
  })

  // Wrap text
  const wrappedLines = wrapText(text, font, CONFIG.fonts.bodySize, contentWidth)

  for (const line of wrappedLines) {
    page.drawText(line, {
      x: textX,
      y: yPosition,
      size: CONFIG.fonts.bodySize,
      font: font,
      color: CONFIG.colors.text,
    })
    yPosition -= CONFIG.fonts.bodySize * CONFIG.lineHeight
  }

  return yPosition
}

// ============================================
// Utility Functions
// ============================================

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = font.widthOfTextAtSize(testLine, fontSize)

    if (textWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

// Export configuration for customization
export { CONFIG as PDF_CONFIG }
