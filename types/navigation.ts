export type NavItem = {
  title: string;
  url?: string;        // optional for group
  icon?: string;       // "dashboard", "orders"...
  isGroup?: boolean;   // optional
  children?: NavItem[];
};