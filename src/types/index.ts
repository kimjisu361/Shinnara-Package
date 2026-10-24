export type PageTab = 'home' | 'services' | 'archive' | 'process' | 'location' | 'quote' | 'admin';

export interface AdminUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName?: string | null;
}

export type AdminAuthStatus =
  | 'loading'
  | 'unauthenticated'
  | 'unauthorized'
  | 'email_unverified'
  | 'server_verifying'
  | 'server_failed'
  | 'authenticated';

export interface AdminAuthState {
  status: AdminAuthStatus;
  user: AdminUser | null;
  error: string | null;
}

export interface ServiceItem {
  id: string;
  enTitle: string;
  krTitle: string;
  description: string;
  details?: string[];
  materials?: string[];
  category: 'photocard' | 'opp' | 'benefits' | 'set' | 'custom';
}

export interface ArchiveItem {
  id: string;
  title: string;
  category: 'PHOTOCARD' | 'OPP & SLEEVE' | 'SPECIAL BENEFITS' | 'GOODS SET' | string;
  goodsType: string;
  packMethod: string;
  description: string;
  isSample?: boolean; // Flagged as sample reference per requirements
  accentColor?: string;
  imageUrl?: string;
  order?: number;
  is_published?: boolean;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  goodsType: string;
  packMethod: string;
  description: string;
  imageUrl?: string;
  order: number;
  is_published: boolean;
  is_deleted: boolean;
  isLegacyDocument?: boolean; // True if document was missing is_published or is_deleted fields in Firestore
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteFormData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  goodsType: string;
  estimatedQuantity: string;
  goodsSize: string;
  packagingMethod: string;
  materialReady: 'ready' | 'needConsult' | 'sinnaraSupplied';
  targetSchedule: string;
  fileNote: string;
  additionalRequests: string;
  agreePrivacy: boolean;
}

export interface CustomAssets {
  logoImage?: string;
  puppyImage?: string;
  heroImage?: string;
  kakaoChannelUrl?: string;
}
