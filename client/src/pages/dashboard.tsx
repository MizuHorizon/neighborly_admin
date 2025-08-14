import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  RefreshCw, 
  Eye, 
  LogOut,
  Search,
  Filter,
  Plus,
  Calendar,
  FileText,
  Car
} from "lucide-react";
import { api } from "@/lib/api";
import { DriverApplication } from "@shared/schema";
import { ApplicationModal } from "../components/application-modal";
import { LoadingOverlay } from "../components/ui/loading-overlay";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: applicationsResponse, isLoading, error } = useQuery({
    queryKey: ["/api/driver-applications", "pending"],
    queryFn: () => api.getDriverApplications("pending"),
  });

  const refreshMutation = useMutation({
    mutationFn: () => api.getDriverApplications("pending"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver-applications"] });
      toast({
        title: "Refreshed",
        description: "Applications list has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh applications list.",
        variant: "destructive",
      });
    },
  });

  const applications = applicationsResponse?.data || [];

  const stats = {
    pending: applications.length,
    approved: 0, // These would come from additional API calls in a real app
    rejected: 0,
    total: applications.length,
  };

  const handleViewApplication = (application: DriverApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">Failed to load driver applications.</p>
            <Button onClick={handleRefresh} disabled={refreshMutation.isPending}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-notion-gray-light">
      {/* Notion-style Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="h-7 w-7 bg-foreground rounded-md flex items-center justify-center">
                <Database className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-base font-semibold text-foreground">Driver Applications</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                <span className="font-medium" data-testid="text-user-name">{user?.name}</span>
              </span>
              <Button 
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0 hover:bg-notion-gray"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Notion-style layout */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Page Title and Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Driver Applications</h2>
              <p className="text-sm text-muted-foreground">Review and manage pending driver applications</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-muted-foreground hover:bg-notion-gray"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-muted-foreground hover:bg-notion-gray"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground hover:bg-notion-gray"
                data-testid="button-refresh"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats - Notion-style inline metrics */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-notion-yellow-dark rounded-full"></div>
              <span>{stats.pending} pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-notion-green-dark rounded-full"></div>
              <span>{stats.approved} approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-notion-red-dark rounded-full"></div>
              <span>{stats.rejected} rejected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-foreground rounded-full"></div>
              <span>{stats.total} total</span>
            </div>
          </div>
        </div>

        {/* Applications Table - Notion-style */}
        <div className="notion-card border-0 shadow-sm">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-12 w-12 bg-notion-gray rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">No pending applications</h3>
              <p className="text-sm text-muted-foreground">All applications have been reviewed</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Driver Information
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Vehicle
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Documents
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Submitted
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-3">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow 
                      key={application.application_id} 
                      className="notion-table-row border-border group"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-notion-blue rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-notion-blue-dark" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground" data-testid={`text-driver-name-${application.application_id}`}>
                              {application.full_name}
                            </div>
                            <div className="text-xs text-muted-foreground">{application.email}</div>
                            <div className="text-xs text-muted-foreground">{application.phone_number}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-notion-purple rounded-lg flex items-center justify-center">
                            <Car className="h-4 w-4 text-notion-purple-dark" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {application.car.car_name} {application.car.car_model}
                            </div>
                            <div className="text-xs text-muted-foreground">{application.car.license_plate}</div>
                            <div className="text-xs text-muted-foreground capitalize">{application.car.car_color}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {application.driving_license_url && (
                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-notion-green text-notion-green-dark text-xs font-medium">
                              <FileText className="h-3 w-3 mr-1" />
                              License
                            </div>
                          )}
                          {application.insurance_document_url && (
                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-notion-blue text-notion-blue-dark text-xs font-medium">
                              <FileText className="h-3 w-3 mr-1" />
                              Insurance
                            </div>
                          )}
                          {application.car_sticker_url && (
                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-notion-purple text-notion-purple-dark text-xs font-medium">
                              <FileText className="h-3 w-3 mr-1" />
                              Sticker
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(application.created_at), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewApplication(application)}
                          className="h-8 px-3 text-foreground hover:bg-notion-gray opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-view-${application.application_id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Application Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
