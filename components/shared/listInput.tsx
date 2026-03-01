import { ListInputProps } from "@/types/listProps";

export default function ListInput({ label, values, onChange }: ListInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm">{label}</label>
      {values.map((v: string, i: number) => (
        <input
          key={i}
          value={v}
          onChange={(e) => {
            const copy = [...values];
            copy[i] = e.target.value;
            onChange(copy);
          }}
          className="mb-2 w-full rounded border px-3 py-2"
        />
      ))}
      <button
        onClick={() => onChange([...values, ""])}
        className="mt-2 text-sm text-indigo-600"
      >
        + Add
      </button>
    </div>
  );
}