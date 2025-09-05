import { LucideIcon, Shield, Car, HeartPulse, Home, Building2, Briefcase, Globe, PiggyBank } from "lucide-react";

export type InsuranceProduct = {
  form: string;
  attachments: string[];
  description?: string;
};

export const insuranceProducts: Record<string, InsuranceProduct> = {
  "Motor Insurance": {
    form: "/forms/motor-insurance.pdf",
    attachments: [
      "Vehicle logbook copy",
      "Driver's license copy",
      "Previous insurance certificates (if any)",
    ],
  },
  "Medical Insurance": {
    form: "/forms/medical-insurance.pdf",
    attachments: [
      "National ID/Passport copy",
      "Recent passport photos",
      "Medical history (if applicable)",
    ],
  },
  "Home Insurance": {
    form: "/forms/home-insurance.pdf",
    attachments: [
      "Property ownership documents",
      "Recent property valuation",
      "List of valuable items",
    ],
  },
  "Business Insurance": {
    form: "/forms/business-insurance.pdf",
    attachments: [
      "Business registration documents",
      "Asset inventory list",
      "Previous claims history (if any)",
    ],
  },
};

export const insuranceIcons: Record<string, LucideIcon> = {
  "Motor Insurance": Car,
  "Medical Insurance": HeartPulse,
  "Home Insurance": Home,
  "Business Insurance": Building2,
  "Life Insurance": Shield,
  "Travel Insurance": Globe,
  "Property Insurance": Building2,
  "Investment Insurance": PiggyBank,
};
