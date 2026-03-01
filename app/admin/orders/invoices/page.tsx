import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Manage and print invoices for orders",
};

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
              <p className="text-sm text-gray-600">
                Generate and manage invoices for customer orders
              </p>
            </div>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Generate Invoice
            </button>
          </div>

          {/* Invoice List */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="p-4 text-center text-gray-600">
              <p>Invoice management system coming soon.</p>
              <p className="mt-1 text-sm">
                This page will allow you to generate, download, and email invoices for orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}