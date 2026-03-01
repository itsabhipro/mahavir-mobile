import { useState } from "react";
import { FormData } from "@/types/types";

export default function useForm() {
    return useState<FormData>({
    card_type_id: "",
    children_message: "",
    welcomers: [""],
    aspirations: [""],
    persons: [
      { person_type: "Bride", name: "", father_name: "", mother_name: "" },
      { person_type: "Groom", name: "", father_name: "", mother_name: "" },
    ],
    events: [{ event_name: "", event_date: "", event_location: "" }],
    arrangers: [{ name: "", mobile_number: "" }],
  });
}