export interface Yacht {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  length: number;
  capacity: number;
  cabins: number;
  crew: number;
  builder: string;
  year: number;
  /** Exactly GALLERY_SIZE images, 1800x1200, named 01..06.jpg. images[0] is the lead. */
  images: string[];
  /** 1200x800 card crop derived from images[0]. */
  thumbnail: string;
  amenities: string[];
  includes: string[];
  pricing: YachtPricing;
  availability: YachtAvailability;
  location: YachtLocation;
  specs: YachtSpecs;
  features?: string[];
  status: "active" | "maintenance" | "inactive";
}

export interface YachtPricing {
  halfDay: number;
  fullDay: number;
  multiDayPerDay?: number;
  currency: "USD";
}

export interface YachtAvailability {
  operatingHours: { start: string; end: string };
  blackoutDates: string[];
  slots: TimeSlot[];
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  type: "half-day" | "full-day";
  status: "available" | "booked" | "hold";
}

export interface YachtLocation {
  marina: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  dockNumber?: string;
}

export interface YachtSpecs {
  length: string;
  beam: string;
  draft: string;
  speed: string;
  fuelCapacity: string;
  waterCapacity: string;
}

export interface Booking {
  id: string;
  yachtId: string;
  customerInfo: CustomerInfo;
  schedule: BookingSchedule;
  guests: number;
  addOns: string[];
  pricing: BookingPricing;
  payment: PaymentInfo;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingSchedule {
  date: string;
  startTime: string;
  endTime: string;
  type: "half-day" | "full-day" | "multi-day";
  endDate?: string;
}

export interface BookingPricing {
  basePrice: number;
  addOnsTotal: number;
  serviceFee: number;
  tax: number;
  total: number;
  deposit: number;
  balance: number;
}

export interface PaymentInfo {
  method: "card" | "wire" | "crypto";
  status: "pending" | "deposit_paid" | "fully_paid" | "refunded";
  stripePaymentIntentId?: string;
  paidAmount: number;
  remainingAmount: number;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "deposit_paid"
  | "fully_paid"
  | "completed"
  | "cancelled";

export interface InquiryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  partySize: number;
  charterType: "half-day" | "full-day" | "multi-day";
  budget?: string;
  occasion?: string;
  addOns: string[];
  message?: string;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: "charter" | "corporate" | "press" | "other";
  message: string;
}

export interface WaiverForm {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  signature: string;
  agreedToTerms: boolean;
  date: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager";
}
