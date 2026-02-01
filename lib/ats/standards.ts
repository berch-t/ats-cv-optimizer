import type { ATSStandard, JobBoardATSMapping } from '@/types/ats'

// ATS Standards Database
export const ATS_STANDARDS: Record<string, ATSStandard> = {
  taleo: {
    id: 'taleo',
    name: 'Oracle Taleo',
    vendor: 'Oracle',
    marketShare: 40,
    strictness: 'high',
    preferences: {
      dateFormat: 'MM/YYYY',
      sectionHeaders: [
        'Professional Experience',
        'Work Experience',
        'Education',
        'Skills',
        'Certifications',
        'Summary',
        'Professional Summary',
      ],
      avoidElements: [
        'tables',
        'multiple columns',
        'text boxes',
        'headers',
        'footers',
        'images',
        'charts',
        'graphics',
      ],
      maxFileSize: 5 * 1024 * 1024,
      supportedFonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica', 'Georgia'],
      preferredFileTypes: ['pdf', 'doc', 'docx'],
      maxPages: 3,
    },
    commonIn: ['grandes entreprises', 'corporate', 'multinationales', 'banques'],
    parsingCapabilities: {
      parsesTables: false,
      parsesColumns: false,
      parsesImages: false,
      parsesHeaders: false,
      parsesFooters: false,
      parsesLinks: true,
      parsesCustomFonts: false,
    },
    tips: [
      'Utilisez un format de CV simple et linéaire',
      'Évitez absolument les tableaux et colonnes multiples',
      'Utilisez des bullet points standards (•)',
      'Format de date recommandé: MM/YYYY',
    ],
  },

  workday: {
    id: 'workday',
    name: 'Workday',
    vendor: 'Workday Inc.',
    marketShare: 25,
    strictness: 'medium',
    preferences: {
      dateFormat: 'MM/YYYY',
      sectionHeaders: [
        'Experience',
        'Education',
        'Skills',
        'Summary',
        'Certifications',
        'Languages',
      ],
      avoidElements: ['complex tables', 'graphics', 'unusual fonts', 'headers', 'footers'],
      maxFileSize: 10 * 1024 * 1024,
      supportedFonts: ['Arial', 'Calibri', 'Georgia', 'Verdana', 'Tahoma'],
      preferredFileTypes: ['pdf', 'docx'],
      maxPages: 4,
    },
    commonIn: ['tech companies', 'finance', 'retail', 'consulting'],
    parsingCapabilities: {
      parsesTables: true,
      parsesColumns: false,
      parsesImages: false,
      parsesHeaders: true,
      parsesFooters: false,
      parsesLinks: true,
      parsesCustomFonts: true,
    },
    tips: [
      'Structure chronologique inversée recommandée',
      'Mots-clés importants: mettez-les en contexte',
      'Les tableaux simples peuvent fonctionner',
    ],
  },

  greenhouse: {
    id: 'greenhouse',
    name: 'Greenhouse',
    vendor: 'Greenhouse Software',
    marketShare: 15,
    strictness: 'medium',
    preferences: {
      dateFormat: 'MM/YYYY or YYYY',
      sectionHeaders: [
        'Experience',
        'Education',
        'Projects',
        'Skills',
        'Achievements',
        'Summary',
      ],
      avoidElements: ['tables', 'images', 'complex formatting'],
      maxFileSize: 10 * 1024 * 1024,
      supportedFonts: ['Arial', 'Calibri', 'Helvetica', 'Open Sans', 'Roboto'],
      preferredFileTypes: ['pdf', 'docx'],
      maxPages: 3,
    },
    commonIn: ['startups', 'tech', 'scale-ups', 'SaaS companies'],
    parsingCapabilities: {
      parsesTables: false,
      parsesColumns: true,
      parsesImages: false,
      parsesHeaders: true,
      parsesFooters: true,
      parsesLinks: true,
      parsesCustomFonts: true,
    },
    tips: [
      'Mettez en avant vos projets et réalisations',
      'Section compétences techniques détaillée',
      'Liens GitHub/Portfolio acceptés',
    ],
  },

  lever: {
    id: 'lever',
    name: 'Lever',
    vendor: 'Lever',
    marketShare: 10,
    strictness: 'low',
    preferences: {
      dateFormat: 'flexible',
      sectionHeaders: ['Experience', 'Education', 'Skills', 'About', 'Projects'],
      avoidElements: ['excessive graphics'],
      maxFileSize: 10 * 1024 * 1024,
      supportedFonts: ['any standard fonts'],
      preferredFileTypes: ['pdf', 'docx', 'txt'],
      maxPages: 4,
    },
    commonIn: ['startups', 'modern companies', 'tech'],
    parsingCapabilities: {
      parsesTables: true,
      parsesColumns: true,
      parsesImages: true,
      parsesHeaders: true,
      parsesFooters: true,
      parsesLinks: true,
      parsesCustomFonts: true,
    },
    tips: [
      'Format plus flexible accepté',
      'Créativité modérée possible',
      'Liens vers travaux appréciés',
    ],
  },

  smartrecruiters: {
    id: 'smartrecruiters',
    name: 'SmartRecruiters',
    vendor: 'SmartRecruiters',
    marketShare: 8,
    strictness: 'low',
    preferences: {
      dateFormat: 'MM/YYYY',
      sectionHeaders: [
        'Professional Experience',
        'Education',
        'Skills',
        'Languages',
        'Summary',
      ],
      avoidElements: ['complex layouts'],
      maxFileSize: 10 * 1024 * 1024,
      supportedFonts: ['Arial', 'Calibri', 'Helvetica'],
      preferredFileTypes: ['pdf', 'docx'],
      maxPages: 4,
    },
    commonIn: ['e-commerce', 'services', 'retail'],
    parsingCapabilities: {
      parsesTables: true,
      parsesColumns: true,
      parsesImages: false,
      parsesHeaders: true,
      parsesFooters: true,
      parsesLinks: true,
      parsesCustomFonts: true,
    },
    tips: [
      'Format moderne accepté',
      'Sections langues bien analysées',
      'Parsing avancé des compétences',
    ],
  },

  icims: {
    id: 'icims',
    name: 'iCIMS',
    vendor: 'iCIMS',
    marketShare: 7,
    strictness: 'medium',
    preferences: {
      dateFormat: 'MM/YYYY',
      sectionHeaders: [
        'Work Experience',
        'Education',
        'Skills',
        'Summary',
        'Certifications',
      ],
      avoidElements: ['tables', 'columns', 'images'],
      maxFileSize: 5 * 1024 * 1024,
      supportedFonts: ['Arial', 'Times New Roman', 'Calibri'],
      preferredFileTypes: ['pdf', 'doc', 'docx'],
      maxPages: 3,
    },
    commonIn: ['healthcare', 'government', 'large enterprises'],
    parsingCapabilities: {
      parsesTables: false,
      parsesColumns: false,
      parsesImages: false,
      parsesHeaders: true,
      parsesFooters: false,
      parsesLinks: true,
      parsesCustomFonts: false,
    },
    tips: [
      'Format très classique recommandé',
      'Chronologie stricte',
      'Évitez les formats créatifs',
    ],
  },
}

