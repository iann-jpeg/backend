import { z } from 'zod';

export const quoteFormSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes')
    .trim(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .toLowerCase()
    .trim(),
  phone: z.string()
    .regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/, 'Please enter a valid Kenyan phone number')
    .transform(val => val.startsWith('+254') ? val : `+254${val.replace(/^0/, '')}`),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .optional(),
    
  // Insurance Requirements
  selectedProduct: z.string()
    .min(1, 'Please select an insurance product'),
  product: z.string()
    .min(1, 'Please select a product type'),
  budget: z.string()
    .min(1, 'Please select a budget range')
    .refine(
      (val) => ['under-50k', '50k-100k', '100k-250k', '250k-500k', '500k-1m', 'above-1m'].includes(val),
      'Please select a valid budget range'
    ),
  coverage: z.string()
    .min(1, 'Please select a coverage period')
    .refine(
      (val) => ['1-year', '2-years', '3-years', 'long-term'].includes(val),
      'Please select a valid coverage period'
    ),
  details: z.string()
    .max(2000, 'Additional details must be less than 2000 characters')
    .optional(),
  
  // Dynamic Fields
  dynamicFields: z.record(z.string(), z.any())
    .optional(),
    
  // Contact Preferences
  contactMethod: z.enum(['phone-call', 'email', 'whatsapp', 'in-person'])
    .describe('Please select a preferred contact method'),
  bestTime: z.enum(['morning', 'afternoon', 'evening', 'anytime'])
    .describe('Please select your preferred contact time'),
    
  // Documents Section
  documents: z.array(
    z.custom<File>((file) => file instanceof File, 'Must be a valid file')
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, 
      'File size must be less than 10MB'
    )
    .refine(
      (file) => [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type),
      'File must be a PDF, JPG, PNG, or DOC/DOCX'
    )
  )
  .max(5, 'Maximum 5 files can be uploaded')
  .optional()
  .default([]),
    
  // Terms and Consent Section
  termsAccepted: z.boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions to proceed',
    }),
  privacyAccepted: z.boolean()
    .refine((val) => val === true, {
      message: 'You must accept the privacy policy to proceed',
    }),
  marketingConsent: z.boolean()
    .optional()
    .default(false),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

export const CONTACT_METHODS = [
  { value: 'phone-call', label: 'Phone Call', icon: 'Phone' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'MessageSquare' },
  { value: 'in-person', label: 'In-Person Meeting', icon: 'FileText' },
] as const;

export const TIME_PREFERENCES = [
  { value: 'morning', label: 'Morning (8AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
  { value: 'evening', label: 'Evening (5PM - 8PM)' },
  { value: 'anytime', label: 'Anytime' },
] as const;

export const BUDGET_RANGES = [
  { value: 'under-50k', label: 'Under 50,000' },
  { value: '50k-100k', label: '50,000 - 100,000' },
  { value: '100k-250k', label: '100,000 - 250,000' },
  { value: '250k-500k', label: '250,000 - 500,000' },
  { value: '500k-1m', label: '500,000 - 1,000,000' },
  { value: 'above-1m', label: 'Above 1,000,000' },
] as const;

export const COVERAGE_PERIODS = [
  { value: '1-year', label: '1 Year' },
  { value: '2-years', label: '2 Years' },
  { value: '3-years', label: '3 Years' },
  { value: 'long-term', label: 'Long Term (5+ years)' },
] as const;
