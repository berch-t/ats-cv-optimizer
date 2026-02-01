import type { IndustryKeywords, KeywordCategory } from '@/types/ats'

// Industry Keywords Database
export const INDUSTRY_KEYWORDS: Record<string, IndustryKeywords> = {
  tech: {
    sector: 'Technology',
    categories: [
      {
        name: 'Frontend Development',
        keywords: [
          { term: 'React', variants: ['React.js', 'ReactJS'], importance: 'required' },
          { term: 'Vue.js', variants: ['Vue', 'VueJS'], importance: 'preferred' },
          { term: 'Angular', variants: ['AngularJS', 'Angular 2+'], importance: 'preferred' },
          { term: 'TypeScript', variants: ['TS'], importance: 'required' },
          { term: 'JavaScript', variants: ['JS', 'ES6', 'ES2015+'], importance: 'required' },
          { term: 'HTML5', variants: ['HTML'], importance: 'required' },
          { term: 'CSS3', variants: ['CSS', 'Sass', 'SCSS', 'Less'], importance: 'required' },
          { term: 'Tailwind CSS', variants: ['TailwindCSS'], importance: 'preferred' },
          { term: 'Next.js', variants: ['NextJS'], importance: 'preferred' },
          { term: 'Responsive Design', variants: ['Mobile-first'], importance: 'required' },
          { term: 'Accessibility', variants: ['a11y', 'WCAG'], importance: 'nice-to-have' },
        ],
      },
      {
        name: 'Backend Development',
        keywords: [
          { term: 'Node.js', variants: ['NodeJS', 'Node'], importance: 'required' },
          { term: 'Python', variants: [], importance: 'required' },
          { term: 'Java', variants: ['Java SE', 'Java EE'], importance: 'preferred' },
          { term: 'Go', variants: ['Golang'], importance: 'preferred' },
          { term: 'REST API', variants: ['RESTful', 'API Design'], importance: 'required' },
          { term: 'GraphQL', variants: [], importance: 'preferred' },
          { term: 'PostgreSQL', variants: ['Postgres'], importance: 'required' },
          { term: 'MongoDB', variants: ['Mongo'], importance: 'preferred' },
          { term: 'Redis', variants: [], importance: 'nice-to-have' },
          { term: 'Microservices', variants: ['Microservice Architecture'], importance: 'preferred' },
        ],
      },
      {
        name: 'DevOps & Cloud',
        keywords: [
          { term: 'Docker', variants: ['Containerization'], importance: 'required' },
          { term: 'Kubernetes', variants: ['K8s'], importance: 'preferred' },
          { term: 'AWS', variants: ['Amazon Web Services'], importance: 'required' },
          { term: 'GCP', variants: ['Google Cloud Platform', 'Google Cloud'], importance: 'preferred' },
          { term: 'Azure', variants: ['Microsoft Azure'], importance: 'preferred' },
          { term: 'CI/CD', variants: ['Continuous Integration', 'Continuous Deployment'], importance: 'required' },
          { term: 'GitHub Actions', variants: [], importance: 'preferred' },
          { term: 'Terraform', variants: ['IaC'], importance: 'nice-to-have' },
        ],
      },
    ],
    commonTools: [
      'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Slack', 'VS Code',
      'IntelliJ IDEA', 'Postman', 'Figma', 'Linear', 'Notion',
    ],
    softSkills: [
      'Problem Solving', 'Team Collaboration', 'Communication', 'Agile',
      'Scrum', 'Code Review', 'Mentoring', 'Technical Documentation',
    ],
    certifications: [
      'AWS Certified', 'Google Cloud Certified', 'Azure Certified',
      'Kubernetes Certified', 'Scrum Master', 'PMP',
    ],
  },

  finance: {
    sector: 'Finance & Banking',
    categories: [
      {
        name: 'Financial Analysis',
        keywords: [
          { term: 'Financial Modeling', variants: ['Financial Models'], importance: 'required' },
          { term: 'Valuation', variants: ['DCF', 'Discounted Cash Flow'], importance: 'required' },
          { term: 'GAAP', variants: ['US GAAP'], importance: 'required' },
          { term: 'IFRS', variants: ['International Financial Reporting'], importance: 'required' },
          { term: 'Financial Reporting', variants: ['Financial Statements'], importance: 'required' },
          { term: 'Budgeting', variants: ['Budget Management'], importance: 'required' },
          { term: 'Forecasting', variants: ['Financial Forecasting'], importance: 'required' },
        ],
      },
      {
        name: 'Investment',
        keywords: [
          { term: 'Portfolio Management', variants: ['Asset Management'], importance: 'required' },
          { term: 'Risk Management', variants: ['Risk Assessment'], importance: 'required' },
          { term: 'M&A', variants: ['Mergers and Acquisitions'], importance: 'preferred' },
          { term: 'Due Diligence', variants: [], importance: 'preferred' },
          { term: 'Equity Research', variants: [], importance: 'preferred' },
          { term: 'Fixed Income', variants: ['Bonds'], importance: 'preferred' },
        ],
      },
    ],
    commonTools: [
      'Excel', 'Bloomberg Terminal', 'Capital IQ', 'FactSet', 'SAP',
      'Oracle Financials', 'QuickBooks', 'Tableau', 'Power BI', 'Python',
    ],
    softSkills: [
      'Analytical Thinking', 'Attention to Detail', 'Communication',
      'Stakeholder Management', 'Presentation Skills', 'Regulatory Compliance',
    ],
    certifications: [
      'CFA', 'CPA', 'ACCA', 'FRM', 'Series 7', 'Series 63', 'Series 66',
    ],
  },

  marketing: {
    sector: 'Marketing & Communications',
    categories: [
      {
        name: 'Digital Marketing',
        keywords: [
          { term: 'SEO', variants: ['Search Engine Optimization'], importance: 'required' },
          { term: 'SEM', variants: ['Search Engine Marketing', 'PPC'], importance: 'required' },
          { term: 'Google Analytics', variants: ['GA4', 'Universal Analytics'], importance: 'required' },
          { term: 'Google Ads', variants: ['AdWords'], importance: 'required' },
          { term: 'Content Marketing', variants: ['Content Strategy'], importance: 'required' },
          { term: 'Email Marketing', variants: ['Email Campaigns'], importance: 'required' },
          { term: 'Marketing Automation', variants: [], importance: 'preferred' },
          { term: 'A/B Testing', variants: ['Split Testing'], importance: 'preferred' },
        ],
      },
      {
        name: 'Social Media',
        keywords: [
          { term: 'Social Media Marketing', variants: ['SMM'], importance: 'required' },
          { term: 'Facebook Ads', variants: ['Meta Ads'], importance: 'required' },
          { term: 'LinkedIn Marketing', variants: [], importance: 'preferred' },
          { term: 'Instagram Marketing', variants: [], importance: 'preferred' },
          { term: 'Community Management', variants: [], importance: 'preferred' },
          { term: 'Influencer Marketing', variants: [], importance: 'nice-to-have' },
        ],
      },
    ],
    commonTools: [
      'HubSpot', 'Salesforce', 'Marketo', 'Mailchimp', 'Hootsuite',
      'Sprout Social', 'Canva', 'Adobe Creative Suite', 'Semrush', 'Ahrefs',
    ],
    softSkills: [
      'Creativity', 'Strategic Thinking', 'Data-Driven', 'Communication',
      'Project Management', 'Storytelling', 'Brand Management',
    ],
    certifications: [
      'Google Ads Certified', 'HubSpot Certified', 'Facebook Blueprint',
      'Google Analytics Certified', 'Hootsuite Certified',
    ],
  },

  healthcare: {
    sector: 'Healthcare',
    categories: [
      {
        name: 'Clinical',
        keywords: [
          { term: 'Patient Care', variants: [], importance: 'required' },
          { term: 'Clinical Assessment', variants: [], importance: 'required' },
          { term: 'HIPAA', variants: ['HIPAA Compliance'], importance: 'required' },
          { term: 'Electronic Health Records', variants: ['EHR', 'EMR'], importance: 'required' },
          { term: 'Medical Terminology', variants: [], importance: 'required' },
        ],
      },
      {
        name: 'Healthcare Administration',
        keywords: [
          { term: 'Healthcare Administration', variants: [], importance: 'required' },
          { term: 'Medical Billing', variants: ['Medical Coding'], importance: 'preferred' },
          { term: 'ICD-10', variants: ['ICD Coding'], importance: 'preferred' },
          { term: 'CPT Coding', variants: [], importance: 'preferred' },
          { term: 'Revenue Cycle Management', variants: ['RCM'], importance: 'preferred' },
        ],
      },
    ],
    commonTools: [
      'Epic', 'Cerner', 'Meditech', 'Allscripts', 'McKesson',
      'NextGen', 'eClinicalWorks',
    ],
    softSkills: [
      'Empathy', 'Communication', 'Attention to Detail',
      'Critical Thinking', 'Team Collaboration', 'Stress Management',
    ],
    certifications: [
      'RN', 'LPN', 'CNA', 'CMA', 'RHIA', 'RHIT', 'CPC', 'CCS',
    ],
  },
}

