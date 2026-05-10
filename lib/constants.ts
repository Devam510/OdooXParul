export const ACTIVITY_CATEGORIES = [
  { value: "ADVENTURE", label: "Adventure", icon: "🏔️" },
  { value: "SIGHTSEEING", label: "Sightseeing", icon: "🗺️" },
  { value: "NIGHTLIFE", label: "Nightlife", icon: "🌃" },
  { value: "FOOD", label: "Food & Dining", icon: "🍜" },
  { value: "CULTURE", label: "Culture", icon: "🏛️" },
  { value: "SHOPPING", label: "Shopping", icon: "🛍️" },
] as const;

export const TRIP_STATUS = [
  { value: "PLANNING", label: "Planning", color: "bg-blue-100 text-blue-700" },
  { value: "ONGOING", label: "Ongoing", color: "bg-green-100 text-green-700" },
  { value: "COMPLETED", label: "Completed", color: "bg-gray-100 text-gray-700" },
  { value: "ARCHIVED", label: "Archived", color: "bg-yellow-100 text-yellow-700" },
] as const;

export const EXPENSE_CATEGORIES = [
  { value: "HOTEL", label: "Hotel", icon: "🏨" },
  { value: "TRANSPORT", label: "Transport", icon: "✈️" },
  { value: "FOOD", label: "Food", icon: "🍔" },
  { value: "ACTIVITIES", label: "Activities", icon: "🎯" },
  { value: "MISCELLANEOUS", label: "Miscellaneous", icon: "💼" },
] as const;

export const PACKING_CATEGORIES = [
  { value: "CLOTHING", label: "Clothing", icon: "👕" },
  { value: "ELECTRONICS", label: "Electronics", icon: "📱" },
  { value: "ESSENTIALS", label: "Essentials", icon: "🧴" },
  { value: "DOCUMENTS", label: "Documents", icon: "📄" },
  { value: "TOILETRIES", label: "Toiletries", icon: "🪥" },
  { value: "MISCELLANEOUS", label: "Miscellaneous", icon: "🎒" },
] as const;

export const TRANSPORT_TYPES = [
  { value: "FLIGHT", label: "Flight", icon: "✈️" },
  { value: "TRAIN", label: "Train", icon: "🚆" },
  { value: "BUS", label: "Bus", icon: "🚌" },
  { value: "CAR", label: "Car", icon: "🚗" },
  { value: "SHIP", label: "Ship", icon: "🚢" },
  { value: "OTHER", label: "Other", icon: "🚶" },
] as const;

// Packing templates
export const PACKING_TEMPLATES = {
  BEACH: [
    { name: "Sunscreen", category: "ESSENTIALS", quantity: 2 },
    { name: "Sunglasses", category: "ESSENTIALS", quantity: 1 },
    { name: "Swimsuit", category: "CLOTHING", quantity: 2 },
    { name: "Beach towel", category: "ESSENTIALS", quantity: 1 },
    { name: "Flip flops", category: "CLOTHING", quantity: 1 },
    { name: "T-shirts", category: "CLOTHING", quantity: 4 },
    { name: "Shorts", category: "CLOTHING", quantity: 3 },
    { name: "Passport", category: "DOCUMENTS", quantity: 1 },
    { name: "Phone charger", category: "ELECTRONICS", quantity: 1 },
  ],
  BUSINESS: [
    { name: "Formal shirts", category: "CLOTHING", quantity: 3 },
    { name: "Formal trousers", category: "CLOTHING", quantity: 2 },
    { name: "Blazer", category: "CLOTHING", quantity: 1 },
    { name: "Laptop", category: "ELECTRONICS", quantity: 1 },
    { name: "Laptop charger", category: "ELECTRONICS", quantity: 1 },
    { name: "Business cards", category: "DOCUMENTS", quantity: 1 },
    { name: "Passport", category: "DOCUMENTS", quantity: 1 },
    { name: "Dress shoes", category: "CLOTHING", quantity: 1 },
    { name: "Notebook", category: "ESSENTIALS", quantity: 1 },
  ],
  ADVENTURE: [
    { name: "Hiking boots", category: "CLOTHING", quantity: 1 },
    { name: "Waterproof jacket", category: "CLOTHING", quantity: 1 },
    { name: "Trekking poles", category: "ESSENTIALS", quantity: 1 },
    { name: "First aid kit", category: "ESSENTIALS", quantity: 1 },
    { name: "Headlamp", category: "ELECTRONICS", quantity: 1 },
    { name: "Power bank", category: "ELECTRONICS", quantity: 1 },
    { name: "Water bottle", category: "ESSENTIALS", quantity: 2 },
    { name: "Quick-dry t-shirts", category: "CLOTHING", quantity: 4 },
    { name: "Passport", category: "DOCUMENTS", quantity: 1 },
  ],
  WINTER: [
    { name: "Winter coat", category: "CLOTHING", quantity: 1 },
    { name: "Thermal underwear", category: "CLOTHING", quantity: 3 },
    { name: "Woolen sweaters", category: "CLOTHING", quantity: 2 },
    { name: "Gloves", category: "CLOTHING", quantity: 1 },
    { name: "Scarf", category: "CLOTHING", quantity: 1 },
    { name: "Winter boots", category: "CLOTHING", quantity: 1 },
    { name: "Beanie", category: "CLOTHING", quantity: 1 },
    { name: "Lip balm", category: "TOILETRIES", quantity: 2 },
    { name: "Passport", category: "DOCUMENTS", quantity: 1 },
  ],
} as const;

export const COST_INDEX_LABELS: Record<number, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export const ITEMS_PER_PAGE = 12;
export const MAX_PACKING_ITEMS = 200;
export const MAX_TRIP_STOPS = 50;
