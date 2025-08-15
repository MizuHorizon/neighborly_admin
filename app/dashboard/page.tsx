'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, CheckCircle2, XCircle, Clock, LogOut, Eye, CreditCard, Filter } from "lucide-react";
import { DriverApplication } from "@shared/schema";
import { api } from "@/lib/api";
import { ApplicationModal } from "@/components/application-modal";
import { useAuth } from "@/hooks/use-auth";
import { ApiResponse } from "@shared/schema";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stripeFilter, setStripeFilter] = useState<string>("all");

  const { data: applicationsResponse, isLoading, error } = useQuery<ApiResponse<DriverApplication[]>>({
    queryKey: ["/api/driver-applications"],
    queryFn: () => api.getDriverApplications(),
  });

  // Extract the applications array from the API response
  const applications = applicationsResponse?.data || [];

  // Apply filters
  const filteredApplications = applications.filter(app => {
    const statusMatch = statusFilter === "all" || app.status === statusFilter;
    const stripeMatch = stripeFilter === "all" || 
      (stripeFilter === "connected" && app.stripe_connect_account_id) ||
      (stripeFilter === "not-connected" && !app.stripe_connect_account_id);
    
    return statusMatch && stripeMatch;
  });

  const stats = {
    total: applications.length || 0,
    pending: applications.filter(app => app.status === "pending").length || 0,
    approved: applications.filter(app => app.status === "approved").length || 0,
    rejected: applications.filter(app => app.status === "rejected").length || 0,
    stripeConnected: applications.filter(app => app.stripe_connect_account_id).length || 0,
  };

  const handleViewApplication = (application: DriverApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleApplicationUpdate = (updatedApplication: DriverApplication) => {
    setSelectedApplication(updatedApplication);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-notion-gray text-notion-text border-notion-border hover:bg-notion-gray-dark transition-colors duration-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-notion-black text-white border-notion-black hover:bg-notion-text-light transition-colors duration-200"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-notion-gray text-notion-text border-notion-border hover:bg-notion-gray-dark transition-colors duration-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-notion-text-muted border-notion-border">{status}</Badge>;
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
      <div className="bg-white border-b border-notion-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-notion-black rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-notion-text">Neighborly Admin</h1>
                <p className="text-sm text-notion-text-muted">Driver Application Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-notion-text">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-notion-text-muted capitalize">{user?.role} Access</p>
                  {user?.admin_verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-notion-border hover:bg-notion-gray text-notion-text hover:text-notion-text transition-colors duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border border-notion-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-notion-text-muted">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-notion-text-light" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-notion-text" data-testid="stat-total">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-notion-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-notion-text-muted">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-notion-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-notion-text" data-testid="stat-pending">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-notion-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-notion-text-muted">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-notion-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-notion-text" data-testid="stat-approved">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-notion-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-notion-text-muted">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-notion-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-notion-text" data-testid="stat-rejected">{stats.rejected}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-notion-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-notion-text-muted">Stripe Connected</CardTitle>
              <CreditCard className="h-4 w-4 text-notion-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-notion-text" data-testid="stat-stripe-connected">{stats.stripeConnected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="bg-white border border-notion-border rounded-lg shadow-sm">
          <CardHeader className="border-b border-notion-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-lg font-semibold text-notion-text">Driver Applications</CardTitle>
                <p className="text-sm text-notion-text-muted">Review and manage driver applications for Neighborly</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-notion-text-muted" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 border-notion-border">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-notion-text-muted" />
                  <Select value={stripeFilter} onValueChange={setStripeFilter}>
                    <SelectTrigger className="w-36 border-notion-border">
                      <SelectValue placeholder="Stripe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="connected">Stripe Connected</SelectItem>
                      <SelectItem value="not-connected">Not Connected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-notion-text-muted">
              Showing {filteredApplications.length} of {applications.length} applications
              {statusFilter !== "all" && ` • Status: ${statusFilter}`}
              {stripeFilter !== "all" && ` • Stripe: ${stripeFilter === "connected" ? "Connected" : "Not Connected"}`}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-notion-border bg-notion-gray">
                  <TableHead className="font-medium text-notion-text-muted py-3">Driver</TableHead>
                  <TableHead className="font-medium text-notion-text-muted py-3">Contact</TableHead>
                  <TableHead className="font-medium text-notion-text-muted py-3">Vehicle</TableHead>
                  <TableHead className="font-medium text-notion-text-muted py-3">Status</TableHead>
                  <TableHead className="font-medium text-notion-text-muted py-3">Stripe Connect</TableHead>
                  <TableHead className="font-medium text-notion-text-muted py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications?.map((application) => (
                  <TableRow key={application.application_id} className="border-b border-notion-border hover:bg-notion-gray transition-colors duration-150">
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-notion-text" data-testid={`text-name-${application.application_id}`}>
                          {application.full_name}
                        </div>
                        <div className="text-sm text-notion-text-muted">
                          ID: {application.application_id?.slice(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="text-sm text-notion-text">{application.email}</div>
                        <div className="text-sm text-notion-text-muted">{application.phone_number}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium text-notion-text">
                          {application.car?.car_name} {application.car?.car_model}
                        </div>
                        <div className="text-sm text-notion-text-muted font-mono">
                          {application.car?.license_plate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell className="py-4">
                      {application.stripe_connect_account_id ? (
                        <div className="flex items-center space-x-2">
                          {application.stripe_onboarding_completed ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          <span className="text-xs text-notion-text-muted font-mono">
                            {application.stripe_connect_account_id?.slice(0, 8)}...
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-notion-text-muted">Not Connected</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplication(application)}
                        className="border-notion-border hover:bg-notion-gray text-notion-text hover:text-notion-text transition-colors duration-150"
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

            {filteredApplications?.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-notion-text-light mx-auto mb-4" />
                <h3 className="text-lg font-medium text-notion-text mb-2">No Applications Found</h3>
                <p className="text-notion-text-muted">There are currently no driver applications to review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        key={selectedApplication?.application_id || 'no-application'}
        application={selectedApplication || null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onApplicationUpdate={handleApplicationUpdate}
      />
    </div>
  );
}