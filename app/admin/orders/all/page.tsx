import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "All Orders",
  description: "View all customer orders",
};

export default function AllOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="All Orders" 
          showFilters={true}
        />
      </div>
    </div>
  );
}