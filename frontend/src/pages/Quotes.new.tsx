import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Upload, Phone, Mail, MessageSquare, FileText, FileDown, LucideIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import Header from "@/components/layout/Header";
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
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { quotesService } from "@/lib/api";
import { 
  quoteFormSchema, 
  type QuoteFormData, 
  CONTACT_METHODS, 
  TIME_PREFERENCES,
  BUDGET_RANGES,
  COVERAGE_PERIODS
} from "@/lib/validations/quote-form";
import { insuranceProducts, insuranceIcons, InsuranceProduct } from "@/lib/constants/insurance-products";

function renderProductFields(
  selectedProduct: string,
  form: ReturnType<typeof useForm<QuoteFormData>>
) {
  // Example: Render extra fields based on selectedProduct
  // You can customize this logic as needed for your products
  switch (selectedProduct) {
    case "Motor Insurance":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Motor Insurance Details</h3>
          <FormField
            control={form.control}
            name="dynamicFields.vehicleReg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., KAA 123A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dynamicFields.vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Saloon, SUV, Truck" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    case "Medical Insurance":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Medical Insurance Details</h3>
          <FormField
            control={form.control}
            name="dynamicFields.familySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Size</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Number of family members" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    // Add more cases for other products as needed
    default:
      return null;
  }
}

