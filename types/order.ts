export type CardType = {
  id: number;
  name: string;
  card_type: 'Normal' | 'VIP' | 'VVIP';
  size: string;
  gsm: string;
  price: number;
  available_stock: number;
  max_stock: number;
  minimum_order_quantity: number;
  image_url?: string;
};

export type Address = {
  id?: number;
  full_name: string;
  mobile_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
};

export type OrderFormData = {
  // Step 1: Card Selection
  card_type_id: number | null;
  quantity: number;
  
  // Step 2: Person Details
  persons: {
    person_type: 'Bride' | 'Groom' | 'Janew';
    name: string;
    father_name: string;
    mother_name: string;
    address: string;
    profession_name: string;
  }[];
  
  // Step 3: Event Details
  events: {
    event_name: string;
    event_date: string;
    event_location: string;
  }[];
  
  // Step 4: Card Details
  children_message: string;
  welcomers: string[];
  aspirations: string[];
  
  // Step 5: Arranger Details
  arrangers: {
    name: string;
    mobile_number: string;
    address: string;
    profession_name: string;
  }[];
  
  // Step 6: Address
  shipping_address: Address;
  use_saved_address: boolean;
  save_address: boolean;
  
  // Step 7: Payment & Review
  payment_method: 'cash_on_delivery' | 'online_payment' | 'bank_transfer' | 'upi';
  notes?: string;
};

export type OrderStep = 
  | 'select-card' 
  | 'person-details' 
  | 'event-details' 
  | 'card-details' 
  | 'arranger-details' 
  | 'address' 
  | 'review' 
  | 'confirmation';