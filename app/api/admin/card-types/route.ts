import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') ?? '10')))

  const q = (url.searchParams.get('q') ?? '').trim()
  const type = (url.searchParams.get('type') ?? '').trim() // Normal | VIP | VVIP
  const size = (url.searchParams.get('size') ?? '').trim()
  const gsm = (url.searchParams.get('gsm') ?? '').trim()
  const sort = (url.searchParams.get('sort') ?? 'id_desc').trim()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = supabaseAdmin()

  let query = supabase
    .from('marriage_card_type_details')
    .select(
      'id,name,card_type,size,gsm,price,available_stock,max_stock,minimum_order_quantity,image_url',
      { count: 'exact' }
    )
    // order is important for consistent paging with range [1](https://supabase.com/docs/reference/javascript/range)
    .range(from, to)

  // Sorting
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'name_asc') query = query.order('name', { ascending: true })
  else if (sort === 'name_desc') query = query.order('name', { ascending: false })
  else query = query.order('id', { ascending: false })

  // Filters (ilike = case-insensitive pattern) [2](https://supabase.com/docs/reference/javascript/ilike)
  if (q) query = query.ilike('name', `%${q}%`)
  if (type) query = query.eq('card_type', type as 'Normal' | 'VIP' | 'VVIP')
  if (size) query = query.ilike('size', `%${size}%`)
  if (gsm) query = query.ilike('gsm', `%${gsm}%`)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return NextResponse.json({
    data,
    page,
    pageSize,
    total,
    totalPages,
  })
}
