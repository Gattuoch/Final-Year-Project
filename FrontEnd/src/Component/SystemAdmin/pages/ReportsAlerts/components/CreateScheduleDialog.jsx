import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Calendar, Users, FileText } from "lucide-react";

export function CreateScheduleDialog({
  isOpen,
  onOpenChange,
  reportTemplates,
  handleCreateSchedule
}) {
  const [reportId, setReportId] = useState("");
  const [recipients, setRecipients] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [format, setFormat] = useState("pdf");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportId || !recipients) {
      return;
    }
    setIsSubmitting(true);
    const success = await handleCreateSchedule({
      reportId,
      recipients,
      frequency,
      format
    });
    setIsSubmitting(false);
    if (success) {
      onOpenChange(false);
      setReportId("");
      setRecipients("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Create New Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reportSelect" className="text-sm font-medium">Select Report</Label>
            <Select value={reportId} onValueChange={setReportId}>
              <SelectTrigger id="reportSelect">
                <SelectValue placeholder="Choose a report template" />
              </SelectTrigger>
              <SelectContent>
                {reportTemplates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedRecipients" className="text-sm font-medium">Recipients</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="schedRecipients"
                placeholder="email1@example.com, email2@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic">Separate multiple emails with commas</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedFreq" className="text-sm font-medium">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="schedFreq">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedFormat" className="text-sm font-medium">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="schedFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">Cancel</Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none" 
            onClick={handleSubmit}
            disabled={isSubmitting || !reportId || !recipients}
          >
            {isSubmitting ? "Creating..." : "Create Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
