/**
 * Diary content structure from CMS
 */
export interface DiaryContent {
  id: string;
  created_by: string | null;
  created_dt: string;
  status: string;
  content: string;
  meta: DiaryMeta;
}

/**
 * Diary metadata structure
 */
export interface DiaryMeta {
  type: string;
  image?: string;
  title: string;
  language: string;
  description: string;
}

/**
 * SEO data structure
 */
export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  language?: string;
  publishedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * API response structure for diary feed
 */
export interface DiaryFeedResponse {
  record_count: number;
  content: DiaryContent[];
}

/**
 * Image size options for CDN optimization
 */
export type WisataImageSize = "th" | "xs" | "sm" | "md" | "lg";
export type TwitterImageSize = "small" | "medium" | "large" | "thumb" | "orig";

/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

/**
 * Route parameters
 */
export type RouteParams = Record<string, string>;

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
