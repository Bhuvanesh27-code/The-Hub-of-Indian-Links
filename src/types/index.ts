export type GovernmentLevel = 'central' | 'state' | 'ut' | 'union_territory' | 'not_under_government';

export type VerificationStatus = 'verified' | 'pending' | 'needs_rechecking' | 'broken';

export interface GovernmentLink {
  id: string;
  name: string;
  portal_name?: string;
  url: string;
  official_website_url?: string;
  governmentLevel: GovernmentLevel;
  government_level?: GovernmentLevel;
  stateOrUT?: string;
  jurisdiction?: string;
  department?: string;
  ministry_or_department?: string;
  category: string;
  service_category?: string;
  description: string;
  portal_description?: string;
  uses: string[];
  key_uses?: string[];
  keywords: string[];
  tags?: string[];
  officialSource?: string;
  verification_source?: string;
  lastVerified?: string;
  verified_on?: string;
  verificationStatus: VerificationStatus;
  official_status?: 'official' | 'non-government' | 'verified' | string;
  organization_type?: 'Government' | 'Non-Government' | string;
  languages_available?: string[];
  featured?: boolean;
  status?: 'active' | 'inactive' | 'archived';
  updatedAt?: string;
  updated_at?: string;
  created_at?: string;
  clickCount?: number;
}

export interface Proverb {
  id: string;
  text: string;
  order: number;
  updatedAt?: string;
}

export interface BrokenLinkReport {
  id: string;
  linkId?: string;
  linkName: string;
  linkUrl?: string;
  issueType: 'broken_link' | 'wrong_information' | 'phishing_suspicion' | 'other';
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface FilterOptions {
  query: string;
  level: 'all' | GovernmentLevel;
  stateOrUT: string;
  category: string;
  department: string;
  verificationStatus: string;
  sortBy: 'relevance' | 'name_asc' | 'recently_verified' | 'popular';
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isRtl?: boolean;
}
