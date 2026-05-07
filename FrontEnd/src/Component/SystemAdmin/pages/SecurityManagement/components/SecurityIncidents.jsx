import { Card } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { AlertTriangle, Info, ShieldAlert, History, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../ui/dialog";
import { toast } from "sonner";
import api from "../../../../../services/api";

export function SecurityIncidents({ incidents, isLoading, onUpdate }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResolve = async (id) => {
    try {
      setIsProcessing(true);
      await api.put(`/sysadmin/security/incidents/${id}/resolve`);
      toast.success(`Incident ${id} marked as resolved`);
      if (onUpdate) onUpdate();
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => ({ ...prev, status: "resolved" }));
      }
    } catch (err) {
      toast.error("Failed to resolve incident");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete incident ${id}?`)) return;
    try {
      setIsProcessing(true);
      await api.delete(`/sysadmin/security/incidents/${id}`);
      toast.success(`Incident ${id} deleted`);
      if (onUpdate) onUpdate();
      if (selectedIncident?.id === id) setSelectedIncident(null);
    } catch (err) {
      toast.error("Failed to delete incident");
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <>
    <Card className="p-3 sm:p-4 md:p-6 relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 mb-4 md:mb-6">
        <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Security Incidents
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Investigate and respond to security events
          </p>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden space-y-3">
        {(incidents || []).map((incident) => (
          <div key={incident.id} className="border rounded-lg p-3 space-y-2">

            <div className="flex justify-between items-start gap-2">
              <span className="font-mono text-xs sm:text-sm font-semibold">
                {incident.id}
              </span>
              <Badge
                variant={
                  incident.severity === "critical" ? "destructive" :
                  incident.severity === "high" ? "destructive" :
                  "default"
                }
                className="text-[10px] sm:text-xs"
              >
                {incident.severity}
              </Badge>
            </div>

            <div className="text-xs sm:text-sm space-y-1">
              <p><span className="text-gray-500">Type:</span> {incident.type}</p>
              <p className="break-all">
                <span className="text-gray-500">User/IP:</span> {incident.user}
              </p>
              <p className="text-gray-500 text-[11px] sm:text-xs">
                {formatTimestamp(incident.timestamp)}
              </p>
            </div>

            <div className="flex justify-between items-center gap-2">
              <Badge
                variant={incident.status === "resolved" ? "default" : "secondary"}
                className="text-[10px] sm:text-xs"
              >
                {incident.status}
              </Badge>

              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={() => setSelectedIncident(incident)}
                >
                  View
                </Button>
                {incident.status !== "resolved" && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleResolve(incident.id)}
                    disabled={isProcessing}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(incident.id)}
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        ))}
        {(!incidents || incidents.length === 0) && !isLoading && (
          <p className="text-center text-gray-500 py-4 text-sm">No security incidents found</p>
        )}
      </div>

      {/* TABLE (MD + DESKTOP) */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-[750px] lg:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Incident ID</TableHead>
              <TableHead className="text-xs md:text-sm">Type</TableHead>
              <TableHead className="text-xs md:text-sm">Severity</TableHead>
              <TableHead className="text-xs md:text-sm">User/IP</TableHead>
              <TableHead className="text-xs md:text-sm">Timestamp</TableHead>
              <TableHead className="text-xs md:text-sm">Status</TableHead>
              <TableHead className="text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(incidents || []).map((incident) => (
              <TableRow key={incident.id}>

                <TableCell className="font-mono text-xs md:text-sm">
                  {incident.id}
                </TableCell>

                <TableCell className="text-xs md:text-sm">
                  {incident.type}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      incident.severity === "critical" ? "destructive" :
                      incident.severity === "high" ? "destructive" :
                      "default"
                    }
                    className="text-xs"
                  >
                    {incident.severity}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs md:text-sm break-all max-w-[200px]">
                  {incident.user}
                </TableCell>

                <TableCell className="text-xs md:text-sm whitespace-nowrap">
                  {formatTimestamp(incident.timestamp)}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={incident.status === "resolved" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {incident.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      Details
                    </Button>
                    {incident.status !== "resolved" && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleResolve(incident.id)}
                        disabled={isProcessing}
                        title="Mark as Resolved"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(incident.id)}
                      disabled={isProcessing}
                      title="Delete Incident"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
            {(!incidents || incidents.length === 0) && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No security incidents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </Card>

    {/* Incident Details Dialog */}
    <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <DialogTitle>Incident Details</DialogTitle>
          </div>
          <DialogDescription>
            Detailed information about the security event {selectedIncident?.id}
          </DialogDescription>
        </DialogHeader>

        {selectedIncident && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Type
                </p>
                <p className="font-medium">{selectedIncident.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Severity</p>
                <Badge
                  variant={
                    selectedIncident.severity === "critical" ? "destructive" :
                    selectedIncident.severity === "high" ? "destructive" :
                    "default"
                  }
                >
                  {selectedIncident.severity}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Timestamp
                </p>
                <p className="font-medium">{formatTimestamp(selectedIncident.timestamp)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Status</p>
                <Badge variant={selectedIncident.status === "resolved" ? "default" : "secondary"}>
                  {selectedIncident.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 text-sm border-t pt-3">
              <p className="text-gray-500">Affected User / Source IP</p>
              <p className="font-mono bg-gray-50 p-2 rounded border break-all">
                {selectedIncident.user}
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-gray-500">Resolution Note</p>
              <p className="text-gray-700 italic">
                {selectedIncident.status === "resolved" 
                  ? "Corrective action has been taken and the threat has been neutralized."
                  : "Under investigation by the security team."}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between gap-2">
          {selectedIncident?.status !== "resolved" && (
            <Button 
              type="button" 
              variant="default" 
              onClick={() => handleResolve(selectedIncident.id)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Resolved
            </Button>
          )}
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setSelectedIncident(null)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}