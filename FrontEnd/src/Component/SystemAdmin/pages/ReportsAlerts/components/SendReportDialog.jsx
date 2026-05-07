import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Switch } from "../../../ui/switch";
import { Calendar, RefreshCw, Send } from "lucide-react";

export function SendReportDialog({
  sendDialogOpen,
  setSendDialogOpen,
  emailRecipients,
  setEmailRecipients,
  exportFormat,
  setExportFormat,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  scheduleEnabled,
  setScheduleEnabled,
  scheduleFrequency,
  setScheduleFrequency,
  scheduledRecipients,
  setScheduledRecipients,
  isSending,
  handleSendReport
}) {
  return (
    <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Send Report via Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="recipients" className="text-sm sm:text-base font-medium flex items-center gap-2">
              Recipients <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              id="recipients"
              placeholder="Enter email addresses separated by commas (e.g. user@example.com)"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              className={`text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 ${!emailRecipients && 'bg-orange-50/30'}`}
              disabled={isSending}
            />
            <p className="text-xs text-gray-500 italic">Separate multiple addresses with commas</p>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="format" className="text-sm sm:text-base font-medium">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat} disabled={isSending}>
              <SelectTrigger id="format" className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document (High Fidelity)</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (Raw Data)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="subject" className="text-sm sm:text-base font-medium flex items-center gap-2">
              Email Subject <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="body" className="text-sm sm:text-base font-medium">Email Message Body</Label>
            <Textarea
              id="body"
              rows={5}
              placeholder="Add an optional message to the recipients..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isSending}
            />
          </div>

          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${scheduleEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${scheduleEnabled ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <Calendar className={`w-5 h-5 ${scheduleEnabled ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${scheduleEnabled ? 'text-blue-900' : 'text-gray-700'}`}>Schedule Recurring Delivery</p>
                <p className="text-xs text-gray-500">Automate this report for the future</p>
              </div>
            </div>
            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} disabled={isSending} />
          </div>

          {scheduleEnabled && (
            <div className="space-y-3 p-3 sm:p-4 border border-blue-200 rounded-lg bg-white shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="frequency" className="text-sm sm:text-base font-medium">Delivery Frequency</Label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency} disabled={isSending}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (Every morning at 8 AM)</SelectItem>
                    <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                    <SelectItem value="monthly">Monthly (1st of the month)</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="scheduledRecipients" className="text-sm sm:text-base font-medium flex items-center gap-2">
                  Scheduled Recipients <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="scheduledRecipients"
                  placeholder="Emails for future automated reports"
                  value={scheduledRecipients}
                  onChange={(e) => setScheduledRecipients(e.target.value)}
                  className="text-sm border-gray-300 focus:ring-2 focus:ring-blue-500"
                  disabled={isSending}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setSendDialogOpen(false)} disabled={isSending} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSendReport} disabled={isSending} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            {isSending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {isSending ? "Sending..." : "Send Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
