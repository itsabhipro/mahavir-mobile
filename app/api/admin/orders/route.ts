import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // Check if user is authenticated (admin)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('payment_status') || ''
    const dateFrom = searchParams.get('date_from') || ''
    const dateTo = searchParams.get('date_to') || ''
    const sort = searchParams.get('sort') || 'created_at_desc'

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .range(from, to)

    // Apply filters
    if (q) {
      query = query.or(`order_number.ilike.%${q}%,shipping_full_name.ilike.%${q}%,guest_email.ilike.%${q}%,guest_name.ilike.%${q}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    if (dateFrom) {
      query = query.gte('created_at', `${dateFrom}T00:00:00`)
    }

    if (dateTo) {
      query = query.lte('created_at', `${dateTo}T23:59:59`)
    }

    // Apply sorting
    if (sort === 'created_at_desc') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'created_at_asc') {
      query = query.order('created_at', { ascending: true })
    } else if (sort === 'final_amount_desc') {
      query = query.order('final_amount', { ascending: false })
    } else if (sort === 'final_amount_asc') {
      query = query.order('final_amount', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch card type names for each order
    const ordersWithCardTypes = await Promise.all(
      (data || []).map(async (order) => {
        if (order.card_type_id) {
          const { data: cardType } = await supabase
            .from('marriage_card_type_details')
            .select('name, card_type')
            .eq('id', order.card_type_id)
            .single()
          
          return {
            ...order,
            card_type_name: cardType?.name || `Card #${order.card_type_id}`,
            card_type: cardType?.card_type
          }
        }
        return order
      })
    )

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      data: ordersWithCardTypes,
      page,
      pageSize,
      total,
      totalPages
    })

  } catch (error) {
    console.error('Unexpected error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}