import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Ban, ShieldAlert, Trash2, Clock, Plus, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../ui/dialog";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import api from "../../../../../services/api";

export function IPBlacklist({ blockedIPs, onUpdate, isLoading }) {
  const [newBlockedIP, setNewBlockedIP] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    if (error.response) {
      const data = error.response.data;
      return data?.message || data?.error || (typeof data === 'string' ? data : fallback);
    } else if (error.request) {
      return "Connection error: No response from the server.";
    }
    return error.message || fallback || "An unexpected error occurred.";
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    const date = new Date(ts);
    const pad = (n) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  };

  const handleBlockIP = async () => {
    if (!newBlockedIP) {
      toast.error("Please enter an IP address");
      return;
    }

    // Basic IP validation regex
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(newBlockedIP)) {
      toast.error("Please enter a valid IP address (e.g., 192.168.1.1)");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await api.post("/sysadmin/security/ip", { 
        ip: newBlockedIP, 
        reason: newBlockReason || "Admin manually blocked" 
      });
      toast.success(res.data.message || `IP address ${newBlockedIP} has been blocked`);
      setNewBlockedIP("");
      setNewBlockReason("");
      setIsDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to block IP"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      setIsProcessing(true);
      const res = await api.post("/sysadmin/security/ip/unblock", { ip });
      toast.success(res.data.message || `IP address ${ip} has been unblocked`);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to unblock IP"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
          <div className="flex items-start sm:items-center gap-3">
            <Ban className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                IP Address Blacklist
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Block suspicious IP addresses
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            disabled={isLoading}
            className="w-full sm:w-auto text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Block New IP
          </Button>
        </div>

        {/* Search/Filter */}
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by IP address or reason..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

      {/* Mobile (xs + sm) */}
      <div className="block md:hidden space-y-3">
        {(blockedIPs || []).filter(item => 
          (item.ip?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
          (item.reason?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        ).map((item) => (
          <div key={item.ip} className="border rounded-lg p-3 space-y-2">
            
            <div className="flex justify-between items-start gap-2">
              <span className="font-mono text-xs sm:text-sm font-semibold break-all flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                {item.ip}
              </span>
              <Badge variant="destructive" className="text-[10px] sm:text-xs">
                Blocked
              </Badge>
            </div>

            <div className="text-xs sm:text-sm space-y-1">
              <p className="break-words text-gray-700">
                <span className="font-medium text-gray-900">Reason:</span> {item.reason}
              </p>
              <p className="text-gray-500 text-[11px] sm:text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(item.blockedAt)}
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              disabled={isProcessing}
              onClick={() => handleUnblockIP(item.ip)}
              className="w-full text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Unblock IP
            </Button>
          </div>
        ))}
        {(!blockedIPs || blockedIPs.length === 0) && (
          <p className="text-center text-gray-500 py-4 text-sm">No blocked IPs found</p>
        )}
      </div>

      {/* Tablet + Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-[700px] lg:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">IP Address</TableHead>
              <TableHead className="text-xs md:text-sm">Reason</TableHead>
              <TableHead className="text-xs md:text-sm">Blocked At</TableHead>
              <TableHead className="text-xs md:text-sm">Status</TableHead>
              <TableHead className="text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(blockedIPs || []).filter(item => 
              (item.ip?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
              (item.reason?.toLowerCase() || "").includes(searchQuery.toLowerCase())
            ).map((item) => (
              <TableRow key={item.ip}>
                
                <TableCell className="font-mono text-xs md:text-sm break-all font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    {item.ip}
                  </div>
                </TableCell>

                <TableCell className="text-xs md:text-sm max-w-[250px] break-words text-gray-700">
                  {item.reason}
                </TableCell>

                <TableCell className="text-xs md:text-sm whitespace-nowrap text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimestamp(item.blockedAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="destructive" className="text-xs">
                    Active Block
                  </Badge>
                </TableCell>

                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleUnblockIP(item.ip)}
                    className="text-xs md:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Unblock
                  </Button>
                </TableCell>

              </TableRow>
            ))}
            {(!blockedIPs || blockedIPs.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No blocked IPs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* BLOCK IP DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-600" />
              Block New IP Address
            </DialogTitle>
            <DialogDescription>
              Restrict access to the platform from a specific IP address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                placeholder="e.g., 192.168.1.1" 
                value={newBlockedIP}
                onChange={(e) => setNewBlockedIP(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Blocking</Label>
              <Textarea 
                id="reason" 
                placeholder="e.g., Multiple failed login attempts, Suspicious behavior..." 
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleBlockIP} 
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Blocking...
                </>
              ) : "Block IP Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card>
  );
}