import { FormData } from "@/types/types";

export function updateArray<T>(arr: T[], index: number, key: keyof T, value: string, field: keyof FormData, setForm: React.Dispatch<React.SetStateAction<FormData>>, form: FormData) {
    const copy = [...arr];
    copy[index] = { ...copy[index], [key]: value };
    setForm({ ...form, [field]: copy });
}

