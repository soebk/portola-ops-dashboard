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
- **Natural streaming** that pauses when user hovers over table
- **Flash animation** highlights new transactions as they appear
- Elegant hover-based pause mechanism

### Phase 4 ✅ FINAL
- Checkboxes for multi-select on Pending transactions
- "Clear Selected" bulk action button
- 10% random failure rate simulation
- Promise.allSettled for resilient batch processing
- Successful transactions → Cleared, failed → stay Pending

## Technical Highlights

- **Dark Theme UI**: Professional design with proper contrast and visual hierarchy
- **Natural Streaming UX**: Live transaction feed with flash animations for new entries
- **Hover-Based Pause**: Streaming pauses when user hovers over table to prevent misclicks
- **Working Super Admin Toggle**: Functional high-value transaction controls
- **Robust Error Handling**: Uses Promise.allSettled for independent transaction processing  
- **Advanced Animations**: Flash effects, smooth transitions, and staggered row reveals
- **Production-Ready**: Clean TypeScript, responsive design, proper accessibility

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