// Job board to ATS mapping
export const JOBBOARD_ATS_MAPPING: JobBoardATSMapping[] = [
  {
    jobBoard: 'LinkedIn',
    commonATS: ['taleo', 'workday', 'greenhouse', 'lever'],
    recommendedFormat: 'Simple, single-column PDF',
    tips: [
      'La plupart des entreprises utilisent Taleo ou Workday',
      'Gardez un format simple et professionnel',
    ],
  },
  {
    jobBoard: 'Indeed',
    commonATS: ['taleo', 'workday', 'smartrecruiters'],
    recommendedFormat: 'Standard PDF, no tables',
    tips: [
      'Indeed a son propre parser en plus de l\'ATS de l\'entreprise',
      'Utilisez des mots-clés du poste',
    ],
  },
  {
    jobBoard: 'HelloWork',
    commonATS: ['taleo', 'workday'],
    recommendedFormat: 'PDF classique',
    tips: ['Format français standard accepté', 'Photo optionnelle'],
  },
  {
    jobBoard: 'Cadremploi',
    commonATS: ['taleo', 'workday'],
    recommendedFormat: 'PDF professionnel',
    tips: ['Format cadre classique', 'Expérience mise en avant'],
  },
  {
    jobBoard: 'Welcome to the Jungle',
    commonATS: ['greenhouse', 'lever', 'workday'],
    recommendedFormat: 'PDF moderne acceptable',
    tips: [
      'Startups et tech principalement',
      'Format plus créatif possible',
      'Mettez en avant les soft skills',
    ],
  },
  {
    jobBoard: 'APEC',
    commonATS: ['taleo', 'workday'],
    recommendedFormat: 'PDF standard cadre',
    tips: ['Format classique recommandé', 'Focus sur les réalisations'],
  },
  {
    jobBoard: 'Monster',
    commonATS: ['taleo'],
    recommendedFormat: 'PDF simple',
    tips: ['Parser ancien', 'Évitez tout formatage complexe'],
  },
]

