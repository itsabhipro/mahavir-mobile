import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const supabase = supabaseAdmin()

  const { data, error } = await supabase
    .from('marriage_card_type_details')
    .select('id,name,card_type,size,gsm,price,available_stock,max_stock,minimum_order_quantity')
    .eq('id', Number(id))
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const body = await req.json()

  const supabase = supabaseAdmin()

  const payload = {
    name: body.name,
    card_type: body.card_type,
    size: body.size,
    gsm: body.gsm,
    price: Number(body.price),
    available_stock: Number(body.available_stock),
    max_stock: Number(body.max_stock),
    minimum_order_quantity: Number(body.minimum_order_quantity),
  }

  const { error } = await supabase
    .from('marriage_card_type_details')
    .update(payload)
    .eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const supabase = supabaseAdmin()

  const { error } = await supabase
    .from('marriage_card_type_details')
    .delete()
    .eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}