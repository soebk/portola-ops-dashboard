# Portola Ops Dashboard

Settlement monitoring dashboard built with Next.js + TypeScript + Tailwind CSS for timed interview demonstration.

## Features

### Phase 1 ✅
- 50 mock transactions with realistic data
- Clean table display with proper formatting
- "Clear Funds" button on Pending transactions
- 1.5s mock API with loading states
- Processing spinner and disabled state

### Phase 2 ✅
- Red highlighting on transactions > $10,000
- Disabled Clear Funds on high-value transactions
- Super Admin toggle in header
- High-value clearing unlocked when Super Admin is ON

### Phase 3 ✅
- New transaction auto-generation every 2 seconds
- Staged loading with "X new transactions" banner
- Prevents UX issues from row shifting during user interactions
- Elegant solution with pulsing indicator

### Phase 4 ✅ FINAL
- Checkboxes for multi-select on Pending transactions
- "Clear Selected" bulk action button
- 10% random failure rate simulation
- Promise.allSettled for resilient batch processing
- Successful transactions → Cleared, failed → stay Pending

## Technical Highlights

- **Robust Error Handling**: Uses Promise.allSettled for independent transaction processing
- **UX-First Design**: Staged loading prevents accidental clicks from row shifting
- **Security Model**: Super Admin controls for high-value transactions
- **Real-time Updates**: Live transaction generation with proper state management
- **Production-Ready**: Clean TypeScript, responsive design, proper loading states

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Live Demo

🚀 **Running on localhost:3000**

## Repository

https://github.com/soebk/portola-ops-dashboard

## Performance

- Built with Next.js 16 + React 19
- Optimized with Tailwind CSS v4
- TypeScript for type safety
- All phases completed with working functionality