import CardTypeDeleteClient from './cardTypeDeleteClient'

export default async function Page(ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return <CardTypeDeleteClient id={id} />
}