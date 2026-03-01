import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "New Orders",
  description: "Manage new customer orders",
};

export default function NewOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="New Orders" 
          defaultStatus="pending"
          showFilters={false}
        />
      </div>
    </div>
  );
}