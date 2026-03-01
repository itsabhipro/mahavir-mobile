import { Metadata } from "next";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const metadata: Metadata = {
  title: "Payment Management",
  description: "Manage order payments and payment status",
};

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <OrdersClient 
          title="Payment Management" 
          defaultStatus="pending"
          statusFilter="payment"
          showFilters={false}
        />
      </div>
    </div>
  );
}