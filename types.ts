export interface SearchCriteria {
  location: string;
  quantity: number;
  minReviews?: number;
  maxDistance?: string; // e.g., "5 miles"
  ratingThreshold: number;
}

export interface BusinessLead {
  companyName: string;
  rating: number;
  reviewCount: number;
  phoneNumber: string;
  address: string;
  postalCode: string;
  googleMapsUrl: string;
  website?: string; // To verify if it was filtered correctly
}

export enum SearchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}