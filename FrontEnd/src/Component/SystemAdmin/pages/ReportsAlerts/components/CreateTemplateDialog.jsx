import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { FilePlus, Edit } from "lucide-react";

export function CreateTemplateDialog({
  isOpen,
  onOpenChange,
  editingTemplate,
  handleCreateAlertTemplate,
  handleUpdateAlertTemplate
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTemplate) {
      setTitle(editingTemplate.title);
      setMessage(editingTemplate.message);
    } else {
      setTitle("");
      setMessage("");
    }
  }, [editingTemplate, isOpen]);

  const handleSubmit = async () => {
    if (!title || !message) return;
    setIsSubmitting(true);
    
    let success = false;
    if (editingTemplate) {
      success = await handleUpdateAlertTemplate(editingTemplate._id, { title, message });
    } else {
      success = await handleCreateAlertTemplate({ title, message });
    }

    setIsSubmitting(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {editingTemplate ? (
              <><Edit className="w-5 h-5 text-blue-600" /> Edit Alert Template</>
            ) : (
              <><FilePlus className="w-5 h-5 text-blue-600" /> Create Alert Template</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tmpl-title" className="text-sm font-medium">Template Title</Label>
            <Input
              id="tmpl-title"
              placeholder="e.g., Weekly Server Maintenance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tmpl-message" className="text-sm font-medium">Template Message</Label>
            <Textarea
              id="tmpl-message"
              placeholder="Enter the notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="text-sm"
            />
            <p className="text-[10px] text-gray-500 italic">You can use placeholders like [DATE] or [TIME]</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none" 
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !message}
          >
            {isSubmitting ? "Creating..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
