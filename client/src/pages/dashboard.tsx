import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Clock, CheckCircle, XCircle, Users, RefreshCw, Eye, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { DriverApplication } from "@shared/schema";
import { ApplicationModal } from "@/components/application-modal";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Neighborly Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium" data-testid="text-user-name">{user?.name}</span>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-pending-count">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Approved</h3>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-approved-count">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-danger" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-rejected-count">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Total</h3>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-count">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Pending Driver Applications
              </CardTitle>
              <Button 
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
                size="sm"
                data-testid="button-refresh"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                <p className="text-gray-600">There are currently no pending driver applications to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.application_id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900" data-testid={`text-driver-name-${application.application_id}`}>
                                {application.full_name}
                              </div>
                              <div className="text-sm text-gray-500">{application.email}</div>
                              <div className="text-sm text-gray-500">{application.phone_number}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            <div>{application.car.car_name} {application.car.car_model}</div>
                            <div className="text-gray-500">{application.car.license_plate}</div>
                            <div className="text-gray-500">{application.car.car_color}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {application.driving_license_url && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                License
                              </Badge>
                            )}
                            {application.insurance_document_url && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Insurance
                              </Badge>
                            )}
                            {application.car_sticker_url && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                Sticker
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {format(new Date(application.created_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleViewApplication(application)}
                            data-testid={`button-view-${application.application_id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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
