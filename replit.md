# Netrunner NFT Burn

## Overview

Netrunner NFT Burn is a Web3 application that allows users to burn eligible Solana NFTs in exchange for discount codes. Users connect their Solana wallet, select up to 10 eligible NFTs from a curated allowlist, and transfer them to an intake wallet. Each NFT burned provides a 3% discount (up to 30% maximum). The application features a cyberpunk-inspired dark theme with neon accents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme (dark mode, teal/green accent colors)
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from built assets

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` contains database models
- **Current Storage**: In-memory storage implementation (MemStorage) as placeholder
- **Planned**: Google Sheets integration for burn request tracking (per requirements)

### Application Flow
1. User lands on home page with hero section explaining the burn program
2. User connects Solana wallet (Phantom/Solflare via @solana/wallet-adapter)
3. App fetches user's NFTs via Helius DAS API and filters by mint allowlist
4. User selects up to 10 eligible NFTs with live discount preview
5. User provides email and Discord handle
6. Transaction transfers selected NFTs to intake wallet
7. Confirmation screen shows transaction details and discount code status

### Key Constants (Hardcoded)
- Intake Wallet: `J6wu13dKzy2PU7qQbmxkjauf8NtysUMfmVSdN36V95Mx`
- Eligible Mint Allowlist: `["DphFDYiifJ5NBCYXqsYVuDEynFTc2dASCRJeHQ4B4cNn"]`
- Max Selection: 10 NFTs
- Discount Rate: 3% per NFT

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `HELIUS_API_KEY` - For fetching NFTs via Helius DAS API
- `HELIUS_WEBHOOK_SECRET` - For verifying Helius webhook callbacks
- `RESEND_API_KEY` - For sending discount codes via email
- Google Sheets credentials + `SHEET_ID` - For burn request tracking

### Third-Party Services
- **Helius**: NFT data fetching (DAS API) and transaction webhooks
- **Resend**: Email delivery for discount codes
- **Google Sheets**: Backend database for tracking burn requests and discount codes

### Blockchain Integration
- **Network**: Solana Mainnet
- **Wallet Adapters**: Phantom, Solflare (via @solana/wallet-adapter)
- **NFT Type**: Standard SPL NFTs only (not compressed NFTs)