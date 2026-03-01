import { Metadata } from "next";
import OrderForm from "@/components/customer/order/OrderForm";

export const metadata: Metadata = {
  title: "Design Your Wedding Card",
  description: "Create beautiful custom wedding cards in simple steps",
};

export default function NewOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <OrderForm />
      </div>
    </div>
  );
}