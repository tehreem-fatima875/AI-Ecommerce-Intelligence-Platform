export type AnalyticsData = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalProducts: number;

  revenueData: {
    month: string;
    revenue: number;
  }[];

  bestSellingProduct: {
    product: string;
    sales: number;
  } | null;

  productPerformance: {
    product: string;
    sales: number;
    stock: number;
  }[];

  customerBehavior: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    loyalCustomers: number;
    averageCustomerSpend: number;
    highValueCustomers: number;
  };

  customerSegments: {
    New: number;
    Returning: number;
    Loyal: number;
  };

  lowStockProducts: {
    product: string;
    stock: number;
  }[];

 recommendations: {
  type: string;
  priority: "High" | "Medium" | "Low";
  title: string;
  message: string;
  action: string;
}[];
};

export type ProductRecord = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  sales?: number;
};

export type CustomerRecord = {
  _id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  segment: "New" | "Returning" | "Loyal";
  lastOrderDate?: string | null;
};

const API_URL = "/api";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return getJson<AnalyticsData>("/analytics");
}

export function getProducts(): Promise<ProductRecord[]> { return getJson<ProductRecord[]>("/products"); }
export function getCustomers(): Promise<CustomerRecord[]> { return getJson<CustomerRecord[]>("/customers"); }
