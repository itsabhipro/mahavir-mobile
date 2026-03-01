"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ConfirmationAlertProps {
  orderNumber: string;
  onClose: () => void;
}

export default function ConfirmationAlert({ orderNumber, onClose }: ConfirmationAlertProps) {
  // Auto-close after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-purple-50 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-pink-200/30" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-200/30" />
          
          {/* Header */}
          <div className="relative border-b border-pink-100 bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-center text-white">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="mb-2 text-3xl font-bold">Order Confirmed!</h2>
            <p className="text-lg opacity-90">
              Your wedding card order has been successfully placed
            </p>
          </div>

          {/* Content */}
          <div className="relative p-8">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
                <div className="text-4xl">✅</div>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Thank You for Your Order!
              </h3>
              <p className="text-gray-600">
                We have received your order and will start processing it immediately.
              </p>
            </div>

            {/* Order Details */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Order Details</h4>
                <span className="rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-700">
                  #{orderNumber}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-mono font-semibold text-gray-900">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      Processing
                    </span>
                  </div>
                </div>
                
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 text-sm font-medium text-gray-900">What happens next?</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5">1.</span>
                      <span>We will ll confirm your order within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5">2.</span>
                      <span>Your cards will be designed and printed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5">3.</span>
                      <span>You will ll receive tracking information once shipped</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-pink-600 bg-white px-6 py-3 font-semibold text-pink-600 hover:bg-pink-50"
              >
                Continue Shopping
              </button>
              
              <Link
                href="/customer/orders"
                className="flex-1 rounded-xl bg-pink-600 px-6 py-3 text-center font-semibold text-white hover:bg-pink-700"
                onClick={onClose}
              >
                View My Orders
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a href="mailto:support@mahavirmobile.com" className="font-semibold text-pink-600 hover:underline">
                  Contact our support team
                </a>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              This window will close automatically in a few seconds...
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}