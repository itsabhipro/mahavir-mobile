'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'printing' | 'ready_for_delivery' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
type PaymentMethod = 'cash_on_delivery' | 'online_payment' | 'bank_transfer' | 'upi'

type OrderRow = {
  id: number
  order_number: string
  user_id: string | null
  guest_email: string | null
  guest_name: string | null
  card_type_id: number
  quantity: number
  unit_price: number
  final_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  shipping_full_name: string
  shipping_city: string
  shipping_state: string
  created_at: string
  expected_delivery_date: string | null
  card_type_name?: string
  card_type?: string
}

type ApiResp = {
  data: OrderRow[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  error?: string
}

interface OrdersClientProps {
  title: string
  defaultStatus?: OrderStatus | PaymentStatus
  statusFilter?: 'order' | 'payment'
  showFilters?: boolean
}

export default function OrdersClient({ 
  title, 
  defaultStatus,
  statusFilter = 'order',
  showFilters = true 
}: OrdersClientProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState<ApiResp | null>(null)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState(defaultStatus || '')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState('created_at_desc')

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    if (q.trim()) params.set('q', q.trim())
    if (status) params.set('status', status)
    if (paymentStatus) params.set('payment_status', paymentStatus)
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)
    if (sort) params.set('sort', sort)
    if (statusFilter === 'order' && defaultStatus) {
      params.set('status', defaultStatus)
    } else if (statusFilter === 'payment' && defaultStatus) {
      params.set('payment_status', defaultStatus)
    }
    return params.toString()
  }, [page, pageSize, q, status, paymentStatus, dateFrom, dateTo, sort, defaultStatus, statusFilter])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const r = await fetch(`/api/admin/orders?${queryString}`, { cache: 'no-store' })
        const json = (await r.json()) as ApiResp
        if (!cancelled) setResp(json)
      } catch (err) {
        console.error('Failed to load orders:', err)
        if (!cancelled) setResp({ data: [], page: 1, pageSize: 10, total: 0, totalPages: 1, error: 'Failed to load orders' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [queryString])

  const rows = resp?.data ?? []
  const totalPages = resp?.totalPages ?? 1
  const total = resp?.total ?? 0

  function resetToFirstPage() {
    setPage(1)
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string, text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Confirmed' },
      processing: { color: 'bg-purple-100 text-purple-800', text: 'Processing' },
      printing: { color: 'bg-indigo-100 text-indigo-800', text: 'Printing' },
      ready_for_delivery: { color: 'bg-teal-100 text-teal-800', text: 'Ready for Delivery' },
      shipped: { color: 'bg-orange-100 text-orange-800', text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' }
    }
    const { color, text } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{text}</span>
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, { color: string, text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', text: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Refunded' },
      partial: { color: 'bg-blue-100 text-blue-800', text: 'Partial' }
    }
    const { color, text } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{text}</span>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">
            Manage and track customer orders for wedding cards
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/orders/all"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View All Orders
          </Link>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Create Order
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); resetToFirstPage() }}
            placeholder="Search order #, name, email…"
            className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); resetToFirstPage() }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="printing">Printing</option>
            <option value="ready_for_delivery">Ready for Delivery</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => { setPaymentStatus(e.target.value); resetToFirstPage() }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="partial">Partial</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); resetToFirstPage() }}
            placeholder="From date"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); resetToFirstPage() }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="created_at_desc">Newest First</option>
            <option value="created_at_asc">Oldest First</option>
            <option value="final_amount_desc">Amount High to Low</option>
            <option value="final_amount_asc">Amount Low to High</option>
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {rows.filter(r => r.status === 'pending').length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-600">In Process</div>
          <div className="text-2xl font-bold text-blue-600">
            {rows.filter(r => ['confirmed', 'processing', 'printing'].includes(r.status)).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-600">Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            ₹{rows.reduce((sum, r) => sum + r.final_amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="text-sm text-gray-600">Loading orders...</div>
        </div>
      )}

      {resp?.error && !loading && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
          {resp.error}
        </div>
      )}

      {/* Orders Table */}
      {!loading && !resp?.error && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-mono font-semibold text-gray-900">{order.order_number}</div>
                    <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{order.shipping_full_name}</div>
                    <div className="text-xs text-gray-500">
                      {order.guest_email || (order.user_id ? 'Registered User' : 'Guest')}
                    </div>
                    <div className="text-xs text-gray-500">{order.shipping_city}, {order.shipping_state}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">Card Type: {order.card_type_name || `#${order.card_type_id}`}</div>
                    {order.expected_delivery_date && (
                      <div className="text-xs text-gray-500">
                        Delivery: {formatDate(order.expected_delivery_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">₹{order.final_amount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-500">₹{order.unit_price}/unit</div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-3">
                    {getPaymentStatusBadge(order.payment_status)}
                    {order.payment_method && (
                      <div className="mt-1 text-xs text-gray-500">
                        {order.payment_method.replace(/_/g, ' ')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{formatDate(order.created_at)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Details
                      </Link>
                      <button className="text-left text-sm text-gray-600 hover:text-gray-800 hover:underline">
                        Update Status
                      </button>
                      <button className="text-left text-sm text-gray-600 hover:text-gray-800 hover:underline">
                        Print Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-600" colSpan={8}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-700">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} orders
            <span className="mx-2">•</span>
            Page <b>{page}</b> of <b>{totalPages}</b>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}