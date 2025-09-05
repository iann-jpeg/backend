import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Home, Car, Briefcase, Users, FileText, Building2, HeartPulse, Globe, PiggyBank, Hammer, Wrench, MonitorSmartphone, Plane, UserCheck, Layers, Coins } from 'lucide-react';
import { Phone, Mail, MessageSquare, Upload, CheckCircle, UploadCloud, FileDown } from 'lucide-react';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { quotesService } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { 
  quoteFormSchema, 
  type QuoteFormData,
  CONTACT_METHODS,
  TIME_PREFERENCES,
  BUDGET_RANGES,
  COVERAGE_PERIODS
} from '@/lib/validations/quote-form';

// Ensure QuoteFormData matches the schema's optional/required fields
// If your schema has `documents?: File[]` and `dynamicFields?: Record<string, any>` as optional,
// update the type accordingly:
type QuoteFormDataFixed = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Make phone optional to match the schema
  location?: string; // Make location optional to match the schema
  selectedProduct: string;
  product: string;
  budget: string;
  coverage: string;
  details?: string; // Make details optional to match the resolver
  contactMethod: "email" | "phone-call" | "whatsapp" | "in-person";
  bestTime: "morning" | "afternoon" | "evening" | "anytime";
  documents?: File[];
  dynamicFields?: Record<string, any>;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent?: boolean;
};

function QuoteForm() {
const [isLoading, setIsLoading] = useState(false);
const [files, setFiles] = useState<File[]>([]);
const [selectedProduct, setSelectedProduct] = useState<string>('');

const form = useForm<QuoteFormDataFixed, any, QuoteFormDataFixed>({
  resolver: zodResolver(quoteFormSchema),
  defaultValues: {
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',

    // Insurance Requirements
    selectedProduct: '',
    product: '',
    budget: '',
    coverage: '',
    details: '',

    // Contact Preferences
    contactMethod: 'phone-call',
    bestTime: 'anytime',

    // Documents and Dynamic Fields
    documents: [],
    dynamicFields: {},

    // Terms and Consent
    termsAccepted: false,
    privacyAccepted: false,
    marketingConsent: false
  },
  mode: 'onBlur',
  criteriaMode: 'all',
});

  const { formState: { errors, isSubmitting }, register, control, handleSubmit, watch } = form;
  const watchedProduct = watch('product');
  const watchedContactMethod = watch('contactMethod');
  
  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Append basic form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'dynamicFields') {
            // Handle dynamic fields with prefix
            Object.entries(value).forEach(([fieldKey, fieldValue]) => {
              formData.append(`dynamic_${fieldKey}`, fieldValue.toString());
            });
          } else if (key === 'documents') {
            // Handle file uploads
            files.forEach(file => {
              formData.append('documents', file);
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add product info and metadata
      formData.append('selectedProduct', data.selectedProduct);
      formData.append('submittedAt', new Date().toISOString());
      formData.append('details', JSON.stringify({
        selectedProduct: data.selectedProduct,
        dynamicFields: data.dynamicFields,
        productSpecificData: form.getValues()
      }));

      // Submit to backend
      const result = await quotesService.createQuote(formData);

      // Generate unique reference
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const refNumber = `GIQ-${timestamp.toString().slice(-8)}-${randomNum}`;

      // Show success message
      toast({
        title: "Quote Submitted Successfully! 🎉",
        description: 
          `Your quote request (Ref: ${refNumber}) has been submitted.\n` +
          `We'll contact you within 24 hours at ${watchedContactMethod === 'email' ? data.email : data.phone}.`,
        duration: 6000
      });

      // Reset form state
      form.reset();
      setSelectedProduct('');
      setFiles([]);
      
    } catch (error: any) {
      console.error('Quote submission error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to submit quote. Please try again or contact support.";
      
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList).filter(file => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return false;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} must be a PDF, JPG, PNG, or DOC/DOCX`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    // Check total file limit
    if (files.length + newFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    form.setValue('documents', [...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      form.setValue('documents', newFiles);
      return newFiles;
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 7XX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location/County</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Nairobi, Mombasa, Kisumu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Insurance Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Insurance Requirements</h3>
          
          <FormField
            control={control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Product</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Map through insurance products here */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUDGET_RANGES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COVERAGE_PERIODS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please provide any additional information..." 
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Contact Preferences</h3>
          
          <FormField
            control={control}
            name="contactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Method</FormLabel>
                <div className="space-y-2">
                  {CONTACT_METHODS.map(({ value, label, icon }) => (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                        className="text-primary"
                      />
                      <span className="flex items-center gap-2">
                        {icon && <span className="w-4 h-4">{icon}</span>}
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="bestTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Best Time to Contact</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_PREFERENCES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Supporting Documents</h3>
          
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload any relevant documents (ID, logbook, property documents, etc.)
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Selected Files:</p>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Terms and Submit */}
        <div className="space-y-6">
          <FormField
            control={control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-primary underline">Privacy Policy</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I would like to receive updates about new insurance products and services
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? "Submitting..." : "Submit & Get Quote"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isLoading || isSubmitting}
              onClick={() => {
                const data = form.getValues();
                if (Object.keys(data).some(key => !!data[key])) {
                  // Save as draft logic here
                }
              }}
            >
              Save as Draft
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default QuoteForm;
