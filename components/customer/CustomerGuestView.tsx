import Link from "next/link";

export default function CustomerGuestView() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
          Create Beautiful Wedding Cards
          <span className="block text-pink-600">For Your Special Day</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Design custom wedding cards with our easy-to-use designer. Choose from beautiful templates,
          add bride & groom details, event information, and get them delivered to your doorstep.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center shadow-sm">
          <div className="mb-4 inline-flex rounded-full bg-pink-100 p-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Beautiful Designs</h3>
          <p className="text-slate-600">
            Choose from our collection of elegant wedding card templates for every style.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
          <div className="mb-4 inline-flex rounded-full bg-blue-100 p-4">
            <span className="text-3xl">✍️</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Custom Details</h3>
          <p className="text-slate-600">
            Add bride, groom, event information, and personalized messages.
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-6 text-center shadow-sm">
          <div className="mb-4 inline-flex rounded-full bg-green-100 p-4">
            <span className="text-3xl">🚚</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold">Home Delivery</h3>
          <p className="text-slate-600">
            Get your custom cards delivered anywhere with tracking and secure packaging.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mb-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">Ready to Create Your Card?</h2>
        <p className="mb-6 text-lg opacity-90">
          Start designing in minutes. No account needed to begin.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/customer/order/new"
            className="rounded-xl bg-white px-8 py-3 font-semibold text-pink-600 hover:bg-gray-100"
          >
            Start Designing →
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border-2 border-white px-8 py-3 font-semibold hover:bg-white/10"
          >
            Login to Continue
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600">
              1
            </div>
            <h3 className="mb-2 font-semibold">Choose Design</h3>
            <p className="text-sm text-slate-600">Select from beautiful card templates</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              2
            </div>
            <h3 className="mb-2 font-semibold">Add Details</h3>
            <p className="text-sm text-slate-600">Enter bride, groom, event information</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              3
            </div>
            <h3 className="mb-2 font-semibold">Enter Address</h3>
            <p className="text-sm text-slate-600">Provide delivery address</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              4
            </div>
            <h3 className="mb-2 font-semibold">Confirm Order</h3>
            <p className="text-sm text-slate-600">Review and place your order</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">What Our Customers Say</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 p-6">
            <p className="mb-4 italic text-slate-700">
             { "The wedding cards we designed were absolutely beautiful! The process was so easy and the quality exceeded our expectations."}
            </p>
            <div className="flex items-center">
              <div className="mr-3 h-10 w-10 rounded-full bg-slate-300"></div>
              <div>
                <p className="font-semibold">Narendra mishra</p>
                <p className="text-sm text-slate-500">Gavandri</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-100 p-6">
            <p className="mb-4 italic text-slate-700">
              {"Loved the customization options. We could add all our event details and even got a preview before ordering. Highly recommended!"}
            </p>
            <div className="flex items-center">
              <div className="mr-3 h-10 w-10 rounded-full bg-slate-300"></div>
              <div>
                <p className="font-semibold">Partosh singh</p>
                <p className="text-sm text-slate-500">Gavandri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}