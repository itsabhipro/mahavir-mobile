export interface Person {
  person_type: string;
  name: string;
  father_name: string;
  mother_name: string;
}

export interface Event {
  event_name: string;
  event_date: string;
  event_location: string;
}

export interface Arranger {
  name: string;
  mobile_number: string;
}

export interface FormData {
  card_type_id: string;
  children_message: string;
  welcomers: string[];
  aspirations: string[];
  persons: Person[];
  events: Event[];
  arrangers: Arranger[];
}