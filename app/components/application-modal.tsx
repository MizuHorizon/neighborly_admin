'use client'

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink, Send, User, Car, FileText, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { DriverApplication } from "@shared/schema";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ApplicationModalProps {
  application: DriverApplication;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationModal({ application, isOpen, onClose }: ApplicationModalProps) {
  const { toast } = useToast();
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const approveMutation = useMutation({
    mutationFn: () => api.approveApplication(application.application_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver-applications"] });
      toast({
        title: "Application Approved",
        description: "The driver application has been approved successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve the application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => api.rejectApplication(application.application_id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver-applications"] });
      toast({
        title: "Application Rejected",
        description: "The driver application has been rejected.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Rejection Failed",
        description: error instanceof Error ? error.message : "Failed to reject the application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    if (application.status !== "pending") {
      toast({
        title: "Cannot Approve",
        description: "Only pending applications can be approved.",
        variant: "destructive",
      });
      return;
    }
    
    approveMutation.mutate();
  };

  const handleReject = () => {
    if (application.status !== "pending") {
      toast({
        title: "Cannot Reject",
        description: "Only pending applications can be rejected.",
        variant: "destructive",
      });
      return;
    }
    
    if (!showRejectionInput) {
      setShowRejectionInput(true);
      return;
    }

    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    rejectMutation.mutate(rejectionReason);
  };

  const handleViewDocument = (url: string, name: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Document Not Available",
        description: `${name} document is not available.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-notion-lg">
        <div className="bg-white rounded-lg">
          <DialogHeader className="px-6 py-4 border-b border-notion-border">
            <DialogTitle className="text-lg font-semibold text-notion-text">Review Application</DialogTitle>
            <p className="text-sm text-notion-text-muted mt-1">
              {application.full_name} • Submitted {(() => {
                try {
                  return application.created_at ? format(new Date(application.created_at), "MMM dd, yyyy") : "Unknown date";
                } catch {
                  return "Unknown date";
                }
              })()}
            </p>
          </DialogHeader>

          <div className="px-6 py-6 space-y-8">
            {/* Personal Information */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-notion-text">Personal Information</h3>
              </div>
              <div className="bg-notion-gray rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-notion-text-muted" />
                      <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Full Name</span>
                    </div>
                    <p className="text-sm font-medium text-notion-text" data-testid="text-full-name">{application.full_name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-notion-text-muted" />
                      <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Email</span>
                    </div>
                    <p className="text-sm text-notion-text" data-testid="text-email">{application.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-notion-text-muted" />
                      <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Phone Number</span>
                    </div>
                    <p className="text-sm text-notion-text" data-testid="text-phone">{application.phone_number}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-notion-text-muted" />
                      <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Date of Birth</span>
                    </div>
                    <p className="text-sm text-notion-text" data-testid="text-dob">
                      {(() => {
                        try {
                          return application.date_of_birth ? format(new Date(application.date_of_birth), "MMM dd, yyyy") : "Unknown date";
                        } catch {
                          return "Unknown date";
                        }
                      })()}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-notion-text-muted" />
                      <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Address</span>
                    </div>
                    <p className="text-sm text-notion-text" data-testid="text-address">{application.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-notion-text">Vehicle Information</h3>
              </div>
              <div className="bg-notion-gray rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Vehicle</span>
                    <p className="text-sm font-medium text-notion-text" data-testid="text-car-name">
                      {application.car.car_name} {application.car.car_model}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">License Plate</span>
                    <p className="text-sm text-notion-text font-mono" data-testid="text-license-plate">{application.car.license_plate}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Color</span>
                    <p className="text-sm text-notion-text capitalize" data-testid="text-car-color">{application.car.car_color}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-notion-text-muted uppercase tracking-wider">Year</span>
                    <p className="text-sm text-notion-text" data-testid="text-car-year">{application.car.car_year || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-notion-text">Documents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Driving License */}
                <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-notion-black rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-notion-text">Driving License</h4>
                      <p className="text-xs text-notion-text-muted">
                        Expires {(() => {
                          try {
                            return application.driving_license_expiry_date ? format(new Date(application.driving_license_expiry_date), "MMM dd, yyyy") : "Unknown date";
                          } catch {
                            return "Unknown date";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-notion-text hover:bg-notion-gray transition-colors duration-200"
                    onClick={() => handleViewDocument(application.driving_license_url, "Driving License")}
                    data-testid="button-view-license"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>

                {/* Insurance */}
                <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-notion-black rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-notion-text">Insurance</h4>
                      <p className="text-xs text-notion-text-muted">{application.insurance_document_number}</p>
                      <p className="text-xs text-notion-text-muted">
                        Expires {(() => {
                          try {
                            return application.insurance_expiry_date ? format(new Date(application.insurance_expiry_date), "MMM dd, yyyy") : "Unknown date";
                          } catch {
                            return "Unknown date";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-notion-text hover:bg-notion-gray transition-colors duration-200"
                    onClick={() => handleViewDocument(application.insurance_document_url, "Insurance")}
                    data-testid="button-view-insurance"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>

                {/* Car Sticker */}
                <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-notion-black rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-notion-text">Car Sticker</h4>
                      <p className="text-xs text-notion-text-muted">Vehicle identification</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-notion-text hover:bg-notion-gray transition-colors duration-200"
                    onClick={() => handleViewDocument(application.car_sticker_url, "Car Sticker")}
                    data-testid="button-view-sticker"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              </div>
            </div>

            {/* Rejection Reason Input */}
            {showRejectionInput && (
              <div className="bg-notion-gray rounded-lg p-4 border border-notion-border">
                <Label htmlFor="rejectionReason" className="text-sm font-medium text-notion-text mb-3 block">
                  Rejection Reason
                </Label>
                <Textarea
                  id="rejectionReason"
                  rows={3}
                  className="w-full border-notion-border bg-white text-notion-text placeholder:text-notion-text-light focus:border-notion-black focus:ring-notion-black/20 focus:ring-2 transition-all duration-200"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  data-testid="textarea-rejection-reason"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-notion-border bg-notion-gray-light" style={{ position: 'relative', zIndex: 10 }}>
            <div className="flex flex-col sm:flex-row gap-3">
              
              <Button
                className="flex-1 bg-notion-black text-white hover:bg-notion-text-muted shadow-sm transition-colors duration-200"
                onClick={handleApprove}
                disabled={application.status !== "pending" || approveMutation.isPending || rejectMutation.isPending}
                data-testid="button-approve"
                style={{ position: 'relative', zIndex: 20 }}
              >
                {approveMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Approving...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-notion-text-muted text-white hover:bg-notion-text shadow-sm transition-colors duration-200"
                onClick={handleReject}
                disabled={application.status !== "pending" || approveMutation.isPending || rejectMutation.isPending}
                data-testid="button-reject"
                style={{ position: 'relative', zIndex: 20 }}
              >
                {rejectMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rejecting...</span>
                  </div>
                ) : showRejectionInput ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Rejection
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}