'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

interface Transaction {
  id: string
  clientName: string
  amount: number
  status: 'Pending' | 'Cleared' | 'Failed'
  timestamp: string
}

// Generate mock transactions
const generateMockTransactions = (): Transaction[] => {
  const names = [
    'Meridian Capital Partners', 'Lumen Digital Holdings', 'Atlas Fiduciary Group', 
    'Redstone Treasury LLC', 'Vega Stablecoin Corp', 'Northbridge Settlement Co',
    'Cascade Payments Inc', 'Ironclad Financial Services', 'Solaris Digital Assets',
    'Whitmore & Jacobs LLP', 'Pinnacle Reserve Fund', 'Crescent Bay Ventures',
    'Apex Clearing Solutions', 'BlueLine Custody Services', 'Tidewater Compliance Ltd',
    'Granite Peak Holdings', 'Starboard Treasury Inc', 'Ember Financial Group',
    'Harborview Capital', 'Keystone Digital Payments'
  ]
  
  const statuses: Transaction['status'][] = ['Pending', 'Cleared', 'Failed']
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(3, '0')}`,
    clientName: names[Math.floor(Math.random() * names.length)],
    amount: Math.floor(Math.random() * 2000000) + 500, // $500 to $2M
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
  }))
}

// Generate a single new transaction
const generateNewTransaction = (counter: number): Transaction => {
  const names = [
    'Quantum Finance LLC', 'Digital Ledger Corp', 'Nexus Capital Group',
    'Prism Asset Management', 'Velocity Trading Inc', 'Phoenix Investment Fund'
  ]
  
  const statuses: Transaction['status'][] = ['Pending', 'Cleared', 'Failed']
  
  return {
    id: `TXN-${String(counter).padStart(3, '0')}`,
    clientName: names[Math.floor(Math.random() * names.length)],
    amount: Math.floor(Math.random() * 1500000) + 1000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date().toISOString()
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    Pending: {
      bg: 'bg-accent-amber/10',
      text: 'text-accent-amber',
      dot: 'bg-accent-amber',
      border: 'border-accent-amber/20',
    },
    Cleared: {
      bg: 'bg-accent-green/10',
      text: 'text-accent-green', 
      dot: 'bg-accent-green',
      border: 'border-accent-green/20',
    },
    Failed: {
      bg: 'bg-accent-red/10',
      text: 'text-accent-red',
      dot: 'bg-accent-red',
      border: 'border-accent-red/20',
    },
  }[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="bg-surface-1 border border-border-subtle rounded-lg px-5 py-4 flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
        {label}
      </span>
      <span className={`text-2xl font-mono font-light tracking-tight ${accent || 'text-text-primary'}`}>
        {value}
      </span>
      {sub && (
        <span className="text-xs text-text-muted font-mono">{sub}</span>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="processing-spinner h-3 w-3" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" strokeLinecap="round" />
    </svg>
  )
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [transactionCounter, setTransactionCounter] = useState(51)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setTransactions(generateMockTransactions())
  }, [])

  // Natural streaming - add new transaction every 2 seconds unless hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        const newTransaction = generateNewTransaction(transactionCounter)
        setTransactions(prev => [newTransaction, ...prev])
        setTransactionCounter(prev => prev + 1)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [transactionCounter, isHovering])

  const stats = useMemo(() => {
    const pending = transactions.filter((t) => t.status === 'Pending')
    const cleared = transactions.filter((t) => t.status === 'Cleared')
    const failed = transactions.filter((t) => t.status === 'Failed')
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
    const pendingVolume = pending.reduce((sum, t) => sum + t.amount, 0)

    return {
      total: transactions.length,
      pending: pending.length,
      cleared: cleared.length,
      failed: failed.length,
      totalVolume,
      pendingVolume,
    }
  }, [transactions])

  // Mock API call with 10% failure rate
  const mockClearTransaction = async (transactionId: string): Promise<{ id: string; success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const success = Math.random() > 0.1 // 90% success rate
    return { id: transactionId, success }
  }

  const clearFunds = async (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId)
    
    if (transaction && transaction.amount > 10000 && !isSuperAdmin) {
      return
    }
    
    setProcessingIds(prev => new Set(prev).add(transactionId))
    
    const result = await mockClearTransaction(transactionId)
    
    if (result.success) {
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, status: 'Cleared' }
            : transaction
        )
      )
    }
    
    setProcessingIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(transactionId)
      return newSet
    })
  }

  // Bulk clear selected transactions
  const clearSelectedTransactions = async () => {
    if (selectedIds.size === 0) return

    setBulkProcessing(true)
    const selectedTransactions = Array.from(selectedIds)
    
    // Filter out high-value transactions that require super admin
    const allowedTransactions = selectedTransactions.filter(id => {
      const transaction = transactions.find(t => t.id === id)
      return transaction && (transaction.amount <= 10000 || isSuperAdmin)
    })

    // Create promises for all allowed transactions
    const clearPromises = allowedTransactions.map(id => mockClearTransaction(id))
    
    // Use Promise.allSettled to handle successes and failures independently
    const results = await Promise.allSettled(clearPromises)
    
    // Process results
    const successfulIds: string[] = []
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        successfulIds.push(allowedTransactions[index])
      }
    })

    // Update transaction statuses - only successful ones become Cleared
    setTransactions(prev => 
      prev.map(transaction => 
        successfulIds.includes(transaction.id)
          ? { ...transaction, status: 'Cleared' as const }
          : transaction
      )
    )

    // Clear selection and processing state
    setSelectedIds(new Set())
    setBulkProcessing(false)
  }

  // Toggle transaction selection
  const toggleSelection = (transactionId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId)
      } else {
        newSet.add(transactionId)
      }
      return newSet
    })
  }

  // Select/deselect all pending transactions
  const toggleSelectAll = () => {
    const pendingTransactionIds = transactions
      .filter(t => t.status === 'Pending')
      .map(t => t.id)
    
    if (selectedIds.size === pendingTransactionIds.length) {
      setSelectedIds(new Set()) // Deselect all
    } else {
      setSelectedIds(new Set(pendingTransactionIds)) // Select all pending
    }
  }

  const rowBorderColor: Record<Transaction['status'], string> = {
    Pending: 'border-l-accent-amber/40',
    Cleared: 'border-l-accent-green/20',
    Failed: 'border-l-accent-red/30',
  }

  return (
    <div className="min-h-screen bg-surface-0 font-sans">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-1/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-accent-amber/15 border border-accent-amber/25 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-amber">
                <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-text-primary leading-none">
                Portola
              </h1>
              <span className="text-[11px] text-text-muted tracking-wide">
                Settlement Monitor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Super Admin Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-text-secondary">Super Admin</span>
              <button
                onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-surface-1 ${
                  isSuperAdmin ? 'bg-accent-amber' : 'bg-surface-3'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-surface-0 transition-transform ${
                    isSuperAdmin ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              {isSuperAdmin && (
                <span className="text-[10px] font-medium text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded border border-accent-amber/20">
                  HIGH-VALUE ENABLED
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                Live
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
          <StatCard
            label="Total Volume"
            value={formatCurrency(stats.totalVolume)}
            sub={`${stats.total} transactions`}
          />
          <StatCard
            label="Pending"
            value={String(stats.pending)}
            sub={formatCurrency(stats.pendingVolume)}
            accent="text-accent-amber"
          />
          <StatCard
            label="Cleared"
            value={String(stats.cleared)}
            accent="text-accent-green"
          />
          <StatCard
            label="Failed"
            value={String(stats.failed)}
            accent="text-accent-red"
          />
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="bg-surface-1 border border-border-subtle rounded-lg px-5 py-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-[13px] font-medium text-text-primary">
                  {selectedIds.size} transaction{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[12px] text-text-muted hover:text-text-secondary transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={clearSelectedTransactions}
                  disabled={bulkProcessing}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-200 bg-accent-green/15 text-accent-green border border-accent-green/25 hover:bg-accent-green/25 hover:border-accent-green/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkProcessing ? (
                    <>
                      <Spinner />
                      Processing...
                    </>
                  ) : (
                    `Clear Selected (${selectedIds.size})`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Table */}
        <div 
          className="bg-surface-1 border border-border-subtle rounded-lg overflow-hidden animate-fade-in"
          style={{ animationDelay: '100ms' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="text-[12px] font-medium text-text-secondary tracking-wide uppercase">
              Transaction Ledger
            </span>
            <span className="text-[11px] font-mono text-text-muted">
              {stats.pending > 0 && (
                <span className="text-accent-amber">{stats.pending} awaiting clearance</span>
              )}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left">
                    <input
                      type="checkbox"
                      checked={transactions.filter(t => t.status === 'Pending').length > 0 && 
                               transactions.filter(t => t.status === 'Pending').every(t => selectedIds.has(t.id))}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-border bg-surface-2 text-accent-amber focus:ring-accent-amber/50"
                    />
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    TXN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Time
                  </th>
                  <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, i) => {
                  const isHighValue = transaction.amount > 10000
                  const canClearFunds = transaction.status === 'Pending' && (!isHighValue || isSuperAdmin)
                  
                  return (
                    <tr
                      key={transaction.id}
                      className={`
                        border-b border-border-subtle last:border-0
                        border-l-2 ${rowBorderColor[transaction.status]}
                        ${isHighValue ? 'bg-accent-red/5' : ''}
                        hover:bg-surface-2/50 transition-colors duration-150
                        animate-row-in
                      `}
                      style={{ animationDelay: `${i * 20}ms` }}
                    >
                      <td className="px-5 py-3">
                        {transaction.status === 'Pending' ? (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(transaction.id)}
                            onChange={() => toggleSelection(transaction.id)}
                            className="h-4 w-4 rounded border-border bg-surface-2 text-accent-amber focus:ring-accent-amber/50"
                          />
                        ) : (
                          <div className="h-4 w-4"></div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono font-medium text-text-secondary whitespace-nowrap">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-primary whitespace-nowrap">
                        {transaction.clientName}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] font-mono font-light whitespace-nowrap tabular-nums">
                        <span className={isHighValue ? 'font-semibold text-accent-red' : 'text-text-primary'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-mono text-text-secondary">
                            {formatTime(transaction.timestamp)}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            {formatDate(transaction.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {transaction.status === 'Pending' && (
                          <button
                            onClick={() => clearFunds(transaction.id)}
                            disabled={processingIds.has(transaction.id) || !canClearFunds}
                            className={`
                              inline-flex items-center gap-1.5 rounded-md px-3 py-1.5
                              text-[11px] font-medium tracking-wide
                              transition-all duration-200
                              ${processingIds.has(transaction.id)
                                ? 'bg-surface-3 text-text-muted border border-border cursor-not-allowed'
                                : canClearFunds
                                ? 'bg-accent-amber/15 text-accent-amber border border-accent-amber/25 hover:bg-accent-amber/25 hover:border-accent-amber/40 btn-clear-pulse cursor-pointer'
                                : 'bg-surface-3 text-text-muted border border-border cursor-not-allowed'
                              }
                            `}
                          >
                            {processingIds.has(transaction.id) ? (
                              <>
                                <Spinner />
                                Processing
                              </>
                            ) : canClearFunds ? (
                              'Clear Funds'
                            ) : (
                              'Super Admin Required'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-text-muted tracking-wide">
            PORTOLA SETTLEMENTS v2.0
          </span>
          <span className="text-[10px] font-mono text-text-muted">
            {stats.total} records • {isHovering ? 'paused' : 'streaming'}
          </span>
        </div>
      </main>
    </div>
  )
}