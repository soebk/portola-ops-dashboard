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
- **Dual streaming modes**: Live streaming vs Manual refresh
- **Settings panel**: Users choose their preferred interaction mode
- **Live mode**: Auto-streaming with hover-to-pause + manual pause/resume
- **Manual mode**: Streaming paused, users click "Refresh" when ready
- **Flash animation** highlights new transactions as they appear

### Phase 4 ✅ FINAL  
- **Beautiful custom checkboxes** for multi-select on Pending transactions
- "Clear Selected" bulk action button with type-to-confirm safety
- **10% random failure rate** on BOTH individual AND bulk operations  
- **Promise.allSettled** for resilient concurrent batch processing
- **Smart status handling**: Successful → Cleared, Failed → Failed (not Pending)
- **Independent processing**: Each transaction result handled separately

### Bonus Features ✅
- **Safety Confirmation**: Must type "clear" before bulk operations
- **Streaming Settings**: Choose between Live vs Manual modes
- **Professional UI**: Dark theme with Portola branding

## Technical Highlights

- **Beautiful Custom Checkboxes**: Professional blue-checked styling with smooth animations
- **Dual Streaming Modes**: Live auto-streaming vs Manual refresh with user choice
- **Professional Settings Panel**: Radio button interface for mode selection
- **Smart Pause Controls**: Hover-to-pause + manual pause/resume in Live mode
- **Safety Confirmations**: Type-to-confirm for destructive bulk operations
- **Enhanced Error Handling**: 10% failure rate on individual + bulk operations
- **Resilient Processing**: Promise.allSettled with proper Failed status handling
- **Working Super Admin Toggle**: Functional high-value transaction controls
- **Advanced Animations**: Flash effects for new transactions, smooth transitions
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