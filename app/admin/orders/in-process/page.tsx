import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "In Process Orders",
  description: "Manage orders in processing, printing, and ready for delivery",
};

export default function InProcessOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="In Process Orders" 
          defaultStatus="processing"
          showFilters={false}
        />
      </div>
    </div>
  );
}