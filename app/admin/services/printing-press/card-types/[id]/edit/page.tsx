import CardTypeEditClient from './cardTypeEditClient'

export default async function Page(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return <CardTypeEditClient id={id} />
}