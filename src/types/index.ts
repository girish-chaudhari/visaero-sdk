import { Icons } from "@/components/icons";
export interface AutoSelectInput {
  label?: string;
  leftIcon?: React.ReactNode;
}

export interface enterpriseObj {
  data: string | undefined, 
  dataObj: object | null | undefined
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
