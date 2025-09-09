/* ==========================================================================
   Content Models - 3dime v2
   TypeScript interfaces for structured data from JSON-LD
   ========================================================================== */

/**
 * Schema.org Person interface based on structured-data.jsonld
 */
export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  givenName: string;
  familyName: string;
  alternateName?: string;
  description: string;
  url: string;
  image: string;
  email: string;
  sameAs: string[];
  jobTitle: string;
  worksFor: Organization;
  address: PostalAddress;
  nationality: string;
  knowsAbout: Technology[];
  hasOccupation: Occupation;
  alumniOf?: EducationalOrganization[];
  workExperience?: WorkExperienceItem[];
  owns?: Thing[];
  hobbies?: Thing[];
}

/**
 * Schema.org Organization interface
 */
export interface Organization {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  founder?: PersonSchema;
  sameAs?: string[];
}

/**
 * Schema.org PostalAddress interface
 */
export interface PostalAddress {
  '@type': 'PostalAddress';
  addressLocality: string;
  addressCountry: string;
}

/**
 * Schema.org Occupation interface
 */
export interface Occupation {
  '@type': 'Occupation';
  name: string;
}

/**
 * Schema.org EducationalOrganization interface
 */
export interface EducationalOrganization {
  '@type': 'EducationalOrganization';
  name: string;
  description?: string;
  url?: string;
}

/**
 * Schema.org Thing interface
 */
export interface Thing {
  '@type': 'Thing' | 'Game' | 'VideoGame';
  name: string;
  url?: string;
  description?: string;
}

/**
 * Technology/skill item from knowsAbout
 */
export interface Technology {
  '@type': 'Thing';
  name: string;
  url?: string;
  category?: string;
  icon?: string;
  color?: string;
}

/**
 * Work experience item
 */
export interface WorkExperienceItem {
  '@type': 'Thing' | 'Organization';
  name: string;
  url?: string;
  description?: string;
}

/**
 * Social media platform configuration
 */
export interface SocialLink {
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  color?: string;
}

/**
 * Processed content for UI consumption
 */
export interface ProcessedContent {
  profile: {
    name: string;
    title: string;
    description: string;
    location: string;
    email: string;
    image: string;
  };
  socialLinks: SocialLink[];
  technologies: Technology[];
  education: EducationalOrganization[];
  experience: WorkExperienceItem[];
  hobbies: Thing[];
  personalItems: Thing[];
}

/**
 * API response wrapper
 */
export interface ContentResponse<T> {
  data: T;
  status: 'success' | 'error' | 'loading';
  error?: string;
  timestamp?: number;
}

/**
 * Loading states for content sections
 */
export interface ContentLoadingState {
  profile: boolean;
  technologies: boolean;
  experience: boolean;
  education: boolean;
  hobbies: boolean;
  socialLinks: boolean;
}