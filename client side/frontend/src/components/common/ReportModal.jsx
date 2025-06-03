import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSpinner, FaExclamationTriangle, FaFlag } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import { toast } from 'react-toastify';

const ReportModal = ({ isOpen, onClose, announcementId }) => {
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ setShowConfirmation] = useState(true);

  if (!isOpen) return null;

  const handleCancel = () => {
    // Reset the state and close the modal
    setReportReason("");
    setReportDescription("");
    setShowConfirmation(true);
    onClose();
  };

  const handleSubmit = async () => {
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(API_PATHS.REPORTS.REPORT_ANNOUNCEMENT, {
        announcementId,
        reason: reportReason,
        description: reportDescription
      });
      
      toast.success(response.data.message || "Announcement reported successfully");
      
      // Reset form
      setReportReason("");
      setReportDescription("");
      setShowConfirmation(true);
      onClose();
    } catch (error) {
      console.error("Error reporting announcement:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Could not report announcement. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Full report form
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Report Announcement</h2>
          <button 
            onClick={handleCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="mb-4 text-gray-600">
          Please let us know why you think this announcement violates our community guidelines.
        </p>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a reason:
          </label>
          <div className="space-y-2">
            {[
              "Inappropriate content",
              "Scam or fraud",
              "Prohibited items",
              "Duplicate listing",
              "Other"
            ].map((reason) => (
              <div 
                key={reason}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  reportReason === reason 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-200 hover:bg-gray-50'
                }`}
                onClick={() => setReportReason(reason)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    reportReason === reason 
                      ? 'border-teal-500' 
                      : 'border-gray-300'
                  }`}>
                    {reportReason === reason && (
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    )}
                  </div>
                  <span className="ml-3 font-medium text-gray-800">{reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="reportDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Additional details (optional):
          </label>
          <textarea
            id="reportDescription"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Please provide more information about the issue..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            rows={3}
          ></textarea>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-white ${
              isSubmitting 
                ? 'bg-teal-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700'
            } transition-all flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ReportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  announcementId: PropTypes.string.isRequired
};

export default ReportModal;