# Netrunner NFT Burn - Design Guidelines

## Design Approach

**Selected Approach**: Hybrid - Modern Web3 Design System with Cyberpunk Influences

Drawing inspiration from leading Web3 platforms (Phantom, Magic Eden, OpenSea) while incorporating the "Netrunner" cyberpunk aesthetic. Prioritize clarity, trust, and functional efficiency over decorative elements.

## Core Design Principles

1. **Trust & Transparency**: Clear transaction states, visible security indicators
2. **Cyber-Minimal**: Dark interface with strategic neon accents, clean layouts
3. **Progressive Disclosure**: Show complexity only when needed
4. **Status Clarity**: Unmistakable visual feedback for every state

## Typography

**Font Stack**:
- Primary: Inter (via Google Fonts) - clean, technical readability
- Monospace: JetBrains Mono - for wallet addresses, transaction signatures, codes

**Hierarchy**:
- Hero/H1: 3xl to 4xl, font-bold
- Section Headers/H2: 2xl, font-semibold
- Card Titles/H3: lg, font-medium
- Body: base, font-normal
- Labels/Captions: sm, font-medium
- Mono Data: sm to base, monospace

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6, p-8
- Section gaps: gap-6, gap-8
- Margins: m-4, m-8, m-12

**Container Strategy**:
- Max-width: max-w-6xl centered
- Full-width for background treatments
- Generous whitespace, never cramped

## Application Structure

### Header
- Logo: "NETRUNNER" text with subtle glow effect
- Wallet connect button (right-aligned): Shows truncated address when connected with status indicator dot
- Network indicator: "Solana Mainnet" badge

### Main Flow (Single-Page States)

**State 1: Wallet Disconnected**
- Centered hero section (60vh height)
- Large heading: "Burn NFTs, Claim Discounts"
- Subheading explaining the burn mechanism (3% per NFT, max 10)
- Prominent wallet connect button with icon
- Below fold: Quick stats grid (3 columns): "Total Burns", "Discounts Claimed", "Active Burners"

**State 2: Connected - Loading NFTs**
- Skeleton grid (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- Loading spinner with status text: "Fetching your NFTs from Helius..."

**State 3: No Eligible NFTs**
- Centered empty state illustration placeholder
- Clear message: "No Eligible NFTs Found"
- Explanation of allowlist
- Secondary action: "View Eligible Collections" link

**State 4: NFT Selection Grid**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- NFT Cards:
  - Square aspect ratio images
  - Checkmark indicator in top-right corner for selected state
  - NFT name below image
  - Mint address (truncated, monospace) below name
  - Subtle border on hover, distinct border when selected
  - Disabled/dimmed state once 10 are selected

**Selection Summary Bar** (Sticky bottom or top):
- Shows: "Selected: X/10 NFTs"
- Live discount calculation: "Discount: X%" (large, prominent)
- "Continue" button (disabled until at least 1 selected)

**State 5: User Info Collection**
- Side-by-side layout on desktop (form left, summary right)
- Form fields:
  - Email input with validation
  - Discord handle input
  - Both with clear labels and placeholder examples
- Right panel: Selected NFTs preview (scrollable grid), discount summary
- "Burn & Claim Discount" primary action button

**State 6: Transaction Processing**
- Modal overlay with blur backdrop
- Transaction animation/loading state
- Status updates: "Preparing transaction..." → "Sign in wallet..." → "Processing..."
- Cancel option during signing phase

**State 7: Confirmation**
- Success checkmark animation
- Transaction signature (monospace, copyable)
- Burn summary: "X NFTs burned for Y% discount"
- Discount code delivery status
- "Check Status" link with transaction signature
- "Burn More" secondary action

### Footer
- Minimal: Links to docs, status page, support
- Social icons (Discord, Twitter)
- Network/version info

## Component Library

### Buttons
- Primary: Solid fill, medium rounded corners (rounded-lg)
- Secondary: Outlined, same rounding
- Sizes: base padding p-3 px-6, larger p-4 px-8 for primary actions
- Icons: Left-aligned with gap-2 spacing

### Cards
- Background: Subtle contrast from page background
- Rounded: rounded-xl
- Padding: p-6
- Border: 1px subtle

### Form Inputs
- Height: h-12
- Rounded: rounded-lg
- Padding: px-4
- Clear focus states with border treatment

### Badges/Pills
- Small: text-xs px-3 py-1
- Fully rounded: rounded-full
- Use for status indicators, counts

### Modal/Overlay
- Backdrop blur: backdrop-blur-sm
- Modal: max-w-lg, rounded-2xl, p-8
- Centered with smooth fade-in

## Animations

**Minimal, Purposeful Only**:
- Wallet connect button: Subtle pulse when disconnected
- NFT card selection: Smooth scale transform (scale-105) and border color transition
- Success state: Single checkmark animation
- Loading states: Simple spinner, no elaborate effects
- Avoid scroll-triggered or excessive micro-interactions

## Images

**NFT Images**: 
- User's actual NFT images fetched from Helius
- Square aspect ratio containers
- Lazy loading for grid performance

**Hero Background** (State 1):
- Abstract cyber-grid or circuit pattern (subtle, low-contrast)
- Gradient overlay for depth
- Not a photographic image - keep it technical/abstract

**No other decorative images needed** - focus on functional clarity

## Status Indicators

- Transaction states: Clear color coding (processing, success, error)
- Wallet connection: Colored dot indicator
- Selection count: Always visible, updates in real-time
- Form validation: Inline error messages below fields

## Accessibility

- All interactive elements keyboard navigable
- Focus indicators on all focusable elements
- ARIA labels for wallet addresses, transaction signatures
- Screen reader announcements for state changes
- Sufficient contrast ratios throughout
- NFT card selection toggleable via keyboard

This design balances Web3 technical requirements with modern UX patterns, ensuring users feel secure and informed throughout the burn-and-claim process while maintaining the cyberpunk "Netrunner" brand identity.