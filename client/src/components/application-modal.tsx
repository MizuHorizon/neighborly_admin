import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ExternalLink, Send } from "lucide-react";
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
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "Failed to approve the application. Please try again.",
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
    onError: () => {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject the application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    approveMutation.mutate();
  };

  const handleReject = () => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Driver Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                  <p className="text-sm text-gray-900" data-testid="text-full-name">{application.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm text-gray-900" data-testid="text-email">{application.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
                  <p className="text-sm text-gray-900" data-testid="text-phone">{application.phone_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                  <p className="text-sm text-gray-900" data-testid="text-dob">
                    {format(new Date(application.date_of_birth), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Address</Label>
                  <p className="text-sm text-gray-900" data-testid="text-address">{application.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Vehicle Information</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Car Name</Label>
                  <p className="text-sm text-gray-900" data-testid="text-car-name">{application.car.car_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Model</Label>
                  <p className="text-sm text-gray-900" data-testid="text-car-model">{application.car.car_model}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">License Plate</Label>
                  <p className="text-sm text-gray-900" data-testid="text-license-plate">{application.car.license_plate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Color</Label>
                  <p className="text-sm text-gray-900" data-testid="text-car-color">{application.car.car_color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Driving License */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Driving License</h5>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Expiry: {format(new Date(application.driving_license_expiry_date), "MMM dd, yyyy")}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => handleViewDocument(application.driving_license_url, "Driving License")}
                    data-testid="button-view-license"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Insurance</h5>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Number: {application.insurance_document_number}</p>
                  <p className="text-sm text-gray-600">
                    Expiry: {format(new Date(application.insurance_expiry_date), "MMM dd, yyyy")}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => handleViewDocument(application.insurance_document_url, "Insurance")}
                    data-testid="button-view-insurance"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              </div>

              {/* Car Sticker */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Car Sticker</h5>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Status: Uploaded</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100"
                    onClick={() => handleViewDocument(application.car_sticker_url, "Car Sticker")}
                    data-testid="button-view-sticker"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason Input */}
          {showRejectionInput && (
            <div>
              <Label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </Label>
              <Textarea
                id="rejectionReason"
                rows={3}
                className="w-full"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                data-testid="textarea-rejection-reason"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              className="flex-1 bg-success text-white hover:bg-green-600"
              onClick={handleApprove}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              data-testid="button-approve"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {approveMutation.isPending ? "Approving..." : "Approve Application"}
            </Button>
            <Button
              className="flex-1 bg-danger text-white hover:bg-red-600"
              onClick={handleReject}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              data-testid="button-reject"
            >
              {showRejectionInput ? (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {rejectMutation.isPending ? "Rejecting..." : "Submit Rejection"}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
