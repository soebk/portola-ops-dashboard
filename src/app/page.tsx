'use client'

import { useState, useEffect } from 'react'

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
    'John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
    'Lisa Anderson', 'Robert Taylor', 'Jennifer Moore', 'William Jackson', 'Mary White',
    'James Martin', 'Patricia Garcia', 'Richard Rodriguez', 'Susan Lewis', 'Joseph Lee',
    'Linda Walker', 'Thomas Hall', 'Barbara Allen', 'Christopher Young', 'Nancy King',
    'Daniel Wright', 'Betty Lopez', 'Matthew Hill', 'Helen Scott', 'Anthony Green',
    'Donna Adams', 'Mark Baker', 'Carol Gonzalez', 'Donald Nelson', 'Ruth Carter',
    'Steven Mitchell', 'Sharon Perez', 'Paul Roberts', 'Michelle Turner', 'Andrew Phillips',
    'Kimberly Campbell', 'Joshua Parker', 'Elizabeth Evans', 'Kenneth Edwards', 'Amy Collins',
    'Kevin Stewart', 'Deborah Sanchez', 'Brian Morris', 'Angela Rogers', 'George Reed',
    'Brenda Cook', 'Edward Morgan', 'Emma Bailey', 'Ronald Cooper', 'Olivia Richardson'
  ]
  
  const statuses: Transaction['status'][] = ['Pending', 'Cleared', 'Failed']
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(3, '0')}`,
    clientName: names[i],
    amount: Math.floor(Math.random() * 50000) + 1000, // $1K to $51K
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
  }))
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [transactionCounter, setTransactionCounter] = useState(51) // Start after initial 50

  useEffect(() => {
    setTransactions(generateMockTransactions())
  }, [])

  // Generate a single new transaction
  const generateNewTransaction = (): Transaction => {
    const names = [
      'Alex Chen', 'Jordan Williams', 'Taylor Brown', 'Casey Johnson', 'Morgan Davis',
      'Jamie Wilson', 'Riley Anderson', 'Avery Taylor', 'Quinn Moore', 'Parker Jackson',
      'Cameron White', 'Blake Harris', 'Sage Martin', 'River Thompson', 'Sky Garcia',
      'Phoenix Rodriguez', 'Rowan Lewis', 'Dakota Lee', 'Storm Walker', 'Nova Hall'
    ]
    
    const statuses: Transaction['status'][] = ['Pending', 'Cleared', 'Failed']
    
    return {
      id: `TXN-${String(transactionCounter).padStart(3, '0')}`,
      clientName: names[Math.floor(Math.random() * names.length)],
      amount: Math.floor(Math.random() * 50000) + 1000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date().toISOString()
    }
  }

  // Add new transaction every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = generateNewTransaction()
      setPendingTransactions(prev => [newTransaction, ...prev])
      setTransactionCounter(prev => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [transactionCounter])

  // Load pending transactions into main list
  const loadPendingTransactions = () => {
    setTransactions(prev => [...pendingTransactions, ...prev])
    setPendingTransactions([])
  }

  const clearFunds = async (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId)
    
    // Check if high-value transaction and admin permission
    if (transaction && transaction.amount > 10000 && !isSuperAdmin) {
      return // Should not happen due to UI logic, but safety check
    }
    
    setProcessingIds(prev => new Set(prev).add(transactionId))
    
    // Mock API call with 1.5s delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, status: 'Cleared' }
          : transaction
      )
    )
    
    setProcessingIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(transactionId)
      return newSet
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-50'
      case 'Cleared': return 'text-green-600 bg-green-50'
      case 'Failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Portola Ops Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Settlement monitoring and fund clearing operations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Super Admin</span>
                  <button
                    onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSuperAdmin ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isSuperAdmin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
                {isSuperAdmin && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    High-Value Clearing Enabled
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* New transactions banner */}
          {pendingTransactions.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {pendingTransactions.length} new transaction{pendingTransactions.length !== 1 ? 's' : ''} available
                    </p>
                    <p className="text-xs text-blue-600">
                      Click to load into table and prevent row shifting
                    </p>
                  </div>
                </div>
                <button
                  onClick={loadPendingTransactions}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Load {pendingTransactions.length} Transaction{pendingTransactions.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const isHighValue = transaction.amount > 10000
                  const canClearFunds = transaction.status === 'Pending' && (!isHighValue || isSuperAdmin)
                  
                  return (
                    <tr 
                      key={transaction.id} 
                      className={`${isHighValue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={isHighValue ? 'font-semibold text-red-700' : ''}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(transaction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {transaction.status === 'Pending' && (
                          <button
                            onClick={() => clearFunds(transaction.id)}
                            disabled={processingIds.has(transaction.id) || !canClearFunds}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              canClearFunds
                                ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                            }`}
                          >
                            {processingIds.has(transaction.id) ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : canClearFunds ? (
                              'Clear Funds'
                            ) : (
                              'Requires Super Admin'
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
      </div>
    </div>
  )
}