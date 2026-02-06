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
- Prevents UX issues without intrusive banners
- Elegant hover-based pause mechanism

### Phase 4 ✅ FINAL
- Checkboxes for multi-select on Pending transactions
- "Clear Selected" bulk action button
- 10% random failure rate simulation
- Promise.allSettled for resilient batch processing
- Successful transactions → Cleared, failed → stay Pending

## Technical Highlights

- **Professional Dark Theme**: Sophisticated UI using oklch colors and advanced CSS techniques
- **Natural Streaming UX**: Live transaction feed that pauses on hover to prevent interaction issues
- **Robust Error Handling**: Uses Promise.allSettled for independent transaction processing  
- **Security Model**: Super Admin controls for high-value transactions
- **Advanced Animations**: Smooth transitions, pulse effects, and staggered row animations
- **Production-Ready**: Clean TypeScript, responsive design, professional typography

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