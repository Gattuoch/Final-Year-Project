import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Link2, Bell, Check, Copy } from "lucide-react";

export function ShareLinkDialog({
  shareLinkDialogOpen,
  setShareLinkDialogOpen,
  shareLink,
  linkExpiry,
  setLinkExpiry,
  handleCopyLink
}) {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    handleCopyLink();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={shareLinkDialogOpen} onOpenChange={setShareLinkDialogOpen}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">Share Report Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Link2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 mb-2">Shareable Link</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-white border border-blue-300 rounded">
                  <code className="flex-1 text-xs text-blue-800 break-all bg-gray-50 p-1 rounded">{shareLink}</code>
                  <Button
                    size="sm"
                    variant={isCopied ? "default" : "outline"}
                    onClick={onCopy}
                    className={`shrink-0 h-8 px-3 transition-colors ${isCopied ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'border-blue-300 text-blue-600'}`}
                  >
                    {isCopied ? (
                      <><Check className="w-3.5 h-3.5 mr-1" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="linkExpiry" className="text-sm sm:text-base font-medium">Link Expiration</Label>
            <Select value={linkExpiry} onValueChange={setLinkExpiry}>
              <SelectTrigger id="linkExpiry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="never">Never expire</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              The link will expire {linkExpiry === 'never' ? 'never' : `in ${linkExpiry} day${linkExpiry === '1' ? '' : 's'}`}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <Bell className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 leading-relaxed">
              Anyone with this link can view the report. Make sure to share it only with authorized recipients.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShareLinkDialogOpen(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
