import { InputProps } from "@/types/listProps";

export default function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div className="mt-4 mb-4">
      <label className="block text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />
    </div>
  );
}