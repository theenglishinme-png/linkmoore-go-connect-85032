// Mock API endpoints - Backend implementation pending
// These functions define the API contract for future backend development

export interface User {
  id: string;
  name: string;
  email: string;
  role: "consumer" | "business" | "agent" | "admin" | "affiliate" | "promoter";
  phone?: string;
  roles?: Array<"affiliate" | "promoter" | "admin">; // Multi-role support
}

export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  phone: string;
  price?: string;
  image?: string;
  location?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export interface Order {
  id: string;
  businessId: string;
  userId: string;
  type: "call" | "order" | "service";
  status: "pending" | "completed" | "cancelled";
  amount?: number;
  createdAt: Date;
}

export interface Wallet {
  balance: number;
  cashback: number;
  referralEarnings: number;
}

export type OfferStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CommissionType = "PERCENTAGE" | "FIXED";

export interface Offer {
  id: string;
  name: string;
  description: string;
  url: string;
  status: OfferStatus;
  salesCount: number;
  epc: number; // Earnings Per Click
  conversionRate: number;
  launchDate: Date;
  promoterId: string;
  promoterName: string;
  vendorName: string;
  commission: {
    type: CommissionType;
    value: number; // percentage or fixed amount
  };
  category: string;
  thumbnailUrl?: string;
}

export interface AffiliateStats {
  totalEarnings: number;
  totalClicks: number;
  totalLeads: number;
  totalReferrals: number;
  pendingCommission: number;
  approvedCommission: number;
}

export interface Referral {
  id: string;
  affiliateId: string;
  offerId: string;
  offerName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  commission: number;
  clickDate: Date;
  conversionDate?: Date;
}

export interface Payout {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  requestDate: Date;
  completedDate?: Date;
  method: string;
}

export interface OfferEnrollment {
  id: string;
  affiliateId: string;
  offerId: string;
  enrolledDate: Date;
  status: "ACTIVE" | "INACTIVE";
}

// API Functions (to be implemented with actual backend)