// ============================================
// Keyword Extraction & Matching
// ============================================

export function getIndustryKeywords(sector: string): IndustryKeywords | undefined {
  return INDUSTRY_KEYWORDS[sector.toLowerCase()]
}

export function getAllSectors(): string[] {
  return Object.keys(INDUSTRY_KEYWORDS)
}

export function extractKeywordsFromText(text: string): string[] {
  const keywords: string[] = []
  const textLower = text.toLowerCase()

  // Search through all industries
  for (const industry of Object.values(INDUSTRY_KEYWORDS)) {
    for (const category of industry.categories) {
      for (const keyword of category.keywords) {
        // Check main term
        if (textLower.includes(keyword.term.toLowerCase())) {
          keywords.push(keyword.term)
        }
        // Check variants
        for (const variant of keyword.variants) {
          if (textLower.includes(variant.toLowerCase())) {
            keywords.push(keyword.term) // Use main term
          }
        }
      }
    }

    // Check tools
    for (const tool of industry.commonTools) {
      if (textLower.includes(tool.toLowerCase())) {
        keywords.push(tool)
      }
    }

    // Check certifications
    for (const cert of industry.certifications) {
      if (textLower.includes(cert.toLowerCase())) {
        keywords.push(cert)
      }
    }
  }

  // Return unique keywords
  return [...new Set(keywords)]
}

