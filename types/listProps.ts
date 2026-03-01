export interface ListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}
export interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}