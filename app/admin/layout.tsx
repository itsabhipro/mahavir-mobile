import { Metadata } from "next/types";
import { Geist, Geist_Mono } from "next/font/google";
import AdminNavigation from "@/components/admin/adminNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin page",
  description: "Admin dashboard and management",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <section
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <AdminNavigation />
       <br />
        {children}
      </section>
    
  );
}