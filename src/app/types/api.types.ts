/**
 * Shared API types for frontend-backend communication
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
  error?: string;
}

/**
 * User interface
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MEMBER';
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication response
 */
export interface AuthData {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * Prayer Theme interface
 */
export interface PrayerTheme {
  id: number;
  title: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Prayer Partner interface
 */
export interface PrayerPartner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Prayer Request interface
 */
export interface PrayerRequest {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSpecial?: boolean;
  userId: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Prayer Pairing interface
 */
export interface PrayerPairing {
  id: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  isSpecialPairing?: boolean;
  emailSent?: boolean;
  emailSentAt?: string;
  partner1: PrayerPartner;
  partner2: PrayerPartner;
  theme: PrayerTheme;
  request?: PrayerRequest;
}

/**
 * Current Partner Response interface
 */
export interface CurrentPartnerResponse {
  pairing: {
    id: number;
    startDate: string;
    endDate: string;
    theme: PrayerTheme;
    isSpecialPairing?: boolean;
  };
  partner: PrayerPartner;
  prayerRequest?: PrayerRequest;
}

/**
 * Date utility functions
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};

export const parseApiDate = (dateString: string): Date => {
  return new Date(dateString);
};
