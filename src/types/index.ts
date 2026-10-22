export type PageTab = 'home' | 'services' | 'archive' | 'process' | 'location' | 'quote';

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
  category: 'PHOTOCARD' | 'OPP & SLEEVE' | 'SPECIAL BENEFITS' | 'GOODS SET';
  goodsType: string;
  packMethod: string;
  description: string;
  isSample: boolean; // Flagged as sample reference per requirements
  accentColor: string;
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
