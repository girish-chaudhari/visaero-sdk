import { Icons } from "@/components/icons";
export interface AutoSelectInput {
  label?: string;
  leftIcon?: React.ReactNode;
}

export interface enterpriseObj {
  data: string | undefined;
  dataObj: object | null | undefined;
}

export interface CurrencyProps {
  country: string;
  currency: string;
  symbol: string;
  name: string;
  value_to_usd: string;
  exchange_rate: number;
  taxes: any[]; // Use a more specific type if you know the structure of the objects in the taxes array
}

export interface EnterpriseData {
  _id: string;
  enterprise_account_id: string;
  type: string;
  domain_host: string;
  host: string;
  brand: string;
  brand_logo: string;
  brand_color: string;
  secondary_color: string;
  currency: string;
}

export interface IPData {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

interface BaseFeesStructure {
  adult_govt_fee: string;
  adult_service_fee: string;
  child_govt_fee: string;
  child_service_fee: string;
  infant_govt_fee: string;
  infant_service_fee: string;
}

interface Description {
  header: string;
  sub_header_1: string;
  sub_header_2: string;
  sub_header_3: string;
  body: string;
}

export interface Fees {
  adult_govt_fee: string;
  adult_service_fee: string;
  child_govt_fee: string;
  child_service_fee: string;
  infant_govt_fee: string;
  infant_service_fee: string;
  bundled_insurance_service_fee: number;
  bundled_insurance_fee: number;
  total_cost: string;
  total_service_fee: string;
  total_tax: string;
  tax_type: string;
  additional_taxes: any[]; // Assuming this can be an array of any type, modify as needed
  currency: string;
}

interface InsuranceCoverage {
  name: string;
  value: string;
}

export interface InsuranceDetails {
  visaero_insurance_fees: string;
  visaero_service_fees: string;
  insurance_type: string;
  insurance_type_id: string;
  insurance_title: string;
  insurance_coverage: InsuranceCoverage[];
  insurance_desc: { name: string; value: string }[];
}

export interface VisaDetailsProps {
  visa_id: string;
  visa_code: string;
  duration_days: string;
  duration_type: string;
  duration_display: string;
  visa_title: string;
  processing_time: string;
  visa_validity: string;
  stay_validity: string;
  description: string;
  base_fees_structure: BaseFeesStructure;
  desc: Description;
  old_visa_id: string;
  display_title: string;
  fees: Fees;
}

export interface VisaOfferProps {
  _id: string;
  name: string;
  travelling_to: string;
  travelling_to_identity: string;
  visa_type: string;
  visa_category: string;
  processing_type: string;
  entry_type: string;
  status: string;
  visa_details: VisaDetailsProps;
  host: string;
  is_visaero_insurance_bundled: boolean;
  insurance_details?: InsuranceDetails; // Make optional if it might not be present
  is_insurance_cloned?: boolean; // Optional field
}

export interface UploadedFile {
  doc_identifier: string;
  file: string;
  file_thumbnail: string;
  ocr: Record<string, any>; // Replace `any` with a more specific type if known
  file_type: string;
  file_name: string;
  confidence: number;
  original_file_name: string;
  mime_type: string;
  processed_by: string;
}

export interface DocSpecification {
  size: string;
  format: string[];
  max_width: string;
  max_height: string;
  aspect_ratio: string;
  face_ratio: string;
  background: string;
}

interface Vault {
  level: string;
  category: string;
}

export interface DocSnap {
  doc_name: string;
  doc_description: string;
  rpa_doc_name: string;
  mandatory: boolean;
  doc_specification: DocSpecification;
  vault: Vault[];
  ocr_required: boolean;
  valid_days: number;
  doc_type: string;
  doc_display_name: string;
  doc_short_description: string;
  is_reusable?: boolean;
}

export interface Document {
  doc_id: string;
  doc_type: string;
  doc_display_name: string;
  doc_short_description: string;
  doc_description: string;
  doc_snap: DocSnap[];
  document_required_for_routes?: string[];
}



export type Demand = {
  doc_id: string;
  doc_type: string;
  doc_display_name: string;
  doc_short_description: string;
  doc_description: string;
  doc_snap: DocSnap[];
  document_required_for_routes?: string[];
};

export type Rule = {
  id: string;
  parameter: string;
  value: string;
  operator: string;
};

export type Condition = {
  id: string;
  rules: Rule[];
  combinator: string;
};

export type DataType = {
  condition: Condition;
  demand: Demand[];
};