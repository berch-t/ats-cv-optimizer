# ATS CV Optimizer

A SaaS platform that optimizes CVs for Applicant Tracking Systems (ATS) using AI-powered analysis.

## Features

- **AI-Powered Analysis**: Uses AI to analyze and optimize CVs for ATS compatibility
- **Real-time Streaming**: Live feedback during CV processing with progress updates
- **ATS Score Calculation**: Weighted scoring algorithm based on formatting, keywords, structure, and readability
- **PDF Processing**: Upload PDF CVs and download optimized versions
- **Multi-ATS Support**: Optimized for Taleo, Workday, Greenhouse, Lever, and SmartRecruiters
- **User Dashboard**: Track conversion history and usage statistics
- **Subscription Plans**: Freemium model with 3 free conversions/month, unlimited for premium users

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **AI**: Anthropic Claude API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Payments**: Stripe
- **Hosting**: GCP Cloud Run
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project
- Stripe account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/berch-t/ats-cv-optimizer.git
cd ats-cv-optimizer

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Anthropic
ANTHROPIC_API_KEY=

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register)
│   ├── (dashboard)/          # Protected routes
│   ├── api/                  # API Routes
│   ├── convert/              # CV conversion page
│   └── pricing/              # Pricing page
├── components/
│   ├── ui/                   # UI components (shadcn/ui + custom)
│   ├── landing/              # Landing page sections
│   ├── convert/              # Conversion interface
│   ├── dashboard/            # Dashboard components
│   └── providers/            # Context providers
├── lib/
│   ├── firebase/             # Firebase configuration
│   ├── anthropic/            # Claude AI integration
│   ├── ats/                  # ATS scoring engine
│   ├── pdf/                  # PDF parsing/generation
│   ├── stripe/               # Stripe integration
│   └── hooks/                # Custom React hooks
├── types/                    # TypeScript definitions
└── config/                   # Configuration files
```

## Deployment

The application is configured for deployment on GCP Cloud Run with GitHub Actions CI/CD.

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Docker

```bash
# Build Docker image
docker build -t ats-cv-optimizer .

# Run container
docker run -p 3000:3000 ats-cv-optimizer
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/convert` | POST | Convert and optimize CV (SSE streaming) |
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/billing/portal` | POST | Access Stripe billing portal |
| `/api/conversions` | GET | Get user conversion history |
| `/api/webhook/stripe` | POST | Handle Stripe webhooks |

## ATS Scoring Algorithm

The scoring algorithm uses weighted calculations:

- **Formatting**: 40% - Layout, fonts, margins, ATS-friendly format
- **Keywords**: 30% - Industry-relevant keywords and skills
- **Structure**: 20% - Section organization and hierarchy
- **Readability**: 10% - Clear language and bullet points

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

---

Built with ❤️ and AI by [berch-t](https://www.linkedin.com/in/thomas-berchet-107043300).
