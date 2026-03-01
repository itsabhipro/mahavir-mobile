"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Input from "@/components/shared/input";
import ListInput from "@/components/shared/listInput";
import { OrderFormData, OrderStep, CardType, Address } from "@/types/order";
import ConfirmationAlert from "@/components/shared/ConfirmationAlert";

const STEPS: { id: OrderStep; title: string; description: string }[] = [
  { id: "select-card", title: "Select Card", description: "Choose your wedding card design and quantity" },
  { id: "person-details", title: "Bride & Groom", description: "Enter details of the bride and groom" },
  { id: "event-details", title: "Event Details", description: "Add wedding event information" },
  { id: "card-details", title: "Card Details", description: "Customize card messages and content" },
  { id: "arranger-details", title: "Arranger Details", description: "Add arranger information" },
  { id: "address", title: "Delivery Address", description: "Enter delivery address" },
  { id: "review", title: "Review & Payment", description: "Review your order and select payment method" },
];

const INITIAL_FORM: OrderFormData = {
  // Step 1
  card_type_id: null,
  quantity: 1,
  
  // Step 2
  persons: [
    { person_type: "Bride", name: "", father_name: "", mother_name: "", address: "", profession_name: "" },
    { person_type: "Groom", name: "", father_name: "", mother_name: "", address: "", profession_name: "" },
  ],
  
  // Step 3
  events: [{ event_name: "", event_date: "", event_location: "" }],
  
  // Step 4
  children_message: "",
  welcomers: [""],
  aspirations: [""],
  
  // Step 5
  arrangers: [{ name: "", mobile_number: "", address: "", profession_name: "" }],
  
  // Step 6
  shipping_address: {
    full_name: "",
    mobile_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  },
  use_saved_address: false,
  save_address: false,
  
  // Step 7
  payment_method: "cash_on_delivery",
};

