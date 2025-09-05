import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Shield, 
  DollarSign, 
  MessageSquare,
  Calendar,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Globe,
  Activity
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { api, authService, dashboardService } from "@/lib/api";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  email: string;
}

interface DashboardStats {
  totalClaims: number;
  totalQuotes: number;
  totalConsultations: number;
  totalOutsourcingRequests: number;
  totalPayments: number;
  totalDiasporaRequests: number;
  totalUsers: number;
  pendingClaims: number;
  activePolicies: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalSubmissions: number;
  allSubmissions: {
    claims: any[];
    outsourcing: any[];
    consultations: any[];
    payments: any[];
    diaspora: any[];
  };
}

const Resources = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    totalQuotes: 0,
    totalConsultations: 0,
    totalOutsourcingRequests: 0,
    totalPayments: 0,
    totalDiasporaRequests: 0,
    totalUsers: 0,
    pendingClaims: 0,
    activePolicies: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    totalSubmissions: 0,
    allSubmissions: {
      claims: [],
      outsourcing: [],
      consultations: [],
      payments: [],
      diaspora: []
    }
  });
  const [activities, setActivities] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUserAndRole();
  }, []);

  const checkUserAndRole = async () => {
    try {
      // Check if we have a token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      // Get user profile
      const profileData = await authService.getProfile();
      
      if (!profileData || !["ADMIN", "SUPER_ADMIN"].includes(profileData.role)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setProfile({
        id: profileData.id,
        full_name: profileData.name,
        role: profileData.role,
        email: profileData.email
      });
      setUser(profileData);
      
      await loadDashboardData();
    } catch (error) {
      console.error("Error checking user role:", error);
      toast({
        title: "Authentication Error",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivities()
      ]);
      
      // Handle the response structure from comprehensive stats endpoint
      if (dashboardStats.success && dashboardStats.data) {
        setStats(dashboardStats.data);
        console.log("Real-time dashboard stats loaded:", dashboardStats.data);
        
        if (dashboardStats.data.isRealTime) {
          toast({
            title: "Dashboard Updated",
            description: "Real-time data from database loaded successfully.",
          });
        } else if (dashboardStats.data.isMockData) {
          toast({
            title: "Demo Data Mode",
            description: dashboardStats.message || "Using demo data due to database connectivity.",
            variant: "default",
          });
        }
      } else {
        // Fallback if response structure is different
        setStats(dashboardStats);
      }
      
      if (activitiesData.success && activitiesData.data) {
        setActivities(activitiesData.data);
      } else {
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Using offline mode.",
        variant: "destructive",
      });
      
      // Set fallback empty data structure to prevent crashes
      setStats({
        totalClaims: 0,
        totalQuotes: 0,
        totalConsultations: 0,
        totalOutsourcingRequests: 0,
        totalPayments: 0,
        totalDiasporaRequests: 0,
        totalUsers: 0,
        pendingClaims: 0,
        activePolicies: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        totalSubmissions: 0,
        allSubmissions: {
          claims: [],
          outsourcing: [],
          consultations: [],
          payments: [],
          diaspora: []
        }
      });
      setActivities([]);
    }
  };

  const handleSignOut = () => {
    api.removeToken();
    localStorage.removeItem('auth_token');
    navigate("/");
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/dashboard/export-pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "PDF report downloaded successfully!",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const StatsCard = ({ title, value, icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  const StatCard = ({ title, value, icon: Icon, change, color = "primary" }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick }: any) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Icon className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Header */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm opacity-90">Welcome back, {profile?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export PDF Report
              </Button>
              <Badge variant="secondary">{profile?.role}</Badge>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Claims"
              value={stats.totalClaims}
              icon={<FileText className="h-6 w-6" />}
              trend="+12%"
            />
            <StatsCard
              title="Total Quotes"
              value={stats.totalQuotes}
              icon={<DollarSign className="h-6 w-6" />}
              trend="+8%"
            />
            <StatsCard
              title="Consultations"
              value={stats.totalConsultations}
              icon={<Users className="h-6 w-6" />}
              trend="+15%"
            />
            <StatsCard
              title="Pending Claims"
              value={stats.pendingClaims}
              icon={<AlertCircle className="h-6 w-6" />}
              trend="-5%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Outsourcing Requests"
              value={stats.totalOutsourcingRequests}
              icon={<FileText className="h-6 w-6" />}
            />
            <StatsCard
              title="Payments"
              value={stats.totalPayments}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatsCard
              title="Diaspora Requests"
              value={stats.totalDiasporaRequests}
              icon={<Users className="h-6 w-6" />}
            />
          </div>

        {/* Revenue & Conversion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Monthly Revenue"
            value={`KES ${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={15}
            color="green-600"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={BarChart3}
            change={2}
            color="purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Manage Leads"
              description="View and update lead status"
              icon={Users}
              onClick={() => {/* Navigate to leads management */}}
            />
            <QuickActionCard
              title="Policy Overview"
              description="Track active policies and renewals"
              icon={Shield}
              onClick={() => {/* Navigate to policies */}}
            />
            <QuickActionCard
              title="Claims Review"
              description="Process pending claims"
              icon={FileText}
              onClick={() => {/* Navigate to claims */}}
            />
            <QuickActionCard
              title="Payment Tracking"
              description="Monitor payments and transactions"
              icon={DollarSign}
              onClick={() => {/* Navigate to payments */}}
            />
            <QuickActionCard
              title="Client Communications"
              description="Send notifications and updates"
              icon={MessageSquare}
              onClick={() => {/* Navigate to communications */}}
            />
            <QuickActionCard
              title="Resource Library"
              description="Manage documents and materials"
              icon={FileText}
              onClick={() => {/* Navigate to resources */}}
            />
          </div>
        </div>

        {/* Detailed Sections */}
        <Tabs defaultValue="claims" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="outsourcing">Outsourcing</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="diaspora">Diaspora</TabsTrigger>
          </TabsList>

          <TabsContent value="claims" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Claims ({stats.allSubmissions.claims.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.allSubmissions.claims.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Policy Number</th>
                          <th className="text-left p-2">Client Email</th>
                          <th className="text-left p-2">Incident Type</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.allSubmissions.claims.map((claim: any) => (
                          <tr key={claim.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{claim.id}</td>
                            <td className="p-2">{claim.policyNumber}</td>
                            <td className="p-2">{claim.clientEmail}</td>
                            <td className="p-2">{claim.incidentType}</td>
                            <td className="p-2">KSh {claim.claimAmount?.toLocaleString()}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(claim.status)}`}>
                                {claim.status}
                              </span>
                            </td>
                            <td className="p-2">{formatDate(claim.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No claims submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outsourcing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  All Outsourcing Requests ({stats.allSubmissions.outsourcing.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.allSubmissions.outsourcing.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Company</th>
                          <th className="text-left p-2">Contact Email</th>
                          <th className="text-left p-2">Service Type</th>
                          <th className="text-left p-2">Budget Range</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.allSubmissions.outsourcing.map((request: any) => (
                          <tr key={request.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{request.id}</td>
                            <td className="p-2">{request.companyName}</td>
                            <td className="p-2">{request.contactEmail}</td>
                            <td className="p-2">{request.serviceType}</td>
                            <td className="p-2">{request.budgetRange}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="p-2">{formatDate(request.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No outsourcing requests submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Consultations ({stats.allSubmissions.consultations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.allSubmissions.consultations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Service</th>
                          <th className="text-left p-2">Preferred Date</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.allSubmissions.consultations.map((consultation: any) => (
                          <tr key={consultation.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{consultation.id}</td>
                            <td className="p-2">{consultation.fullName}</td>
                            <td className="p-2">{consultation.email}</td>
                            <td className="p-2">{consultation.serviceType}</td>
                            <td className="p-2">{consultation.preferredDate ? formatDate(consultation.preferredDate) : 'N/A'}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(consultation.status)}`}>
                                {consultation.status}
                              </span>
                            </td>
                            <td className="p-2">{formatDate(consultation.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No consultations scheduled yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  All Payments ({stats.allSubmissions.payments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.allSubmissions.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Policy Number</th>
                          <th className="text-left p-2">Client Email</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Payment Method</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.allSubmissions.payments.map((payment: any) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{payment.id}</td>
                            <td className="p-2">{payment.policyNumber}</td>
                            <td className="p-2">{payment.clientEmail}</td>
                            <td className="p-2">KSh {payment.amount?.toLocaleString()}</td>
                            <td className="p-2">{payment.paymentMethod}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="p-2">{formatDate(payment.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No payments recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diaspora" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  All Diaspora Requests ({stats.allSubmissions.diaspora.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.allSubmissions.diaspora.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">ID</th>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Country</th>
                          <th className="text-left p-2">Service Type</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.allSubmissions.diaspora.map((request: any) => (
                          <tr key={request.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{request.id}</td>
                            <td className="p-2">{request.fullName}</td>
                            <td className="p-2">{request.email}</td>
                            <td className="p-2">{request.currentCountry}</td>
                            <td className="p-2">{request.serviceType}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="p-2">{formatDate(request.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No diaspora requests submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;