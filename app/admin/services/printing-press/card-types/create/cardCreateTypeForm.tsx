'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type MarriageCardType = 'Normal' | 'VIP' | 'VVIP'

export default function CreateCardTypeForm() {
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setMessage(null)
    setLoading(true)
    console.log('Form data received:', Object.fromEntries(formData.entries()))
    try {
      const name = String(formData.get('name') || '').trim()
      const card_type = String(formData.get('card_type') || 'Normal') as MarriageCardType
      const size = String(formData.get('size') || '').trim()
      const gsm = String(formData.get('gsm') || '').trim()

      const price = Number(formData.get('price') || 0)
      const available_stock = Number(formData.get('available_stock') || 0)
      const max_stock = Number(formData.get('max_stock') || 0)
      const minimum_order_quantity = Number(formData.get('minimum_order_quantity') || 0)

      if (!name || !size || !gsm) {
        throw new Error('Name, size and GSM are required.')
      }
      if (!imageFile) {
        throw new Error('Please select an image to upload.')
      }

      // 1) Upload image to Storage
      const ext = imageFile.name.split('.').pop() || 'png'
      const fileName = `${crypto.randomUUID()}.${ext}`
      const filePath = `card-types/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('card-images')
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type,
          cacheControl: '3600',
        })

      if (uploadError) throw uploadError

      // 2) Get public URL (works if bucket is PUBLIC)
      // getPublicUrl builds a direct URL for objects in public buckets [3](https://deepwiki.com/supabase/supabase-js/6.5-signed-urls-and-public-access)
      const { data: publicUrlData } = supabase.storage
        .from('card-images')
        .getPublicUrl(filePath)

      const image_url = publicUrlData.publicUrl
        console.log('Image uploaded to:', image_url)
      // 3) Insert into DB (store the URL in the model)
      const { error: insertError } = await supabase
        .from('marriage_card_type_details')
        .insert({
          name,
          card_type,
          size,
          gsm,
          price,
          available_stock,
          max_stock,
          minimum_order_quantity,
          image_url,
        })

      if (insertError) throw insertError

      setMessage('✅ Card type created successfully!')
      // Reset form UI state
      setImageFile(null)
      setPreviewUrl(null)
      ;(document.getElementById('cardTypeForm') as HTMLFormElement | null)?.reset()
    } catch (e: Error | unknown) {
      if(e instanceof Error){
        setMessage(`❌ ${e?.message ?? 'Something went wrong'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  function onPickFile(file: File | null) {
    setImageFile(file)
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  return (
    <form
      id="cardTypeForm"
      action={onSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. Royal Gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Card Type</label>
          <select
            name="card_type"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            defaultValue="Normal"
          >
            <option value="Normal">Normal</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <input
            name="size"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 5x7"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GSM</label>
          <input
            name="gsm"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 2.500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Available Stock</label>
          <input
            name="available_stock"
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Stock</label>
          <input
            name="max_stock"
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
          <input
            name="minimum_order_quantity"
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g. 50"
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700">Card Image</label>
        <div className="mt-2 flex items-start gap-4">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />

          {previewUrl && (
            <div className="h-24 w-24 overflow-hidden rounded-lg ring-1 ring-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          For public buckets we store a permanent URL via <code>getPublicUrl()</code>. [3](https://deepwiki.com/supabase/supabase-js/6.5-signed-urls-and-public-access)
          For private buckets, store <code>filePath</code> and generate signed URLs via <code>createSignedUrl()</code>. [4](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Create'}
        </button>

        {message && (
          <div className="text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </form>
  )
}