export default function Quotes() {
  const [tab, setTab] = useState<"quote" | "downloads">("quote");
  const [isLoading, setIsLoading] = useState(false);
  const [refNum, setRefNum] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      product: "",
      budget: "",
      coverage: "",
      details: "",
      contactMethod: "phone-call",
      bestTime: "anytime",
      termsAccepted: false,
      privacyAccepted: false,
      selectedProduct: "",
      dynamicFields: {},
      documents: undefined,
      marketingConsent: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Append all form fields except files and dynamicFields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "dynamicFields") {
            Object.entries(value).forEach(([fieldKey, fieldValue]) => {
              formData.append(`dynamic_${fieldKey}`, fieldValue?.toString?.() ?? "");
            });
          } else if (key !== "documents") {
            formData.append(key, value.toString());
          }
        }
      });

      // Handle file uploads (align with backend: use 'document' not 'documents')
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.length) {
        Array.from(fileInput.files).forEach(file => {
          formData.append("document", file); // backend expects 'document'
        });
      }

      // Add selected product (for redundancy)
      formData.set("selectedProduct", selectedProduct);

      // Submit to backend
      const result = await quotesService.createQuote(formData);

      // Generate reference number
      const refNumber = `GIQ-${Date.now().toString().slice(-8)}`;
      setRefNum(refNumber);
      setSuccess(true);

      toast({
        title: "Quote Submitted Successfully!",
        description: `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`
      });

      // Reset form
      form.reset();
    } catch (error: any) {
      console.error("Quote submission error:", error);
      toast({
        title: "Submission Error",
        description: error?.message || "Failed to submit quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    setIsLoading(true);
    try {
      // Use FormData for draft as well, to support file uploads
      const values = form.getValues();
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "dynamicFields") {
            Object.entries(value).forEach(([fieldKey, fieldValue]) => {
              formData.append(`dynamic_${fieldKey}`, fieldValue?.toString?.() ?? "");
            });
          } else if (key !== "documents") {
            formData.append(key, value.toString());
          }
        }
      });
      // File uploads for draft
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.length) {
        Array.from(fileInput.files).forEach(file => {
          formData.append("document", file);
        });
      }
      formData.set("selectedProduct", selectedProduct);
      formData.set("status", "DRAFT");
      formData.set("isDraft", "true");
      formData.set("createdAt", new Date().toISOString());

      const result = await quotesService.createQuote(formData);
      if (result?.success) {
        const draftNumber = `DRAFT-${Date.now().toString().slice(-8)}`;
        toast({
          title: "Draft Saved Successfully!",
          description: `Your quote draft has been saved. Reference: ${draftNumber}`
        });
      } else {
        throw new Error("Failed to save draft");
      }
    } catch (error: any) {
      console.error("Save draft error:", error);
      toast({
        title: "Save Failed", 
        description: error?.message || "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ["quote", "downloads"] as const;
  type TabType = typeof tabs[number];
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex border-b mb-8">
            {tabs.map((tabValue) => (
              <button
                key={tabValue}
                className={`px-6 py-3 font-semibold focus:outline-none ${
                  tab === tabValue
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setTab(tabValue as TabType)}
              >
                {tabValue === "quote" ? "Request Quote" : "Downloads"}
              </button>
            ))}
          </div>

          {tab === "quote" && (
            <>
              {success ? (
                <div className="max-w-2xl mx-auto text-center py-16">
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-green-800 mb-4">Quote Submitted Successfully!</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Reference Number: <span className="font-bold text-primary">{refNum}</span>
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your quote request. Our team will review your requirements and contact you within 24 hours with a personalized quote.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      📧 A confirmation email has been sent to your provided email address.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📱 You'll receive SMS updates on your quote status.
                    </p>
                    <Button 
                      onClick={() => {
                        setSuccess(false);
                        form.reset();
                      }} 
                      className="mt-4"
                    >
                      Submit Another Quote
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
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
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+254 700 123 456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name="selectedProduct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Product *</FormLabel>
                            <Select 
                              onValueChange={value => {
                                field.onChange(value);
                                setSelectedProduct(value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select insurance product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(insuranceProducts).map(([title]) => (
                                  <SelectItem key={title} value={title}>
                                    {title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget Range (KES)</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select budget range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {BUDGET_RANGES.map(range => (
                                    <SelectItem key={range.value} value={range.value}>
                                      {range.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="coverage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coverage Period</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select coverage period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {COVERAGE_PERIODS.map(period => (
                                    <SelectItem key={period.value} value={period.value}>
                                      {period.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide any additional information about your insurance needs..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Dynamic Product-Specific Fields */}
                    {selectedProduct && renderProductFields(selectedProduct, form)}

                    {/* Contact Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Contact Preferences</h3>
                      <FormField
                        control={form.control}
                        name="contactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact Method *</FormLabel>
                            <div className="space-y-2 mt-2">
                              {CONTACT_METHODS.map(method => {
                                const Icon = {
                                  'phone-call': Phone,
                                  'email': Mail,
                                  'whatsapp': MessageSquare,
                                  'in-person': FileText
                                }[method.value];

                                return (
                                  <label 
                                    key={method.value}
                                    className="flex items-center space-x-2 cursor-pointer"
                                  >
                                    <input 
                                      type="radio"
                                      name={field.name}
                                      value={method.value}
                                      checked={field.value === method.value}
                                      onChange={e => field.onChange(e.target.value)}
                                      className="text-primary focus:ring-primary"
                                    />
                                    <div className="flex items-center space-x-2">
                                      {Icon && <Icon className="w-4 h-4" />}
                                      <span>{method.label}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bestTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Best Time to Contact</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select preferred time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_PREFERENCES.map(time => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
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
                      <h3 className="text-lg font-semibold border-b pb-2">Supporting Documents (Optional)</h3>
                      <div>
                        <Label>Upload Supporting Documents</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mt-2">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                          <p className="text-sm text-muted-foreground mb-4">Upload any relevant documents (ID, vehicle logbook, property documents, etc.)</p>
                          <p className="text-xs text-muted-foreground mb-4">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)</p>
                          <input 
                            type="file" 
                            name="document" 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                            className="block mx-auto mt-2" 
                            multiple
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className="space-y-6">
                      <div className="flex flex-col space-y-4">
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2">
                              <FormControl>
                                <input 
                                  type="checkbox" 
                                  className="mt-1"
                                  checked={field.value}
                                  onChange={e => field.onChange(e.target.checked)}
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-muted-foreground">
                                I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="privacyAccepted"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2">
                              <FormControl>
                                <input 
                                  type="checkbox" 
                                  className="mt-1"
                                  checked={field.value}
                                  onChange={e => field.onChange(e.target.checked)}
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-muted-foreground">
                                I consent to being contacted regarding my insurance quote request.
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="flex-1 px-8 py-3" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Submitting..." : "Submit & Get Quote"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="lg" 
                          onClick={saveDraft}
                          disabled={isLoading}
                        >
                          Save as Draft
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              )}
            </>
          )}

        {tab === "downloads" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(insuranceProducts).map(([title, product]) => (
              <Card key={title} className="p-6">
                <h3 className="text-xl font-bold mb-2 text-primary flex items-center gap-2">
                  {/* Create IconComponent to handle icon rendering */}
                  {insuranceIcons[title] && React.createElement(insuranceIcons[title], { size: 24 })}
                  {title}
                </h3>
                <a 
                  href={product.form} 
                  download 
                  className="inline-flex items-center mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  <FileDown className="mr-2 h-5 w-5" /> Download Form
                </a>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  {product.attachments.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  </div>
  );
}
