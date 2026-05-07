import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../../services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import { ReportsTab } from "./components/ReportsTab";
import { ScheduledTab } from "./components/ScheduledTab";
import { SendAlertsTab } from "./components/SendAlertsTab";
import { TemplatesTab } from "./components/TemplatesTab";
import { HistoryTab } from "./components/HistoryTab";
import { SendReportDialog } from "./components/SendReportDialog";
import { ShareLinkDialog } from "./components/ShareLinkDialog";
import { CreateScheduleDialog } from "./components/CreateScheduleDialog";
import { CreateTemplateDialog } from "./components/CreateTemplateDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";

export function ReportsAlerts() {
  // ── Data state ──
  const [reportTemplates, setReportTemplates] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [uptimeData, setUptimeData] = useState([]);
  const [metrics, setMetrics] = useState({ systemUptime: "...", apiResponseTime: "...", errorRate: "..." });
  const [resourceUtilization, setResourceUtilization] = useState({ cpu: { average: "...", peak: "..." }, memory: { average: "...", peak: "..." }, disk: { read: "...", write: "..." }, network: { inbound: "...", outbound: "..." } });
  const [alertTemplates, setAlertTemplates] = useState([]);
  const [deliveryStatistics, setDeliveryStatistics] = useState({ schedules: 0, reportsSent: 0, recipients: 0, successRate: "0%" });
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledReports, setScheduledReports] = useState([]);

  // ── Dialog / form state ──
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertRecipients, setAlertRecipients] = useState("all");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [scheduledRecipients, setScheduledRecipients] = useState("");
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkExpiry, setLinkExpiry] = useState("7");
  const [activeTab, setActiveTab] = useState("reports");
  const [isSending, setIsSending] = useState(false);
  const [generatingReportId, setGeneratingReportId] = useState(null);
  const [createScheduleDialogOpen, setCreateScheduleDialogOpen] = useState(false);
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });
  const [deliveryMethods, setDeliveryMethods] = useState({ email: true, sms: true, inApp: true });

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    
    // Handle Axios error structure
    if (error.response) {
      const data = error.response.data;
      
      // If data is a Blob (common in PDF exports), we'll use fallback
      if (data instanceof Blob) {
        return fallback || "An error occurred while processing the file.";
      }
      
      return data?.message || data?.error || (typeof data === 'string' ? data : fallback);
    } else if (error.request) {
      return "Connection error: No response from the server.";
    }
    
    return error.message || fallback || "An unexpected error occurred.";
  };

  // ── Fetch all data ──
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/sysadmin/reports");
      if (res.data?.success) {
        const d = res.data.data;
        setReportTemplates(d.reportTemplates || []);
        setAlertHistory(d.alertHistory || []);
        setUptimeData(d.uptimeData || []);
        if (d.metrics) setMetrics(d.metrics);
        if (d.resourceUtilization) setResourceUtilization(d.resourceUtilization);
        setAlertTemplates(d.alertTemplates || []);
        setScheduledReports(d.scheduledReports || []);
        if (d.deliveryStatistics) setDeliveryStatistics(d.deliveryStatistics);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load reports data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Handlers ──
  const handleGenerateReport = async (id) => {
    if (!id) {
      toast.error("No report selected. Please try again.");
      return;
    }

    const promise = async () => {
      setGeneratingReportId(id);
      const res = await api.post(`/sysadmin/reports/generate/${id}`);
      fetchData();
      return res.data.message || "Report generation started";
    };

    toast.promise(promise(), {
      loading: 'Generating PDF report...',
      success: (message) => {
        setGeneratingReportId(null);
        return message;
      },
      error: (err) => {
        setGeneratingReportId(null);
        return getErrorMessage(err, "Failed to generate report");
      }
    });
  };

  const handleOpenSendDialog = (reportId, reportName) => {
    setSelectedReport(reportId);
    setEmailSubject(`${reportName} - ${new Date().toLocaleDateString()}`);
    setEmailBody(`Please find the attached ${reportName} for your review.\n\nThis report was generated on ${new Date().toLocaleString()}.\n\nBest regards,\nEthioCampGround Admin Team`);
    setSendDialogOpen(true);
  };

  const handleSendReport = async () => {
    if (!selectedReport) {
      toast.error("No report selected. Please select a report first.");
      return;
    }
    
    // Validate main recipients
    if (!emailRecipients.trim()) {
      toast.error("Please enter at least one recipient email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipientsList = emailRecipients.split(',').map(email => email.trim()).filter(email => email);
    const invalidEmails = recipientsList.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email format detected: ${invalidEmails.join(', ')}`);
      return;
    }

    // Validate scheduled recipients if enabled
    if (scheduleEnabled && !scheduledRecipients.trim()) {
      toast.error("Please enter recipient emails for the scheduled delivery");
      return;
    }

    if (scheduleEnabled) {
      const scheduledList = scheduledRecipients.split(',').map(email => email.trim()).filter(email => email);
      const invalidScheduled = scheduledList.filter(email => !emailRegex.test(email));
      if (invalidScheduled.length > 0) {
        toast.error(`Invalid scheduled email format: ${invalidScheduled.join(', ')}`);
        return;
      }
    }

    if (!emailSubject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }

    const promise = async () => {
      const payload = {
        reportId: selectedReport,
        recipients: emailRecipients,
        subject: emailSubject.trim(),
        body: emailBody.trim(),
        format: exportFormat,
      };

      // 1. Send the immediate report
      const res = await api.post("/sysadmin/reports/send", payload);

      // 2. Handle scheduling if enabled
      if (scheduleEnabled) {
        const schedulePayload = {
          reportId: selectedReport,
          recipients: scheduledRecipients.trim(),
          frequency: scheduleFrequency,
          format: exportFormat,
        };
        await api.post("/sysadmin/reports/schedule", schedulePayload);
      }
      
      return res.data?.message || "Report sent successfully!";
    };

    toast.promise(promise(), {
      loading: 'Sending report via email...',
      success: (message) => {
        setSendDialogOpen(false);
        setEmailRecipients("");
        setEmailSubject("");
        setEmailBody("");
        setScheduleEnabled(false);
        setScheduledRecipients("");
        fetchData();
        return message;
      },
      error: (err) => {
        const errorMsg = getErrorMessage(err, "Failed to send report.");
        if (errorMsg.includes("transport is not configured")) {
          return "Mail server not configured. Please check .env file.";
        }
        return errorMsg;
      }
    });
    setIsSending(false);
  };

  const handleExportReport = async (reportId, format) => {
    if (!reportId) {
      toast.error("No report selected. Please select a report first.");
      return;
    }
    try {
      toast.success(`Exporting report as ${format.toUpperCase()}...`);
      const res = await api.get(`/sysadmin/reports/export/${reportId}?format=${format}`, {
        responseType: 'blob'
      });

      if (res.data) {
        // Double check if it's actually an error returned as a blob
        if (res.data.type === 'application/json') {
          const text = await res.data.text();
          const json = JSON.parse(text);
          if (json.success === false) {
            toast.error(json.message || "Failed to export report");
            return;
          }
        }

        const blob = new Blob([res.data], {
          type: format === 'pdf' ? 'application/pdf' :
                format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                'text/csv'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Try to get filename from content-disposition header if available
        const contentDisposition = res.headers?.['content-disposition'];
        let fileName = `report.${format}`;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Report downloaded as ${format.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Export error:", err);
      let message = "Failed to export report";
      
      // Handle Blob error response
      if (err.response?.data instanceof Blob && err.response.data.type === 'application/json') {
        try {
          const text = await err.response.data.text();
          const errorData = JSON.parse(text);
          message = errorData.message || errorData.error || message;
        } catch (e) {
          console.error("Error parsing blob error:", e);
        }
      } else {
        message = getErrorMessage(err, message);
      }
      
      toast.error(message);
    }
  };

  const handleGenerateShareLink = async (reportId) => {
    if (!reportId) {
      toast.error("No report selected. Please select a report first.");
      return;
    }
    try {
      const res = await api.post(`/sysadmin/reports/share/${reportId}`, { expiryDays: linkExpiry });
      if (res.data?.success) {
        setShareLink(res.data.shareLink);
        setShareLinkDialogOpen(true);
        toast.success("Shareable link generated!");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to generate share link"));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      } catch (fallbackErr) {
        toast.error("Failed to copy link. Please copy manually.");
      }
    }
  };

  const handleSendAlert = async () => {
    if (!alertTitle || !alertMessage) {
      toast.error("Please enter both a title and a message.");
      return;
    }
    
    const activeMethods = Object.keys(deliveryMethods).filter(k => deliveryMethods[k]);
    if (activeMethods.length === 0) {
      toast.error("Please select at least one delivery method (Email, SMS, or In-App).");
      return;
    }

    const promise = async () => {
      const res = await api.post("/sysadmin/reports/alert", {
        title: alertTitle,
        message: alertMessage,
        recipients: alertRecipients,
        methods: activeMethods
      });
      return res.data.message || `Alert sent successfully via ${activeMethods.join(', ')}`;
    };

    toast.promise(promise(), {
      loading: 'Broadcasting system alert...',
      success: (msg) => {
        setAlertTitle("");
        setAlertMessage("");
        fetchData();
        return msg;
      },
      error: (err) => getErrorMessage(err, "Failed to send alert")
    });
  };

  const handleCreateAlertTemplate = async (templateData) => {
    try {
      const res = await api.post("/sysadmin/reports/alert-template", templateData);
      toast.success(res.data.message || "Template created!");
      fetchData();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create template"));
      return false;
    }
  };

  const handleUpdateAlertTemplate = async (id, templateData) => {
    try {
      const res = await api.patch(`/sysadmin/reports/alert-template/${id}`, templateData);
      toast.success(res.data.message || "Template updated!");
      fetchData();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update template"));
      return false;
    }
  };

  const handleUseTemplate = (template) => {
    setAlertTitle(template.title);
    setAlertMessage(template.message);
    setActiveTab("alerts"); // Switch to Send Alerts tab
    toast.success(`Template "${template.title}" loaded!`);
  };

  const handleScheduleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Paused" : "Active";
      const res = await api.patch(`/sysadmin/reports/schedule/${id}/status`, { status: newStatus });
      toast.success(res.data.message || `Schedule ${newStatus.toLowerCase()}`);
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update schedule"));
    }
  };

  const handleDeleteSchedule = (id) => {
    setItemToDelete({ id, type: "schedule" });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteAlertTemplate = (id) => {
    setItemToDelete({ id, type: "template" });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { id, type } = itemToDelete;
    if (!id || !type) return;

    try {
      if (type === "schedule") {
        const res = await api.delete(`/sysadmin/reports/schedule/${id}`);
        toast.success(res.data.message || "Schedule deleted");
      } else {
        const res = await api.delete(`/sysadmin/reports/alert-template/${id}`);
        toast.success(res.data.message || "Template deleted");
      }
      setDeleteConfirmOpen(false);
      setItemToDelete({ id: null, type: null });
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to delete ${type}`));
    }
  };

  const handleCreateSchedule = async (scheduleData) => {
    try {
      const res = await api.post("/sysadmin/reports/schedule", scheduleData);
      toast.success(res.data.message || "Schedule created successfully");
      fetchData();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create schedule"));
      return false;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Alerts</h1>
        <p className="text-sm sm:text-base text-gray-500">Generate technical reports and send notifications</p>
      </div>

      {/* Mobile-friendly tabs with horizontal scroll */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex w-auto min-w-full sm:w-full">
              <TabsTrigger value="reports" className="text-sm sm:text-base whitespace-nowrap">Reports</TabsTrigger>
              <TabsTrigger value="scheduled" className="text-sm sm:text-base whitespace-nowrap">Scheduled</TabsTrigger>
              <TabsTrigger value="alerts" className="text-sm sm:text-base whitespace-nowrap">Send Alerts</TabsTrigger>
              <TabsTrigger value="templates" className="text-sm sm:text-base whitespace-nowrap">Templates</TabsTrigger>
              <TabsTrigger value="history" className="text-sm sm:text-base whitespace-nowrap">History</TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <ReportsTab
                reportTemplates={reportTemplates}
                isLoading={isLoading}
                metrics={metrics}
                uptimeData={uptimeData}
                resourceUtilization={resourceUtilization}
                generatingReportId={generatingReportId}
                handleOpenSendDialog={handleOpenSendDialog}
                handleGenerateShareLink={handleGenerateShareLink}
                handleExportReport={handleExportReport}
                handleGenerateReport={handleGenerateReport}
              />
            </TabsContent>

            <TabsContent value="scheduled">
              <ScheduledTab
                isLoading={isLoading}
                scheduledReports={scheduledReports}
                deliveryStatistics={deliveryStatistics}
                setCreateScheduleDialogOpen={setCreateScheduleDialogOpen}
                handleScheduleStatus={handleScheduleStatus}
                handleDeleteSchedule={handleDeleteSchedule}
              />
            </TabsContent>

            <TabsContent value="alerts">
              <SendAlertsTab
                alertTitle={alertTitle}
                setAlertTitle={setAlertTitle}
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
                alertRecipients={alertRecipients}
                setAlertRecipients={setAlertRecipients}
                deliveryMethods={deliveryMethods}
                setDeliveryMethods={setDeliveryMethods}
                handleSendAlert={handleSendAlert}
              />
            </TabsContent>

            <TabsContent value="templates">
              <TemplatesTab
                isLoading={isLoading}
                alertTemplates={alertTemplates}
                setCreateTemplateDialogOpen={setCreateTemplateDialogOpen}
                setEditingTemplate={setEditingTemplate}
                handleDeleteAlertTemplate={handleDeleteAlertTemplate}
                handleUseTemplate={handleUseTemplate}
              />
            </TabsContent>

            <TabsContent value="history">
              <HistoryTab alertHistory={alertHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SendReportDialog
        sendDialogOpen={sendDialogOpen}
        setSendDialogOpen={setSendDialogOpen}
        emailRecipients={emailRecipients}
        setEmailRecipients={setEmailRecipients}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        scheduleEnabled={scheduleEnabled}
        setScheduleEnabled={setScheduleEnabled}
        scheduleFrequency={scheduleFrequency}
        setScheduleFrequency={setScheduleFrequency}
        scheduledRecipients={scheduledRecipients}
        setScheduledRecipients={setScheduledRecipients}
        isSending={isSending}
        handleSendReport={handleSendReport}
      />

      <ShareLinkDialog
        shareLinkDialogOpen={shareLinkDialogOpen}
        setShareLinkDialogOpen={setShareLinkDialogOpen}
        shareLink={shareLink}
        linkExpiry={linkExpiry}
        setLinkExpiry={setLinkExpiry}
        handleCopyLink={handleCopyLink}
      />

      <CreateScheduleDialog
        isOpen={createScheduleDialogOpen}
        onOpenChange={setCreateScheduleDialogOpen}
        reportTemplates={reportTemplates}
        handleCreateSchedule={handleCreateSchedule}
      />

      <CreateTemplateDialog
        isOpen={createTemplateDialogOpen || !!editingTemplate}
        onOpenChange={(open) => {
          setCreateTemplateDialogOpen(open);
          if (!open) setEditingTemplate(null);
        }}
        editingTemplate={editingTemplate}
        handleCreateAlertTemplate={handleCreateAlertTemplate}
        handleUpdateAlertTemplate={handleUpdateAlertTemplate}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={itemToDelete.type === "schedule" ? "Delete Schedule" : "Delete Template"}
        description={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`}
      />
    </div>
  );
}