// Standard section headers mapping
export const STANDARD_SECTION_HEADERS: Record<string, string[]> = {
  experience: [
    'Professional Experience',
    'Work Experience',
    'Experience',
    'Employment History',
    'Career History',
    'Expérience Professionnelle',
    'Expériences',
  ],
  education: [
    'Education',
    'Academic Background',
    'Educational Background',
    'Formation',
    'Études',
  ],
  skills: [
    'Skills',
    'Technical Skills',
    'Core Competencies',
    'Competencies',
    'Compétences',
    'Compétences Techniques',
  ],
  summary: [
    'Summary',
    'Professional Summary',
    'Profile',
    'About',
    'Objective',
    'Profil',
    'Résumé',
  ],
  certifications: [
    'Certifications',
    'Certificates',
    'Professional Certifications',
    'Certifications et Formations',
  ],
  languages: ['Languages', 'Langues', 'Language Skills'],
  projects: ['Projects', 'Personal Projects', 'Projets', 'Side Projects'],
}

// Get ATS by ID
export function getATSStandard(atsId: string): ATSStandard | undefined {
  return ATS_STANDARDS[atsId.toLowerCase()]
}

// Get all ATS standards
export function getAllATSStandards(): ATSStandard[] {
  return Object.values(ATS_STANDARDS)
}

// Get ATS by strictness
export function getATSByStrictness(
  strictness: 'low' | 'medium' | 'high'
): ATSStandard[] {
  return Object.values(ATS_STANDARDS).filter(
    (ats) => ats.strictness === strictness
  )
}

// Normalize section header
export function normalizeSectionHeader(header: string): string | null {
  const normalizedHeader = header.toLowerCase().trim()

  for (const [standard, variants] of Object.entries(STANDARD_SECTION_HEADERS)) {
    for (const variant of variants) {
      if (variant.toLowerCase() === normalizedHeader) {
        return standard
      }
    }
  }

  return null
}

// Get recommended section header
export function getRecommendedSectionHeader(
  section: string,
  language: 'en' | 'fr' = 'en'
): string {
  const headers = STANDARD_SECTION_HEADERS[section.toLowerCase()]
  if (!headers) return section

  // Return English or French version based on language
  if (language === 'fr') {
    return headers.find((h) => /[àâäéèêëïîôùûüç]/i.test(h)) || headers[0]
  }

  return headers[0]
}
