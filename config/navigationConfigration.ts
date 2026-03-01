import { NavItem } from "@/types/navigation";

export const shopkeeperNavigation: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: "dashboard" },

  {
    title: "Orders",
    url: "/admin/orders",
    icon: "orders",
    children: [
      { title: "All Orders", url: "/admin/orders/all" },
      { title: "New Orders", url: "/admin/orders/new" },
      { title: "In Process", url: "/admin/orders/in-process" },
      { title: "Completed", url: "/admin/orders/completed" },
      { title: "Cancelled", url: "/admin/orders/cancelled" },
      { title: "Payments", url: "/admin/orders/payments" },
      { title: "Invoices", url: "/admin/orders/invoices" },
    ],
  },

  {
    title: "Enquiries",
    url: "/admin/enquiries",
    icon: "enquiry",
    children: [
      { title: "All Enquiries", url: "/admin/enquiries/all" },
      { title: "New / Unread", url: "/admin/enquiries/new" },
      { title: "Follow-up", url: "/admin/enquiries/follow-up" },
      { title: "Closed", url: "/admin/enquiries/closed" },
    ],
  },

  {
    title: "Documents",
    url: "/admin/documents",
    icon: "documents",
    children: [
      { title: "Upload Document", url: "/admin/documents/upload" },
      { title: "All Documents", url: "/admin/documents/all" },
      { title: "Customer Documents", url: "/admin/documents/customers" },
      { title: "CSC Documents", url: "/admin/documents/csc" },
      { title: "Printing Files", url: "/admin/documents/printing" },
    ],
  },

  {
    title: "Services",
    url: "/admin/services",
    icon: "services",
    children: [
      {
        title: "Printing Press",
        url: "/admin/services/printing-press",
        children: [
          { title: "Add Product/Service", url: "/admin/services/printing-press/add" },
          { title: "Manage Items", url: "/admin/services/printing-press/items" },
          { title: "Price List", url: "/admin/services/printing-press/prices" },
          { title: "Design/Templates", url: "/admin/services/printing-press/card-types" },
          { title: "Cards", url: "/admin/services/printing-press/cards" },
          { title: "Banners", url: "/admin/services/printing-press/banners" },
          { title: "Brochure / Pamphlet", url: "/admin/services/printing-press/brochure" },
        ],
      },
      {
        title: "CSC",
        url: "/admin/services/csc",
        children: [
          { title: "Create Request", url: "/admin/services/csc/create" },
          { title: "All Requests", url: "/admin/services/csc/requests" },
          { title: "Pending", url: "/admin/services/csc/pending" },
          { title: "Completed", url: "/admin/services/csc/completed" },
          { title: "Service Catalog", url: "/admin/services/csc/catalog" },
        ],
      },
      {
        title: "Booking",
        url: "/admin/services/booking",
        children: [
          { title: "New Booking", url: "/admin/services/booking/new" },
          { title: "All Bookings", url: "/admin/services/booking/all" },
          { title: "Pending", url: "/admin/services/booking/pending" },
          { title: "Confirmed", url: "/admin/services/booking/confirmed" },
          { title: "Completed", url: "/admin/services/booking/completed" },
          { title: "Vehicle Booking", url: "/admin/services/booking/vehicles" },
          { title: "Food / Catering", url: "/admin/services/booking/food" },
          { title: "Camera / Photography", url: "/admin/services/booking/camera" },
          { title: "Pandal Booking", url: "/admin/services/booking/pandal" },
        ],
      },
    ],
  },

  {
    title: "Customers",
    url: "/admin/customers",
    icon: "customers",
    children: [
      { title: "All Customers", url: "/admin/customers/all" },
      { title: "Add Customer", url: "/admin/customers/add" },
    ],
  },

  {
    title: "Reports",
    url: "/admin/reports",
    icon: "reports",
    children: [
      { title: "Sales Report", url: "/admin/reports/sales" },
      { title: "Order Report", url: "/admin/reports/orders" },
      { title: "Booking Report", url: "/admin/reports/bookings" },
      { title: "CSC Report", url: "/admin/reports/csc" },
    ],
  },

  {
    title: "Settings",
    url: "/admin/settings",
    icon: "settings",
    children: [
      { title: "Shop Profile", url: "/admin/settings/shop-profile" },
      { title: "Business Hours", url: "/admin/settings/hours" },
      { title: "Users & Roles", url: "/admin/settings/users" },
      { title: "Payment Settings", url: "/admin/settings/payments" },
    ],
  },
];

// Customer navigation for logged-in users
export const customerNavigation: NavItem[] = [
  { title: "Dashboard", url: "/customer", icon: "dashboard" },
  { title: "My Orders", url: "/customer/orders", icon: "orders" },
  { title: "Addresses", url: "/customer/addresses", icon: "address" },
  { title: "Profile", url: "/customer/profile", icon: "profile" },
  { title: "Work", url: "/customer/work", icon: "work" },
  { title: "Logout", url: "/auth/logout", icon: "logout" },
];