export default function OrderForm() {
  const [currentStep, setCurrentStep] = useState<OrderStep>("select-card");
  const [form, setForm] = useState<OrderFormData>(INITIAL_FORM);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  
  const supabase = createClient();

  // Load card types and saved addresses
  useEffect(() => {
    loadCardTypes();
    loadSavedAddresses();
  }, []);

  const loadCardTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("marriage_card_type_details")
        .select("*")
        .gt("available_stock", 0)
        .order("price", { ascending: true });
      
      if (error) throw error;
      setCardTypes(data || []);
    } catch (error) {
      console.error("Error loading card types:", error);
    }
  };

  const loadSavedAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
      
      if (error) throw error;
      setSavedAddresses(data || []);
    } catch (error) {
      console.error("Error loading saved addresses:", error);
    }
  };

  const handleNext = () => {
    const stepIndex = STEPS.findIndex(s => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = STEPS.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Calculate amounts
      const selectedCard = cardTypes.find(c => c.id === form.card_type_id);
      if (!selectedCard) throw new Error("Please select a card type");
      
      const unitPrice = selectedCard.price;
      const totalAmount = unitPrice * form.quantity;
      const finalAmount = totalAmount; // Add tax/discount logic here
      
      // Prepare order data
      const orderData = {
        user_id: user?.id || null,
        guest_email: user?.email || null,
        guest_name: user?.email ? null : form.shipping_address.full_name,
        guest_mobile: user?.email ? null : form.shipping_address.mobile_number,
        card_type_id: form.card_type_id,
        quantity: form.quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        final_amount: finalAmount,
        shipping_full_name: form.shipping_address.full_name,
        shipping_mobile: form.shipping_address.mobile_number,
        shipping_address_line1: form.shipping_address.address_line1,
        shipping_address_line2: form.shipping_address.address_line2,
        shipping_city: form.shipping_address.city,
        shipping_state: form.shipping_address.state,
        shipping_pincode: form.shipping_address.pincode,
        shipping_country: form.shipping_address.country,
        payment_method: form.payment_method,
        notes: form.notes,
      };
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create card details
      const { error: cardError } = await supabase
        .from("marriage_card_details")
        .insert({
          card_type_id: form.card_type_id,
          children_message: form.children_message,
          welcomers: form.welcomers,
          aspirations: form.aspirations,
        });
      
      if (cardError) throw cardError;
      
      // Save address if requested
      if (form.save_address && user) {
        const { error: addressError } = await supabase
          .from("user_addresses")
          .insert({
            user_id: user.id,
            ...form.shipping_address,
            is_default: savedAddresses.length === 0,
          });
        
        if (addressError) console.error("Error saving address:", addressError);
      }
      
      setOrderNumber(order.order_number);
      setShowConfirmation(true);
      
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updates: Partial<OrderFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updatePerson = (index: number, field: string, value: string) => {
    const updatedPersons = [...form.persons];
    updatedPersons[index] = { ...updatedPersons[index], [field]: value };
    updateForm({ persons: updatedPersons });
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const updatedEvents = [...form.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    updateForm({ events: updatedEvents });
  };

  const updateArranger = (index: number, field: string, value: string) => {
    const updatedArrangers = [...form.arrangers];
    updatedArrangers[index] = { ...updatedArrangers[index], [field]: value };
    updateForm({ arrangers: updatedArrangers });
  };

  const updateAddress = (field: string, value: string | boolean) => {
    updateForm({ 
      shipping_address: { ...form.shipping_address, [field]: value } 
    });
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "select-card":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Wedding Card</h2>
            <p className="text-gray-600">Select from our beautiful collection of wedding cards</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cardTypes.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    form.card_type_id === card.id 
                      ? "border-pink-500 bg-pink-50" 
                      : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                  }`}
                  onClick={() => updateForm({ card_type_id: card.id })}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{card.name}</h3>
                      <p className="text-sm text-gray-600">{card.card_type} • {card.size} • {card.gsm} GSM</p>
                    </div>
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                      ₹{card.price}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Order:</span>
                      <span className="font-medium">{card.minimum_order_quantity} cards</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Stock:</span>
                      <span className="font-medium text-green-600">{card.available_stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {form.card_type_id && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Select Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => form.quantity > 1 && updateForm({ quantity: form.quantity - 1 })}
                    className="h-10 w-10 rounded-full border border-gray-300 text-xl disabled:opacity-50"
                    disabled={form.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{form.quantity}</span>
                  <button
                    onClick={() => updateForm({ quantity: form.quantity + 1 })}
                    className="h-10 w-10 rounded-full border border-gray-300 text-xl"
                  >
                    +
                  </button>
                  <div className="ml-6">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{(() => {
                        const card = cardTypes.find(c => c.id === form.card_type_id);
                        return card ? card.price * form.quantity : 0;
                      })().toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "person-details":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Bride & Groom Details</h2>
            <p className="text-gray-600">Enter details for the bride and groom</p>
            
            <div className="grid gap-6 md:grid-cols-2">
              {form.persons.map((person, index) => (
                <div key={person.person_type} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">{person.person_type} Details</h3>
                  
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={person.name}
                      onChange={(value) => updatePerson(index, "name", value)}
                    />
                    <Input
                      label="Father's Name"
                      value={person.father_name}
                      onChange={(value) => updatePerson(index, "father_name", value)}
                    />
                    <Input
                      label="Mother's Name"
                      value={person.mother_name}
                      onChange={(value) => updatePerson(index, "mother_name", value)}
                    />
                    <Input
                      label="Address"
                      value={person.address}
                      onChange={(value) => updatePerson(index, "address", value)}
                    />
                    <Input
                      label="Profession"
                      value={person.profession_name}
                      onChange={(value) => updatePerson(index, "profession_name", value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "event-details":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
            <p className="text-gray-600">Add wedding event information</p>
            
            {form.events.map((event, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Event {index + 1}</h3>
                
                <div className="space-y-4">
                  <Input
                    label="Event Name (e.g., Wedding Ceremony, Reception)"
                    value={event.event_name}
                    onChange={(value) => updateEvent(index, "event_name", value)}
                  />
                  <Input
                    label="Event Date"
                    type="date"
                    value={event.event_date}
                    onChange={(value) => updateEvent(index, "event_date", value)}
                  />
                  <Input
                    label="Event Location"
                    value={event.event_location}
                    onChange={(value) => updateEvent(index, "event_location", value)}
                  />
                </div>
              </div>
            ))}
            
            <button
              onClick={() => updateForm({ 
                events: [...form.events, { event_name: "", event_date: "", event_location: "" }] 
              })}
              className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-4 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
            >
              + Add Another Event
            </button>
          </div>
        );

      case "card-details":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Card Details</h2>
            <p className="text-gray-600">Customize your card messages</p>
            
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <Input
                label="Children's Message"
                value={form.children_message}
                onChange={(value) => updateForm({ children_message: value })}
              />
              
              <div className="mt-6">
                <ListInput
                  label="Welcomers (People welcoming guests)"
                  values={form.welcomers}
                  onChange={(values) => updateForm({ welcomers: values })}
                />
              </div>
              
              <div className="mt-6">
                <ListInput
                  label="Aspirations (Good wishes for the couple)"
                  values={form.aspirations}
                  onChange={(values) => updateForm({ aspirations: values })}
                />
              </div>
            </div>
          </div>
        );

      case "arranger-details":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Arranger Details</h2>
            <p className="text-gray-600">Add arranger information</p>
            
            {form.arrangers.map((arranger, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Arranger {index + 1}</h3>
                
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={arranger.name}
                    onChange={(value) => updateArranger(index, "name", value)}
                  />
                  <Input
                    label="Mobile Number"
                    value={arranger.mobile_number}
                    onChange={(value) => updateArranger(index, "mobile_number", value)}
                  />
                  <Input
                    label="Address"
                    value={arranger.address}
                    onChange={(value) => updateArranger(index, "address", value)}
                  />
                  <Input
                    label="Profession"
                    value={arranger.profession_name}
                    onChange={(value) => updateArranger(index, "profession_name", value)}
                  />
                </div>
              </div>
            ))}
            
            <button
              onClick={() => updateForm({ 
                arrangers: [...form.arrangers, { name: "", mobile_number: "", address: "", profession_name: "" }] 
              })}
              className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-4 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
            >
              + Add Another Arranger
            </button>
          </div>
        );

      case "address":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
            <p className="text-gray-600">Where should we deliver your cards?</p>
            
            {savedAddresses.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Saved Addresses</h3>
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`rounded-xl border-2 p-4 cursor-pointer ${
                        form.use_saved_address && form.shipping_address.full_name === address.full_name
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        updateForm({ 
                          shipping_address: address,
                          use_saved_address: true 
                        });
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{address.full_name}</p>
                          <p className="text-sm text-gray-600">{address.mobile_number}</p>
                          <p className="mt-1 text-sm">
                            {address.address_line1}, {address.address_line2}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        {address.is_default && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="useSaved"
                    checked={form.use_saved_address}
                    onChange={(e) => updateForm({ use_saved_address: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="useSaved" className="ml-2 text-sm text-gray-700">
                    Use selected saved address
                  </label>
                </div>
              </div>
            )}
            
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">
                {form.use_saved_address ? "Edit Address" : "Enter New Address"}
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full Name"
                  value={form.shipping_address.full_name}
                  onChange={(value) => updateAddress("full_name", value)}
                />
                <Input
                  label="Mobile Number"
                  value={form.shipping_address.mobile_number}
                  onChange={(value) => updateAddress("mobile_number", value)}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address Line 1"
                    value={form.shipping_address.address_line1}
                    onChange={(value) => updateAddress("address_line1", value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Address Line 2 (Optional)"
                    value={form.shipping_address.address_line2 || ""}
                    onChange={(value) => updateAddress("address_line2", value)}
                  />
                </div>
                <Input
                  label="City"
                  value={form.shipping_address.city}
                  onChange={(value) => updateAddress("city", value)}
                />
                <Input
                  label="State"
                  value={form.shipping_address.state}
                  onChange={(value) => updateAddress("state", value)}
                />
                <Input
                  label="Pincode"
                  value={form.shipping_address.pincode}
                  onChange={(value) => updateAddress("pincode", value)}
                />
                <Input
                  label="Country"
                  value={form.shipping_address.country}
                  onChange={(value) => updateAddress("country", value)}
                />
              </div>
              
              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={form.save_address}
                  onChange={(e) => updateForm({ save_address: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
            <p className="text-gray-600">Check all details before placing your order</p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Order Summary</h3>
                  
                  {form.card_type_id && (() => {
                    const card = cardTypes.find(c => c.id === form.card_type_id);
                    if (!card) return null;
                    
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card Type:</span>
                          <span className="font-medium">{card.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{form.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="font-medium">₹{card.price}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-2xl font-bold text-pink-600">
                            ₹{(card.price * form.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Payment Method</h3>
                  
                  <div className="space-y-3">
                    {[
                      { id: "cash_on_delivery", label: "Cash on Delivery", desc: "Pay when you receive the cards" },
                      { id: "online_payment", label: "Online Payment", desc: "Pay securely online" },
                      { id: "bank_transfer", label: "Bank Transfer", desc: "Transfer to our bank account" },
                      { id: "upi", label: "UPI Payment", desc: "Pay using UPI apps" },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`rounded-xl border-2 p-4 cursor-pointer ${
                          form.payment_method === method.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => updateForm({ payment_method: method.id as  "cash_on_delivery" | "online_payment" | "bank_transfer" | "upi" })}
                      >
                        <div className="flex items-center">
                          <div className={`h-5 w-5 rounded-full border-2 ${
                            form.payment_method === method.id
                              ? "border-pink-500 bg-pink-500"
                              : "border-gray-300"
                          }`}>
                            {form.payment_method === method.id && (
                              <div className="m-0.5 h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-gray-600">{method.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Delivery Address</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{form.shipping_address.full_name}</p>
                    <p className="text-sm text-gray-600">{form.shipping_address.mobile_number}</p>
                    <p className="mt-1 text-sm">
                      {form.shipping_address.address_line1}
                      {form.shipping_address.address_line2 && (
                        <>, {form.shipping_address.address_line2}</>
                      )}
                      <br />
                      {form.shipping_address.city}, {form.shipping_address.state} - {form.shipping_address.pincode}
                      <br />
                      {form.shipping_address.country}
                    </p>
                  </div>
                </div>
                
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Additional Notes</h3>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 p-3"
                    rows={3}
                    placeholder="Any special instructions for your order..."
                    value={form.notes || ""}
                    onChange={(e) => updateForm({ notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case "select-card":
        return form.card_type_id !== null && form.quantity > 0;
      case "person-details":
        return form.persons.every(p => p.name && p.father_name && p.mother_name);
      case "address":
        return form.shipping_address.full_name && 
               form.shipping_address.mobile_number && 
               form.shipping_address.address_line1 && 
               form.shipping_address.city && 
               form.shipping_address.state && 
               form.shipping_address.pincode;
      default:
        return true;
    }
  };

  const stepIndex = STEPS.findIndex(s => s.id === currentStep);
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3"
              onClick={() => setCurrentStep(step.id)}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                stepIndex >= index
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {index + 1}
              </div>
              <div className="hidden md:block">
                <p className={`font-medium ${
                  stepIndex >= index ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.title}
                </p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 ${
                  stepIndex > index ? "bg-pink-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium disabled:opacity-50 hover:bg-gray-50"
        >
          Back
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <p className="font-medium text-gray-900">{STEPS[stepIndex].title}</p>
        </div>
        
        <button
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={!isStepValid() || loading}
          className="rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white disabled:opacity-50 hover:bg-pink-700"
        >
          {loading ? "Processing..." : isLastStep ? "Place Order" : "Next"}
        </button>
      </div>

      {/* Confirmation Alert */}
      {showConfirmation && (
        <ConfirmationAlert
          orderNumber={orderNumber}
          onClose={() => {
            setShowConfirmation(false);
            // Reset form for new order
            setForm(INITIAL_FORM);
            setCurrentStep("select-card");
          }}
        />
      )}
    </div>
  );
}