export const api = {
  // User endpoints
  users: {
    register: async (data: Partial<User>): Promise<User> => {
      // POST /api/users/register
      return mockUser;
    },
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      // POST /api/users/login
      return { user: mockUser, token: "mock-token" };
    },
    getProfile: async (userId: string): Promise<User> => {
      // GET /api/users/:userId
      return mockUser;
    },
  },

  // Business endpoints
  businesses: {
    search: async (query: string, category?: string): Promise<Business[]> => {
      // GET /api/businesses/search?q=query&category=category
      return mockBusinesses;
    },
    getById: async (businessId: string): Promise<Business> => {
      // GET /api/businesses/:businessId
      return mockBusinesses[0];
    },
    register: async (data: Partial<Business>): Promise<Business> => {
      // POST /api/businesses/register
      return mockBusinesses[0];
    },
  },

  // Call routing endpoints
  calls: {
    initiate: async (businessId: string, userId: string): Promise<{ callId: string; twilioToken: string }> => {
      // POST /api/calls/initiate
      // Returns Twilio connection details
      return { callId: "mock-call-id", twilioToken: "mock-twilio-token" };
    },
    redirect: async (callId: string, agentId: string): Promise<void> => {
      // POST /api/calls/:callId/redirect
      // Redirect unanswered call to agent
    },
    complete: async (callId: string, summary: string): Promise<Order> => {
      // POST /api/calls/:callId/complete
      // Create order/ticket from call
      return mockOrders[0];
    },
  },

  // Order endpoints
  orders: {
    create: async (data: Partial<Order>): Promise<Order> => {
      // POST /api/orders
      return mockOrders[0];
    },
    getByUser: async (userId: string): Promise<Order[]> => {
      // GET /api/orders/user/:userId
      return mockOrders;
    },
    update: async (orderId: string, status: Order["status"]): Promise<Order> => {
      // PATCH /api/orders/:orderId
      return mockOrders[0];
    },
  },

  // Wallet endpoints
  wallet: {
    getBalance: async (userId: string): Promise<Wallet> => {
      // GET /api/wallet/:userId
      return { balance: 1250.50, cashback: 45.20, referralEarnings: 120.00 };
    },
    addFunds: async (userId: string, amount: number): Promise<Wallet> => {
      // POST /api/wallet/:userId/add
      return { balance: 1250.50 + amount, cashback: 45.20, referralEarnings: 120.00 };
    },
    cashOut: async (userId: string, amount: number): Promise<void> => {
      // POST /api/wallet/:userId/cashout
    },
  },

  // Referral endpoints
  referrals: {
    generateLink: async (userId: string, type: "general" | "product" | "service", itemId?: string): Promise<string> => {
      // POST /api/referrals/generate
      const baseUrl = `https://linkmoore.app/ref/${userId}`;
      if (type === "product" && itemId) return `${baseUrl}?product=${itemId}`;
      if (type === "service" && itemId) return `${baseUrl}?service=${itemId}`;
      return baseUrl;
    },
    trackClick: async (referralCode: string): Promise<void> => {
      // POST /api/referrals/track/:code
    },
    getEarnings: async (userId: string): Promise<number> => {
      // GET /api/referrals/:userId/earnings
      return 120.00;
    },
  },

  // AI endpoints
  ai: {
    classifyRequest: async (query: string): Promise<{ category: string; businesses: Business[] }> => {
      // POST /api/ai/classify
      return { category: "Food & Delivery", businesses: mockBusinesses };
    },
    generateTicket: async (callSummary: string): Promise<Partial<Order>> => {
      // POST /api/ai/generate-ticket
      return { type: "order", status: "pending" };
    },
  },

  // Affiliate marketplace endpoints
  offers: {
    getApproved: async (): Promise<Offer[]> => {
      // GET /api/marketplace/offers
      return mockOffers.filter(o => o.status === "APPROVED");
    },
    getAll: async (): Promise<Offer[]> => {
      // GET /api/admin/offers
      return mockOffers;
    },
    getById: async (offerId: string): Promise<Offer> => {
      return mockOffers.find(o => o.id === offerId) || mockOffers[0];
    },
    create: async (data: Partial<Offer>): Promise<Offer> => {
      // POST /api/marketplace/offers
      return mockOffers[0];
    },
    updateStatus: async (offerId: string, status: OfferStatus): Promise<Offer> => {
      // PUT /api/admin/offers/:id
      return { ...mockOffers[0], status };
    },
  },

  // Affiliate endpoints
  affiliate: {
    getStats: async (affiliateId: string): Promise<AffiliateStats> => {
      // GET /api/affiliate/stats
      return mockAffiliateStats;
    },
    getReferrals: async (affiliateId: string): Promise<Referral[]> => {
      // GET /api/affiliate/referrals
      return mockReferrals;
    },
    getPayouts: async (affiliateId: string): Promise<Payout[]> => {
      // GET /api/affiliate/payouts
      return mockPayouts;
    },
    enrollInOffer: async (affiliateId: string, offerId: string): Promise<OfferEnrollment> => {
      // POST /api/affiliate/enroll
      return mockEnrollments[0];
    },
    generateReferralLink: async (affiliateId: string, offerId: string): Promise<string> => {
      // POST /api/affiliate/generate-link
      return `https://linkmoore.app/go/${affiliateId}/${offerId}`;
    },
  },

  // Promoter endpoints
  promoter: {
    getOffers: async (promoterId: string): Promise<Offer[]> => {
      // GET /api/promoter/offers
      return mockOffers.filter(o => o.promoterId === promoterId);
    },
    createOffer: async (data: Partial<Offer>): Promise<Offer> => {
      // POST /api/promoter/offers
      return mockOffers[0];
    },
  },
};

// Mock data for development
const mockUser: User = {
  id: "user-1",
  name: "João Silva",
  email: "joao@example.com",
  role: "consumer",
  phone: "+258 84 123 4567",
};

const mockBusinesses: Business[] = [
  {
    id: "biz-1",
    name: "Pizza Maputo",
    category: "Food & Delivery",
    rating: 4.5,
    verified: true,
    phone: "+258 84 111 1111",
    price: "150-300 MZN",
    location: "Maputo",
  },
  {
    id: "biz-2",
    name: "Quick Plumbing",
    category: "Home Services",
    rating: 4.8,
    verified: true,
    phone: "+258 84 222 2222",
    price: "500+ MZN",
    location: "Maputo",
  },
  {
    id: "biz-3",
    name: "TaxiGo",
    category: "Transportation",
    rating: 4.3,
    verified: true,
    phone: "+258 84 333 3333",
    price: "50-200 MZN",
    location: "Maputo",
  },
];

const mockOrders: Order[] = [
  {
    id: "order-1",
    businessId: "biz-1",
    userId: "user-1",
    type: "order",
    status: "completed",
    amount: 250,
    createdAt: new Date(),
  },
];

