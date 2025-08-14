'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, CheckCircle2, XCircle, Clock, LogOut, Eye } from "lucide-react";
import { DriverApplication } from "@shared/schema";
import { api } from "@/lib/api";
import { ApplicationModal } from "@/components/application-modal";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: applications, isLoading, error } = useQuery<DriverApplication[]>({
    queryKey: ["/api/driver-applications"],
    queryFn: () => api.getDriverApplications(),
  });

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(app => app.status === "pending").length || 0,
    approved: applications?.filter(app => app.status === "approved").length || 0,
    rejected: applications?.filter(app => app.status === "rejected").length || 0,
  };

  const handleViewApplication = (application: DriverApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-foreground rounded-lg flex items-center justify-center mx-auto">
            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Loading Dashboard...</h2>
            <p className="text-sm text-muted-foreground">Fetching driver applications</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Error Loading Dashboard</h2>
            <p className="text-sm text-muted-foreground">Failed to fetch driver applications. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-notion-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-foreground rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Neighborly Admin</h1>
                <p className="text-sm text-muted-foreground">Driver Application Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role} Access</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-gray-300 hover:bg-gray-50"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="notion-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="notion-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600" data-testid="stat-pending">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="notion-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="stat-approved">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="notion-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="stat-rejected">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="notion-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Driver Applications</CardTitle>
            <p className="text-sm text-muted-foreground">Review and manage driver applications for Neighborly</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-medium text-muted-foreground">Driver</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Contact</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Vehicle</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="font-medium text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((application) => (
                  <TableRow key={application.application_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-foreground" data-testid={`text-name-${application.application_id}`}>
                          {application.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {application.application_id?.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="text-sm text-foreground">{application.email}</div>
                        <div className="text-sm text-muted-foreground">{application.phone_number}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-foreground">
                          {application.car.car_name} {application.car.car_model}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {application.car.license_plate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplication(application)}
                        className="border-gray-300 hover:bg-gray-50"
                        data-testid={`button-review-${application.application_id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {applications?.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Applications Found</h3>
                <p className="text-muted-foreground">There are currently no driver applications to review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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