import Header from "@/components/layout/Header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Heart, Shield, Home, Clock, Calendar } from "lucide-react";

export default function Diaspora() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Serving Kenyans Abroad with Reliable Insurance Solutions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              No matter where you are in the world, we're here to protect your loved ones back home with comprehensive insurance coverage
            </p>
            <Button size="lg" variant="secondary" className="px-8 py-3" onClick={() => {
              // Open WhatsApp with predefined message
              const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
              const message = encodeURIComponent("Hello! I'm interested in diaspora insurance services. Could you please provide me with more information?");
              window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
            }}>
              Talk to a Diaspora Advisor
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Comprehensive Services for Diaspora
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tailored insurance solutions designed specifically for Kenyans living abroad
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Family Health Cover",
                  description: "Comprehensive medical insurance for your family members in Kenya, covering inpatient, outpatient, maternity, and emergency services.",
                  icon: <Heart className="w-8 h-8" />,
                  features: ["Inpatient & Outpatient Cover", "Maternity Benefits", "Emergency Services", "Specialist Consultations", "Prescription Coverage"]
                },
                {
                  title: "Funeral & Life Policies",
                  description: "Provide financial security and dignified farewell arrangements for your loved ones with our life and funeral insurance policies.",
                  icon: <Shield className="w-8 h-8" />,
                  features: ["Life Insurance Coverage", "Funeral Expense Cover", "Burial Assistance", "Repatriation Cover", "Grief Support Services"]
                },
                {
                  title: "Property & Mortgage Cover",
                  description: "Protect your investments in Kenya including homes, rental properties, and commercial buildings against various risks.",
                  icon: <Home className="w-8 h-8" />,
                  features: ["Residential Property", "Commercial Buildings", "Mortgage Protection", "Contents Insurance", "Rental Income Protection"]
                }
              ].map((service, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <div className="text-primary">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-center">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Time Zone Booking */}
        {/* Diaspora Consultation Payment Section (PayPal) */}
        {/* Project-Based Consultation Button & Modal */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="px-8 py-3 mt-4 border-gold text-gold font-bold">
                Request Project-Based Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-4 text-primary">Project-Based Consultation Request</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projName">Full Name</Label>
                    <Input id="projName" required placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="projEmail">Email</Label>
                    <Input id="projEmail" type="email" required placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="projPhone">Phone</Label>
                  <Input id="projPhone" required placeholder="e.g. +254712345678" />
                </div>
                <div>
                  <Label htmlFor="projDesc">Project Description</Label>
                  <Textarea id="projDesc" required placeholder="Describe your project needs" />
                </div>
                <div>
                  <Label htmlFor="projDuration">Estimated Duration</Label>
                  <Input id="projDuration" required placeholder="e.g. 3 months" />
                </div>
                <div className="text-sm text-muted-foreground mb-2">Pricing subject to contractual agreement and duration. Our team will get back to you with a tailored proposal.</div>
                <Button size="lg" className="w-full bg-gold text-primary font-bold">Submit Request</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 rounded-xl shadow-lg border-2 border-primary">
              <h2 className="text-3xl font-bold mb-4 text-primary">Book a Diaspora Consultation – Pay via Paystack (USD)</h2>
              <p className="mb-6 text-lg text-muted-foreground">$<span className="font-bold text-gold">25</span> per hour. Consultation is activated after payment confirmation.</p>
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const email = formData.get('email')?.toString().trim() || '';
                const fullName = formData.get('fullName')?.toString().trim() || '';
                const amount = parseInt(formData.get('amount')?.toString() || '25');
                const consultTime = formData.get('consultTime')?.toString() || '';
                
                if (!email || !fullName || !consultTime) {
                  alert('Please fill in all required fields');
                  return;
                }

                try {
                  // Call backend to initialize Paystack payment
                  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.galloways.co.ke/api';
                  const response = await fetch(`${apiUrl}/payments/initiate`, {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                      email, 
                      clientName: fullName,
                      amount, 
                      paymentMethod: 'paystack',
                      metadata: {
                        consultationTime: consultTime,
                        service: 'diaspora-consultation'
                      }
                    }),
                  });
                  
                  const data = await response.json();
                  console.log('Payment response:', data);
                  
                  if (data.success && data.data && data.data.metadata && data.data.metadata.authorization_url) {
                    // Redirect to Paystack payment page
                    window.location.href = data.data.metadata.authorization_url;
                  } else {
                    alert('Payment initialization failed: ' + (data.message || 'Unknown error'));
                  }
                } catch (error) {
                  console.error('Payment error:', error);
                  alert('Failed to initialize payment. Please try again.');
                }
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" required placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" required placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input id="amount" name="amount" type="number" value={25} min={25} step={25} readOnly className="bg-muted/50" />
                  <small className="text-muted-foreground">Fixed: $25 for 1 hour. Enter multiples for more hours.</small>
                </div>
                <div>
                  <Label htmlFor="consultTime">Preferred Consultation Time</Label>
                  <Input id="consultTime" name="consultTime" type="datetime-local" required />
                </div>
                <Button size="lg" className="w-full bg-gold text-primary font-bold" type="submit">Pay & Book via Paystack</Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">After payment, you will receive a confirmation email and access to the Online Meeting tab.</div>
              </form>
            </Card>
            {/* ...existing time zone and info cards below... */}
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              {/* ...existing code... */}

              <div className="space-y-8">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Flexible Scheduling</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We accommodate consultations across all time zones. Our advisors are available 24/7 to serve our diaspora clients.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Global Reach</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Serving Kenyans in over 50 countries worldwide with localized support and understanding of international requirements.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Easy Rescheduling</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Need to change your appointment? No problem. Our flexible system allows easy rescheduling to fit your busy lifestyle.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Diaspora Clients Choose Galloways
              </h2>
              <p className="text-muted-foreground">
                We understand the unique challenges faced by Kenyans living abroad
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "14+ Years Experience",
                  description: "Extensive experience serving diaspora communities worldwide"
                },
                {
                  title: "Trusted Partners",
                  description: "Working with Kenya's leading insurance underwriters"
                },
                {
                  title: "Local Expertise",
                  description: "Deep understanding of Kenyan insurance market and regulations"
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock support across all time zones"
                }
              ].map((benefit, index) => (
                <Card key={index} className="p-6 text-center">
                  <h3 className="font-semibold mb-3 text-primary">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="px-8 py-3" onClick={() => {
                // Open WhatsApp with predefined message
                const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
                const message = encodeURIComponent("Hello! I would like to schedule a consultation with a diaspora advisor. Please let me know your availability.");
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
              }}>
                Talk to a Diaspora Advisor
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}