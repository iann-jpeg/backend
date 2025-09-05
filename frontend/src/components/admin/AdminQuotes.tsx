import { useState, useEffect } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Eye, 
  Filter, 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  RefreshCw, 
  Edit,
  Trash2,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  MessageSquare
} from 'lucide-react';
import { quotesService, Quote } from '@/lib/api/quotes-service';
// Make sure the file exists at this path, or update the path below if needed
// Make sure the file exists at this path, or update the path below if needed
import { adminService } from '@/lib/api/admin-service';
import { useToast } from '@/hooks/use-toast';

interface QuoteStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
}

export function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(() => {
      fetchQuotes();
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [currentPage, statusFilter, searchTerm]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const filterStatus = statusFilter === "all" ? undefined : statusFilter;
      // Fetch all pages to show all submitted data
      let allQuotes: Quote[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = await quotesService.getAllQuotes(page, 50, filterStatus, searchTerm || undefined);
        allQuotes = allQuotes.concat(result.quotes || []);
        totalPages = result.pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages);
      setQuotes(allQuotes);
      setTotalPages(totalPages);
      // Calculate stats
      const statsData = {
        total: allQuotes.length,
        pending: allQuotes.filter((q) => q.status === 'pending').length,
        approved: allQuotes.filter((q) => q.status === 'approved').length,
        rejected: allQuotes.filter((q) => q.status === 'rejected').length,
        draft: allQuotes.filter((q) => q.status === 'draft').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      setQuotes([]);
      toast({
        title: "Error",
        description: "Failed to fetch quotes data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  const updateQuoteStatus = async (quoteId: number, status: string) => {
    try {
      const result = await adminService.updateQuoteStatus(quoteId, status);
      if (result && result.success) {
        await fetchQuotes();
        setShowEditModal(false);
        if (selectedQuote && selectedQuote.id === quoteId) {
          setSelectedQuote({ ...selectedQuote, status });
        }
        toast({
          title: "Status Updated",
          description: `Quote status updated to ${status}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update quote status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Update quote status error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update quote status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      try {
        await adminService.deleteQuote(quoteId);
        await fetchQuotes();
        setShowDetailsModal(false);
        toast({
          title: "Quote Deleted",
          description: "Quote has been successfully deleted.",
        });
      } catch (error) {
        console.error('Delete quote error:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete quote.",
          variant: "destructive",
        });
      }
    }
  };

  const exportQuotes = async (format: 'csv' | 'json') => {
    try {
      const response: any = await adminService.exportData('quotes', format);
      const blob = new Blob([response.data as BlobPart], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotes-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: `Quotes exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export quotes data.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => exportQuotes('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportQuotes('json')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={fetchQuotes} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search">Search Quotes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, email, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Requests ({quotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading quotes...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Budget</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Created</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.length > 0 ? (
                      quotes.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{quote.firstName} {quote.lastName}</div>
                              <div className="text-sm text-gray-500">{quote.email}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="truncate max-w-32" title={quote.product}>
                                {quote.product}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{quote.location || 'Not specified'}</span>
                            </div>
                          </td>
                          <td className="p-3">{quote.budget || 'Not specified'}</td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {quote.phone}
                              </div>
                              <div className="text-gray-500">{quote.contactMethod}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">{formatDate(quote.createdAt)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuoteDetails(quote)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuote(quote);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteQuote(quote.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No quotes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Quote Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Customer Name</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Product</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.product}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Budget</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Coverage</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.coverage || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact Method</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.contactMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Best Time</Label>
                      <p className="text-sm text-gray-600">{selectedQuote.bestTime || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedQuote.status)}>
                        {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm text-gray-600">{formatDate(selectedQuote.createdAt)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Updated</Label>
                      <p className="text-sm text-gray-600">{formatDate(selectedQuote.updatedAt)}</p>
                    </div>
                      <div className="col-span-2">
                        <Label className="text-sm font-medium">Attached Documents</Label>
                        {selectedQuote.documents && selectedQuote.documents.length > 0 ? (
                          <ul className="mt-2 space-y-2">
                            {selectedQuote.documents.map((doc: any) => {
                              // File type icon logic
                              const ext = doc.originalName.split('.').pop()?.toLowerCase();
                              let icon = <FileText className="h-4 w-4 text-muted-foreground" />;
                              if (["pdf"].includes(ext)) icon = <FileText className="h-4 w-4 text-red-600" />;
                              if (["jpg","jpeg","png","gif","svg"].includes(ext)) icon = <span className="h-4 w-4 inline-block bg-gray-300 rounded">IMG</span>;
                              if (["doc","docx"].includes(ext)) icon = <FileText className="h-4 w-4 text-blue-600" />;
                              return (
                                <li key={doc.id} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                                  {icon}
                                  <span className="truncate max-w-xs" title={doc.originalName}>{doc.originalName}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => adminService.downloadDocument(doc.id, doc.originalName)}
                                  >
                                    Download
                                  </Button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-gray-500 mt-2">No documents attached</p>
                        )}
                      </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="space-y-4">
                  {selectedQuote.details ? (
                    <div>
                      <Label className="text-sm font-medium">Insurance Product Details</Label>
                      {(() => {
                        let detailsObj;
                        try {
                          detailsObj = JSON.parse(selectedQuote.details);
                        } catch {
                          detailsObj = selectedQuote.details;
                        }
                        if (typeof detailsObj === 'object' && detailsObj !== null) {
                          return (
                            <table className="w-full text-sm bg-gray-50 rounded-lg mt-2">
                              <tbody>
                                {Object.entries(detailsObj).map(([key, value]) => (
                                  <tr key={key} className="border-b last:border-b-0">
                                    <td className="py-2 px-3 font-medium text-gray-700 capitalize whitespace-nowrap">{key.replace(/([A-Z])/g, ' $1')}</td>
                                    <td className="py-2 px-3 text-gray-600 break-all">{String(value)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        } else {
                          return (
                            <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{selectedQuote.details}</p>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No additional requirements provided</p>
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="w-full"
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'approved')}
                      disabled={selectedQuote.status === 'approved'}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Approve Quote
                    </Button>
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'rejected')}
                      disabled={selectedQuote.status === 'rejected'}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Reject Quote
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'pending')}
                      disabled={selectedQuote.status === 'pending'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Pending
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteQuote(selectedQuote.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Quote
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                      className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        let phone = selectedQuote.phone || '';
                        phone = phone.replace(/\D/g, '');
                        // Kenyan format: 07... or 254...
                        if (phone.startsWith('0')) {
                          phone = '254' + phone.slice(1);
                        } else if (phone.startsWith('254')) {
                          // already correct
                        } else if (phone.startsWith('7')) {
                          phone = '254' + phone;
                        }
                        // fallback: if not 254, use as is
                        const message = encodeURIComponent(`Hello ${selectedQuote.firstName}, regarding your quote for ${selectedQuote.product}: ...`);
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Respond via WhatsApp
                    </Button>
                    <Button
                      className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        const subject = encodeURIComponent(`Your Insurance Quote Request for ${selectedQuote.product}`);
                        const body = encodeURIComponent(`Hello ${selectedQuote.firstName},\n\nThank you for your quote request for ${selectedQuote.product}. ...`);
                        window.open(`mailto:${selectedQuote.email}?subject=${subject}&body=${body}`);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Respond via Email
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Quote Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Quote Status</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedQuote.status} 
                  onValueChange={(value) => setSelectedQuote({...selectedQuote, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => updateQuoteStatus(selectedQuote.id, selectedQuote.status)}
                >
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
