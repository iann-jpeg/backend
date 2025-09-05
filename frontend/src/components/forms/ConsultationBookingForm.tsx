import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { consultationsService } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+?\d{1,3}[- ]?)?\d{9,}$/, "Please enter a valid phone number"),
  company: z.string().optional(),
  serviceInterest: z.string().min(1, "Please select a service type"),
  consultationDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date")
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Please select a future date"),
  consultationTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please select a valid time"),
  message: z.string().min(10, "Please provide details about your consultation needs"),
  country: z.string().min(1, "Please select your country"),
});

type FormData = z.infer<typeof formSchema>;

interface ConsultationBookingFormProps {
  onClose?: () => void;
}

export default function ConsultationBookingForm({ onClose }: ConsultationBookingFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceInterest: "",
      consultationDate: "",
      consultationTime: "",
      message: "",
      country: "Kenya", // Default to Kenya
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Validate date and time format
      if (!data.consultationDate || !data.consultationTime) {
        throw new Error('Please select both date and time for the consultation');
      }

      // Ensure the date is in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.consultationDate)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD format');
      }

      // Ensure the time is in HH:MM format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(data.consultationTime)) {
        throw new Error('Invalid time format. Please use HH:MM format');
      }

      // Create the consultation
      // Map the form data to match the backend schema exactly
      const result = await consultationsService.createConsultation({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceInterest: data.serviceInterest,
        serviceType: data.serviceInterest, // Use the same value for both fields
        consultationDate: data.consultationDate,
        consultationTime: data.consultationTime,
        message: data.message,
        country: data.country || 'Kenya',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        scheduledAt: `${data.consultationDate}T${data.consultationTime}:00.000Z`
      });
      console.log("Consultation booking result:", result);
      setIsSubmitted(true);
      
      toast({
        title: "Consultation Booked Successfully!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });
    } catch (error: any) {
      console.error('Consultation booking error:', error);
      
      // Handle specific error types
      let errorMessage = "Failed to book consultation. Please try again.";
      if (error.message.includes("must be a string")) {
        errorMessage = "Please fill in all required fields correctly.";
      } else if (error.message.includes("Invalid")) {
        errorMessage = error.message;
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });

      // If there are field-specific errors, set them in the form
      if (error.message.includes("consultationDate")) {
        form.setError("consultationDate", { message: "Please select a valid date" });
      }
      if (error.message.includes("consultationTime")) {
        form.setError("consultationTime", { message: "Please select a valid time" });
      }
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center pt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Consultation Booked!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for booking a consultation with us. We'll contact you within 24 hours to confirm your appointment.
          </p>
          {onClose && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Schedule Your Consultation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input placeholder="+254 700 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company/Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Rwanda">Rwanda</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of consultation you need" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                      <SelectItem value="corporate-structuring">Corporate Structuring</SelectItem>
                      <SelectItem value="claims-audit">Claims Audit</SelectItem>
                      <SelectItem value="policy-review">Policy Review</SelectItem>
                      <SelectItem value="insurance-training">Insurance Training</SelectItem>
                      <SelectItem value="general-consultation">General Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="consultationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "09:00", label: "9:00 AM" },
                          { value: "10:00", label: "10:00 AM" },
                          { value: "11:00", label: "11:00 AM" },
                          { value: "14:00", label: "2:00 PM" },
                          { value: "15:00", label: "3:00 PM" },
                          { value: "16:00", label: "4:00 PM" }
                        ].map(time => (
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

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Details *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your consultation needs, current challenges, and what you hope to achieve..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                <Clock className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting ? "Booking..." : "Book Consultation"}
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}