const mockOffers: Offer[] = [
  {
    id: "offer-1",
    name: "Premium Food Delivery Bundle",
    description: "Promote our exclusive food delivery service and earn high commissions on every sale. Perfect for food bloggers and local influencers.",
    url: "https://linkmoore.app/offers/food-delivery",
    status: "APPROVED",
    salesCount: 342,
    epc: 4.50,
    conversionRate: 12.5,
    launchDate: new Date("2024-01-15"),
    promoterId: "promoter-1",
    promoterName: "João Silva",
    vendorName: "Pizza Maputo Network",
    commission: { type: "PERCENTAGE", value: 15 },
    category: "Food & Delivery",
  },
  {
    id: "offer-2",
    name: "Home Services Package",
    description: "Earn by referring customers to our trusted home service providers. High conversion rates and reliable payouts.",
    url: "https://linkmoore.app/offers/home-services",
    status: "APPROVED",
    salesCount: 189,
    epc: 8.25,
    conversionRate: 18.3,
    launchDate: new Date("2024-02-01"),
    promoterId: "promoter-2",
    promoterName: "Maria Santos",
    vendorName: "Quick Plumbing & More",
    commission: { type: "FIXED", value: 50 },
    category: "Home Services",
  },
  {
    id: "offer-3",
    name: "Transportation Referral Program",
    description: "Join our taxi and ride-sharing affiliate program. Earn for every new customer you bring to our platform.",
    url: "https://linkmoore.app/offers/transportation",
    status: "PENDING",
    salesCount: 0,
    epc: 0,
    conversionRate: 0,
    launchDate: new Date("2024-03-10"),
    promoterId: "promoter-3",
    promoterName: "Carlos Mendes",
    vendorName: "TaxiGo Network",
    commission: { type: "PERCENTAGE", value: 10 },
    category: "Transportation",
  },
  {
    id: "offer-4",
    name: "Beauty & Wellness Services",
    description: "Promote beauty salons, spas, and wellness centers. Attractive commission structure with bonus incentives.",
    url: "https://linkmoore.app/offers/beauty-wellness",
    status: "APPROVED",
    salesCount: 267,
    epc: 6.80,
    conversionRate: 15.7,
    launchDate: new Date("2024-01-20"),
    promoterId: "promoter-1",
    promoterName: "João Silva",
    vendorName: "Beauty Hub Maputo",
    commission: { type: "PERCENTAGE", value: 20 },
    category: "Beauty & Wellness",
  },
  {
    id: "offer-5",
    name: "Tech Repair Services",
    description: "Refer customers to our network of tech repair specialists. Quick approvals and weekly payouts.",
    url: "https://linkmoore.app/offers/tech-repair",
    status: "REJECTED",
    salesCount: 0,
    epc: 0,
    conversionRate: 0,
    launchDate: new Date("2024-02-28"),
    promoterId: "promoter-4",
    promoterName: "Ana Costa",
    vendorName: "Tech Fix Solutions",
    commission: { type: "FIXED", value: 30 },
    category: "Technology",
  },
];

const mockAffiliateStats: AffiliateStats = {
  totalEarnings: 2450.75,
  totalClicks: 1234,
  totalLeads: 145,
  totalReferrals: 89,
  pendingCommission: 320.50,
  approvedCommission: 2130.25,
};

const mockReferrals: Referral[] = [
  {
    id: "ref-1",
    affiliateId: "aff-1",
    offerId: "offer-1",
    offerName: "Premium Food Delivery Bundle",
    status: "APPROVED",
    commission: 45.00,
    clickDate: new Date("2024-03-01"),
    conversionDate: new Date("2024-03-02"),
  },
  {
    id: "ref-2",
    affiliateId: "aff-1",
    offerId: "offer-2",
    offerName: "Home Services Package",
    status: "PENDING",
    commission: 50.00,
    clickDate: new Date("2024-03-05"),
  },
  {
    id: "ref-3",
    affiliateId: "aff-1",
    offerId: "offer-1",
    offerName: "Premium Food Delivery Bundle",
    status: "APPROVED",
    commission: 38.50,
    clickDate: new Date("2024-03-03"),
    conversionDate: new Date("2024-03-04"),
  },
];

const mockPayouts: Payout[] = [
  {
    id: "pay-1",
    amount: 500.00,
    status: "COMPLETED",
    requestDate: new Date("2024-02-15"),
    completedDate: new Date("2024-02-18"),
    method: "Bank Transfer",
  },
  {
    id: "pay-2",
    amount: 320.50,
    status: "PENDING",
    requestDate: new Date("2024-03-01"),
    method: "M-Pesa",
  },
];

const mockEnrollments: OfferEnrollment[] = [
  {
    id: "enroll-1",
    affiliateId: "aff-1",
    offerId: "offer-1",
    enrolledDate: new Date("2024-01-20"),
    status: "ACTIVE",
  },
];
