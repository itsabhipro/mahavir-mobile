import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "Completed Orders",
  description: "View completed and delivered orders",
};

export default function CompletedOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="Completed Orders" 
          defaultStatus="delivered"
          showFilters={false}
        />
      </div>
    </div>
  );
}