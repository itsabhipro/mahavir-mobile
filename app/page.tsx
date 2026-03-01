import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo.jpg"
              alt="Mahavir Mobile and Printing Press Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-slate-900">Mahavir Mobile and Printing Press</h1>
              <p className="text-sm text-slate-600">Quality Printing Services Since 1995</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="font-medium text-slate-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/customer/order/new"
              className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Order Now
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-slate-900 md:text-6xl">
            Professional Printing Services
            <span className="block text-blue-600">For All Your Needs</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Welcome to Mahavir Mobile and Printing Press – your trusted partner for high-quality wedding cards,
            business cards, brochures, and more. Combining traditional craftsmanship with modern technology.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/customer/order/new"
              className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-semibold text-white hover:bg-blue-700"
            >
              Order Custom Cards →
            </Link>
            <Link
              href="#about"
              className="rounded-xl border-2 border-blue-600 px-10 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50"
            >
              Learn About Us
            </Link>
          </div>
        </div>

        {/* Business Information */}
        <div id="about" className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-slate-900">About Our Business</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Our Story</h3>
              <p className="mb-4 text-slate-700">
                Founded in 2009, Mahavir Mobile and Printing Press has been serving the community with
                exceptional printing services. We started as a small mobile unit and have grown into a
                full-service printing press with state-of-the-art equipment.
              </p>
              <p className="text-slate-700">
                Our commitment to quality, attention to detail, and customer satisfaction has made us the
                preferred choice for wedding cards, business stationery, and promotional materials.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-3 text-blue-600">✓</span>
                  <span className="text-slate-700">17+ years of printing experience</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-blue-600">✓</span>
                  <span className="text-slate-700">Modern digital and offset printing</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-blue-600">✓</span>
                  <span className="text-slate-700">Custom designs and templates</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-blue-600">✓</span>
                  <span className="text-slate-700">Fast turnaround and delivery</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3 text-blue-600">✓</span>
                  <span className="text-slate-700">Competitive pricing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-slate-900">For Our Guests</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Welcome Guests</h3>
              <p className="text-slate-700">
                Whether you are planning a wedding, launching a business, or organizing an event, we are here
                to help you create beautiful printed materials that make a lasting impression.
              </p>
            </div>
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Easy Ordering</h3>
              <p className="text-slate-700">
                Our online ordering system makes it simple to design and order custom cards. No technical
                skills needed – just follow our step-by-step process.
              </p>
            </div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-8 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">Support</h3>
              <p className="text-slate-700">
                Have questions? Our customer support team is available to assist you with design choices,
                order status, and any other inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Card Ordering Section */}
        <div className="mb-16 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">Ready to Order Your Cards?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg opacity-95 sm:mb-8 sm:text-xl">
            Create beautiful wedding cards, business cards, or invitation cards with our easy-to-use designer.
            Choose from templates, customize details, and get them delivered to your doorstep.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/customer/order/new"
              className="transform rounded-xl bg-white px-6 py-3 text-lg font-bold text-blue-600 shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl sm:px-10 sm:py-4"
            >
              Start Designing Now →
            </Link>
            <Link
              href="/auth/register"
              className="transform rounded-xl border-2 border-white bg-transparent px-6 py-3 text-lg font-bold transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl sm:px-10 sm:py-4"
            >
              Create Account
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80 sm:mt-8">
            No account needed to order! Create account to save addresses and track orders.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 sm:mb-10 sm:text-4xl">How to Order</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 shadow-md sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                1
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Choose Card Type</h3>
              <p className="text-sm text-slate-600 sm:text-base">Select wedding, business, or invitation cards</p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600 shadow-md sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                2
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Customize Design</h3>
              <p className="text-sm text-slate-600 sm:text-base">Add text, images, and choose colors</p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600 shadow-md sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                3
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Enter Details</h3>
              <p className="text-sm text-slate-600 sm:text-base">Provide event info and delivery address</p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600 shadow-md sm:mb-6 sm:h-16 sm:w-16 sm:text-2xl">
                4
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">Confirm & Pay</h3>
              <p className="text-sm text-slate-600 sm:text-base">Review order and complete payment</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">Our Impact in Numbers</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg opacity-90 sm:text-xl">
            Trusted by thousands of customers for their most important occasions
          </p>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-blue-400 sm:text-5xl">17+</div>
              <p className="text-sm font-medium opacity-90 sm:text-base">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-green-400 sm:text-5xl">5,000+</div>
              <p className="text-sm font-medium opacity-90 sm:text-base">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-purple-400 sm:text-5xl">500,000+</div>
              <p className="text-sm font-medium opacity-90 sm:text-base">Cards Printed</p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-4xl font-bold text-orange-400 sm:text-5xl">24/7</div>
              <p className="text-sm font-medium opacity-90 sm:text-base">Customer Support</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900 sm:mb-10 sm:text-4xl">Customer Experiences</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">⭐</div>
                <div>
                  <p className="font-bold text-slate-900">Narendra mishra</p>
                  <p className="text-sm text-slate-600">Wedding Client, Gavandri</p>
                </div>
              </div>
              <p className="text-slate-700">
                {"The wedding cards we ordered were absolutely stunning! The quality was exceptional and delivery was right on time. Mahavir Printing made our special day even more memorable."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">⭐</div>
                <div>
                  <p className="font-bold text-slate-900">Rahul singh</p>
                  <p className="text-sm text-slate-600">Business Owner, Gavandri</p>
                </div>
              </div>
              <p className="text-slate-700">
                {"We've been using Mahavir for all our business printing needs for years. Their professional approach, quality work, and timely delivery keep us coming back. Highly recommended!"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">⭐</div>
                <div>
                  <p className="font-bold text-slate-900">Partosh singh</p>
                  <p className="text-sm text-slate-600">Event Planner, Gavandri</p>
                </div>
              </div>
              <p className="text-slate-700">
                {"As an event planner, I need reliable printing partners. Mahavir always delivers high-quality invitations on tight deadlines. Their custom design service is fantastic!"}
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-8 text-center shadow-lg sm:p-12">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:mb-6 sm:text-4xl">Start Your Printing Journey Today</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-700 sm:text-xl">
            Whether you need wedding cards, business stationery, or promotional materials, we are here to bring your vision to life with quality and care.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/customer/order/new"
              className="transform rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
            >
              Order Now - Get Started
            </Link>
            <Link
              href="/auth/login"
              className="transform rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:-translate-y-1 hover:bg-blue-50"
            >
              Existing Customer? Login
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Questions? Call us at <strong>+91 6204310061</strong> or email <strong>info@mahavirprinting.com</strong>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-slate-50 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3">
                <Image
                  src="/brand/logo.jpg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mahavir Mobile and Printing Press</h3>
                  <p className="text-sm text-slate-600">Quality Printing Since 2009</p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-700">© 2025 Mahavir Mobile and Printing Press. All rights reserved.</p>
              <p className="mt-2 text-sm text-slate-600">
                Contact: +91 6204310061 |Prop:Ranjan Mishra | info@mahavirprinting.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
