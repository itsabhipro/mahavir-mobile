import { Metadata } from "next/types";
import { Geist, Geist_Mono } from "next/font/google";
import CustomerNavigation from "@/components/customer/CustomerNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Customer Portal - Mahavir Mobile & Printing Press",
  description: "Manage your orders, addresses, and profile",
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-pink-50 to-white`}
    >
      <CustomerNavigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}