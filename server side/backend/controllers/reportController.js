import Report from "../models/report.js";
import Annonce from "../models/annonce.js";

// Submit a report for an announcement
export const reportAnnouncement = async (req, res) => {
  try {
    const { announcementId, reason, details } = req.body;
    const userId = req.user._id;

    // Check if the announcement exists
    const announcement = await Annonce.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    // Check if user has already reported this announcement
    const existingReport = await Report.findOne({
      announcement: announcementId,
      reportedBy: userId
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this announcement"
      });
    }

    // Create new report
    const newReport = new Report({
      announcement: announcementId,
      reportedBy: userId,
      reason,
      details
    });

    await newReport.save();

    // Count total reports for this announcement
    const reportCount = await Report.countDocuments({ announcement: announcementId });

    // If report count reaches 5 or more, delete the announcement
    if (reportCount >= 5) {
      await Annonce.findByIdAndDelete(announcementId);
      return res.status(200).json({
        success: true,
        message: "Report submitted successfully. The announcement has been removed due to multiple reports."
      });
    }

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: newReport
    });
  } catch (error) {
    console.error("Error reporting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error reporting announcement",
      error: error.message
    });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    // Paginate reports
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .populate('announcement', 'title')
      .populate('reportedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await Report.countDocuments();

    res.status(200).json({
      success: true,
      count: reports.length,
      total: totalReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
      data: reports
    });
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({
      success: false,
      message: "Error getting reports",
      error: error.message
    });
  }
}; 