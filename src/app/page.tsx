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
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      dot: 'bg-yellow-400',
      border: 'border-yellow-500/20',
    },
    Cleared: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      dot: 'bg-green-400',
      border: 'border-green-500/20',
    },
    Failed: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      dot: 'bg-red-400',
      border: 'border-red-500/20',
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className={`text-2xl font-mono font-light tracking-tight ${accent || 'text-white'}`}>
        {value}
      </span>
      {sub && (
        <span className="text-xs text-gray-400 font-mono">{sub}</span>
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
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set())
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [streamingMode, setStreamingMode] = useState<'live' | 'manual'>('live')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setTransactions(generateMockTransactions())
  }, [])

  // Natural streaming - add new transaction every 2 seconds unless hovering or in manual mode
  useEffect(() => {
    if (streamingMode === 'manual') return

    const interval = setInterval(() => {
      if (!isHovering && !isPaused) {
        const newTransaction = generateNewTransaction(transactionCounter)
        setTransactions(prev => [newTransaction, ...prev])
        setTransactionCounter(prev => prev + 1)

        // Mark as newly added for flash effect
        setNewlyAddedIds(prev => new Set(prev).add(newTransaction.id))

        // Remove flash after 2 seconds
        setTimeout(() => {
          setNewlyAddedIds(prev => {
            const updated = new Set(prev)
            updated.delete(newTransaction.id)
            return updated
          })
        }, 2000)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [transactionCounter, isHovering, isPaused, streamingMode])

  // Manual refresh function
  const refreshTransactions = () => {
    const newTransaction = generateNewTransaction(transactionCounter)
    setTransactions(prev => [newTransaction, ...prev])
    setTransactionCounter(prev => prev + 1)

    // Mark as newly added for flash effect
    setNewlyAddedIds(prev => new Set(prev).add(newTransaction.id))

    // Remove flash after 2 seconds
    setTimeout(() => {
      setNewlyAddedIds(prev => {
        const updated = new Set(prev)
        updated.delete(newTransaction.id)
        return updated
      })
    }, 2000)
  }

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

  // Show confirmation modal for bulk clear
  const clearSelectedTransactions = () => {
    if (selectedIds.size === 0) return
    setShowConfirmModal(true)
    setConfirmText('')
  }

  // Actually perform the bulk clear after confirmation
  const performBulkClear = async () => {
    setBulkProcessing(true)
    setShowConfirmModal(false)
    setConfirmText('')

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
    Pending: 'border-l-yellow-400/40',
    Cleared: 'border-l-green-400/40',
    Failed: 'border-l-red-400/40',
  }

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/portola-logo.svg"
              alt="Portola"
              className="h-8 w-auto invert"
            />
            <div className="border-l border-gray-600 pl-3 flex items-center">
              <span className="text-[11px] text-gray-400 tracking-wide">
                Settlement Monitor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Super Admin Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-200">Super Admin</span>
              <button
                onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isSuperAdmin ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isSuperAdmin ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              {isSuperAdmin && (
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                  ELEVATED
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Streaming Status */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  streamingMode === 'live'
                    ? (isHovering || isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse')
                    : 'bg-gray-500'
                }`} />
                {streamingMode === 'live'
                  ? (isHovering || isPaused ? 'Paused' : 'Live')
                  : 'Manual'
                }
              </div>

              {/* Manual mode refresh button */}
              {streamingMode === 'manual' && (
                <button
                  onClick={refreshTransactions}
                  className="text-[11px] font-mono text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
                >
                  Refresh
                </button>
              )}

              {/* Live mode pause/resume */}
              {streamingMode === 'live' && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="text-[11px] font-mono text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}

              {/* Settings button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-[11px] font-mono text-gray-400 hover:text-white transition-colors p-1 rounded"
                title="Settings"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
              </button>

              <span className="text-[11px] font-mono text-gray-400">
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
            accent="text-yellow-400"
          />
          <StatCard
            label="Cleared"
            value={String(stats.cleared)}
            accent="text-green-400"
          />
          <StatCard
            label="Failed"
            value={String(stats.failed)}
            accent="text-red-400"
          />
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-5 py-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-[13px] font-medium text-white">
                  {selectedIds.size} transaction{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[12px] text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={clearSelectedTransactions}
                  disabled={bulkProcessing}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-200 bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 hover:border-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden animate-fade-in"
          style={{ animationDelay: '100ms' }}
          onMouseEnter={() => streamingMode === 'live' && setIsHovering(true)}
          onMouseLeave={() => streamingMode === 'live' && setIsHovering(false)}
        >
          <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
            <span className="text-[12px] font-medium text-gray-300 tracking-wide uppercase">
              Transaction Ledger
            </span>
            <div className="flex items-center gap-4">
              {stats.pending > 0 && (
                <span className="text-[11px] font-mono text-yellow-400">
                  {stats.pending} awaiting clearance
                </span>
              )}
              {streamingMode === 'live' && isHovering && (
                <span className="text-[10px] font-mono text-yellow-400">
                  Hover paused • Move mouse away to resume
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-5 py-2.5 text-left">
                    <input
                      type="checkbox"
                      checked={transactions.filter(t => t.status === 'Pending').length > 0 &&
                               transactions.filter(t => t.status === 'Pending').every(t => selectedIds.has(t.id))}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400/50"
                    />
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    TXN ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Client
                  </th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Time
                  </th>
                  <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
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
                        border-b border-gray-700 last:border-0
                        border-l-2 ${rowBorderColor[transaction.status]}
                        ${isHighValue ? 'bg-red-900/20' : ''}
                        ${newlyAddedIds.has(transaction.id) ? 'animate-flash-new' : ''}
                        hover:bg-gray-800/50 transition-colors duration-150
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
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400/50"
                          />
                        ) : (
                          <div className="h-4 w-4"></div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono font-medium text-gray-300 whitespace-nowrap">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white whitespace-nowrap">
                        {transaction.clientName}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] font-mono font-light whitespace-nowrap tabular-nums">
                        <span className={isHighValue ? 'font-semibold text-red-400' : 'text-white'}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-mono text-gray-300">
                            {formatTime(transaction.timestamp)}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
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
                                ? 'bg-gray-600 text-gray-400 border border-gray-600 cursor-not-allowed'
                                : canClearFunds
                                ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 hover:bg-yellow-500/25 hover:border-yellow-500/40 btn-clear-pulse cursor-pointer'
                                : 'bg-gray-600 text-gray-400 border border-gray-600 cursor-not-allowed'
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
          <span className="text-[10px] font-mono text-gray-400 tracking-wide">
            PORTOLA OPS DASHBOARD v2.0
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            {stats.total} records • <span className={
              streamingMode === 'live'
                ? (isHovering || isPaused ? 'text-yellow-400' : 'text-green-400')
                : 'text-gray-400'
            }>
              {streamingMode === 'live'
                ? (isHovering ? 'hover pause' : isPaused ? 'paused' : 'streaming')
                : 'manual mode'
              }
            </span>
          </span>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />

          {/* Modal */}
          <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Streaming Settings
              </h3>
              <p className="text-gray-300 text-sm">
                Choose how transaction updates are handled.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Live Streaming Mode */}
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  streamingMode === 'live'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => {
                  setStreamingMode('live')
                  setIsPaused(false)
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                    streamingMode === 'live'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {streamingMode === 'live' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Live Streaming</h4>
                    <p className="text-gray-400 text-sm">
                      New transactions appear automatically every 2 seconds.
                      Hover over the table to pause streaming temporarily.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Mode */}
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  streamingMode === 'manual'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => {
                  setStreamingMode('manual')
                  setIsHovering(false)
                  setIsPaused(false)
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                    streamingMode === 'manual'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {streamingMode === 'manual' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Manual Refresh</h4>
                    <p className="text-gray-400 text-sm">
                      Transactions are paused. Click "Refresh" to manually load new transactions
                      when you're ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Confirm Bulk Clear
              </h3>
              <p className="text-gray-300 text-sm">
                You are about to clear {selectedIds.size} selected transaction{selectedIds.size !== 1 ? 's' : ''}.
                This action cannot be undone.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type <span className="font-mono bg-gray-700 px-1 rounded">clear</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && confirmText.toLowerCase() === 'clear') {
                    performBulkClear()
                  } else if (e.key === 'Escape') {
                    setShowConfirmModal(false)
                  }
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type 'clear' to confirm"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={performBulkClear}
                disabled={confirmText.toLowerCase() !== 'clear'}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
              >
                Clear {selectedIds.size} Transaction{selectedIds.size !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}