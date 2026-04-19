export type PropertyStatus = "For Sale" | "For Rent" | "Sold";

export const propertyTypes = [
  "Apartment",
  "House",
  "Commercial",
  "Land",
] as const;

export type PropertyType = (typeof propertyTypes)[number];

export const statusOptions: PropertyStatus[] = ["For Sale", "For Rent", "Sold"];

export const amenitiesList = [
  "Parking",
  "Pool",
  "Gym",
  "Balcony",
  "Garden",
  "Security",
  "Elevator",
  "Air Conditioning",
  "Pet Friendly",
  "Furnished",
  "Laundry",
  "WiFi",
] as const;

export interface Property {
  id: string;
  title: string;
  description?: string;
  address?: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  images: string[];
  amenities?: string[];
  dateListed?: string;
  agentId?: string;
  agentName?: string;
  agentPhoto?: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Loft in Downtown",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    price: 725000,
    status: "For Sale",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1280,
    featured: true,
    images: [img("1502672260266-1c1ef2d93688")],
  },
  {
    id: "2",
    title: "Suburban Family Home",
    city: "Plano",
    state: "TX",
    zipCode: "75024",
    price: 589000,
    status: "For Sale",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 2650,
    featured: true,
    images: [img("1564013799919-ab600027ffc6")],
  },
  {
    id: "3",
    title: "Waterfront Condo",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    price: 4200,
    status: "For Rent",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    featured: true,
    images: [img("1545324408-8061a3d193be")],
  },
  {
    id: "4",
    title: "Retail Corner Unit",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    price: 1250000,
    status: "For Sale",
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
    featured: false,
    images: [img("1486406146926-c627a92ad1ab")],
  },
  {
    id: "5",
    title: "Hilltop Land Parcel",
    city: "Scottsdale",
    state: "AZ",
    zipCode: "85262",
    price: 340000,
    status: "For Sale",
    type: "Land",
    bedrooms: 0,
    bathrooms: 0,
    area: 43560,
    featured: false,
    images: [img("1500382017468-9049fed7ef3f")],
  },
  {
    id: "6",
    title: "Cozy Townhouse",
    city: "Portland",
    state: "OR",
    zipCode: "97209",
    price: 515000,
    status: "Sold",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    featured: true,
    images: [img("1600585154340-be6161a56a0c")],
  },
  {
    id: "7",
    title: "Studio Near Campus",
    city: "Seattle",
    state: "WA",
    zipCode: "98105",
    price: 1895,
    status: "For Rent",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 540,
    featured: false,
    images: [img("1522708323594-d2aa45d44542")],
  },
  {
    id: "8",
    title: "Executive Office Suite",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    price: 890000,
    status: "For Sale",
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 3,
    area: 4100,
    featured: false,
    images: [img("1497366216548-37526070297c")],
  },
];
