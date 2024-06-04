import { headers } from "next/headers";

const headersList = headers();
export const HOST = headersList.get("host");

export const DOMAIN_HOST: string | null = HOST?.includes("localhost")
? "cp.visaero.com"
: HOST;