export function getRequiredKeywordsForSector(sector: string): string[] {
  const industry = INDUSTRY_KEYWORDS[sector.toLowerCase()]
  if (!industry) return []

  const required: string[] = []
  for (const category of industry.categories) {
    for (const keyword of category.keywords) {
      if (keyword.importance === 'required') {
        required.push(keyword.term)
      }
    }
  }

  return required
}

export function getMissingKeywords(
  cvKeywords: string[],
  sector: string
): { missing: string[]; suggestions: string[] } {
  const required = getRequiredKeywordsForSector(sector)
  const cvKeywordsLower = new Set(cvKeywords.map((k) => k.toLowerCase()))

  const missing = required.filter(
    (keyword) => !cvKeywordsLower.has(keyword.toLowerCase())
  )

  // Get additional suggestions (preferred keywords)
  const industry = INDUSTRY_KEYWORDS[sector.toLowerCase()]
  const suggestions: string[] = []

  if (industry) {
    for (const category of industry.categories) {
      for (const keyword of category.keywords) {
        if (
          keyword.importance === 'preferred' &&
          !cvKeywordsLower.has(keyword.term.toLowerCase())
        ) {
          suggestions.push(keyword.term)
        }
      }
    }
  }

  return { missing, suggestions: suggestions.slice(0, 10) }
}

export function detectSectorFromKeywords(cvKeywords: string[]): string | null {
  const cvKeywordsLower = new Set(cvKeywords.map((k) => k.toLowerCase()))
  let bestMatch: { sector: string; score: number } | null = null

  for (const [sectorId, industry] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0

    for (const category of industry.categories) {
      for (const keyword of category.keywords) {
        if (cvKeywordsLower.has(keyword.term.toLowerCase())) {
          score += keyword.importance === 'required' ? 3 : 1
        }
      }
    }

    for (const tool of industry.commonTools) {
      if (cvKeywordsLower.has(tool.toLowerCase())) {
        score += 1
      }
    }

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { sector: sectorId, score }
    }
  }

  return bestMatch && bestMatch.score >= 5 ? bestMatch.sector : null
}
