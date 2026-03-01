import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "Cancelled Orders",
  description: "View cancelled and refunded orders",
};

export default function CancelledOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="Cancelled Orders" 
          defaultStatus="cancelled"
          showFilters={false}
        />
      </div>
    </div>
  );
}