import { useState, useEffect } from "react";
import api from "../../../services/api";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { FileText, Search, AlertCircle, Info, AlertTriangle, XCircle, RefreshCw, Trash2, Edit2, Power } from "lucide-react";
import { toast } from "sonner";

export function LogsMonitoring() {
  const [logEntries, setLogEntries] = useState([]);
  const [overview, setOverview] = useState({
    totalLogs: "...",
    errors: "...",
    warnings: "...",
    info: "...",
  });
  const [alerts, setAlerts] = useState([]);
  const [stack, setStack] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [timeRange, setTimeRange] = useState("1h");

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState(null);
  const [newAlert, setNewAlert] = useState({ name: "", description: "", pattern: "" });

  const fetchLogsData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/sysadmin/logs");
      if (res.data && res.data.success) {
        setLogEntries(res.data.data.logEntries || []);
        if (res.data.data.overview) setOverview(res.data.data.overview);
        setAlerts(res.data.data.alerts || []);
        setStack(res.data.data.stack || []);
      }
    } catch (error) {
      toast.error("Failed to fetch logs data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsData();
  }, []);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const res = await api.post("/sysadmin/logs/search", {
        query: searchQuery,
        service: selectedService,
        level: selectedLevel,
        user: selectedUser,
        timeRange
      });
      if (res.data && res.data.success) {
        setLogEntries(res.data.data.logEntries || []);
        toast.success("Logs search completed");
      }
    } catch (error) {
      toast.error("Failed to search logs");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSetAlert = () => {
    setEditingAlertId(null);
    setNewAlert({ name: "", description: "", pattern: "" });
    setIsAlertDialogOpen(true);
  };

  const handleEditAlert = (alert) => {
    setEditingAlertId(alert.id);
    setNewAlert({ name: alert.name, description: alert.description, pattern: alert.pattern || "" });
    setIsAlertDialogOpen(true);
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      const res = await api.delete(`/sysadmin/logs/alert/${id}`);
      toast.success(res.data.message);
      fetchLogsData();
    } catch (error) {
      toast.error("Failed to delete alert");
    }
  };

  const handleToggleAlert = async (id) => {
    try {
      const res = await api.patch(`/sysadmin/logs/alert/toggle/${id}`);
      toast.success(res.data.message);
      fetchLogsData();
    } catch (error) {
      toast.error("Failed to toggle alert");
    }
  };

  const confirmCreateAlert = async () => {
    try {
      const payload = editingAlertId ? { ...newAlert, id: editingAlertId } : newAlert;
      const res = await api.post("/sysadmin/logs/alert", payload);
      toast.success(res.data.message);
      setIsAlertDialogOpen(false);
      fetchLogsData();
    } catch (error) {
      toast.error("Failed to save alert");
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (level) => {
    const variants = {
      error: "destructive",
      warning: "default",
      info: "secondary",
    };
    return variants[level] || "secondary";
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Logs & Monitoring</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Search and analyze system and application logs</p>
        </div>
        <Button onClick={fetchLogsData} disabled={isLoading} variant="outline" className="gap-2 w-full sm:w-auto justify-center">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Log Statistics - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className="font-semibold text-sm md:text-base">Total Logs</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{overview.totalLogs}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            <h3 className="font-semibold text-sm md:text-base">Errors</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{overview.errors}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            <h3 className="font-semibold text-sm md:text-base">Warnings</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{overview.warnings}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Last 24 hours</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className="font-semibold text-sm md:text-base">Info</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{overview.info}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Last 24 hours</p>
        </Card>
      </div>

      {/* Search & Filter - Mobile Optimized */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Search Logs</h2>
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search logs by message, user ID, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching} className="w-full md:w-auto gap-2">
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="User ID (optional)"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Log Entries - Mobile Optimized Table */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Recent Log Entries</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {logEntries.length > 0 ? (
            logEntries.map((log) => (
              <div key={log.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-500">{log.timestamp}</span>
                  <div className="flex items-center gap-2">
                    {getLevelIcon(log.level)}
                    <Badge variant={getLevelBadge(log.level)} className="text-[10px] h-5 capitalize">
                      {log.level}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Service:</span>
                  <Badge variant="outline" className="ml-2 text-[10px] h-5">{log.service}</Badge>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">User:</span>
                  <span className="font-mono text-xs ml-2 text-gray-700">{log.user}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{log.message}</p>
                </div>
                {log.details && (
                  <div className="pt-1 border-t border-gray-100 mt-2">
                    <p className="font-mono text-[10px] text-gray-400 break-all">{log.details}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-500">No logs found in the database.</p>
            </div>
          )}
        </div>


        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logEntries.length > 0 ? (
                logEntries.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono text-xs text-gray-500 whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <Badge variant={getLevelBadge(log.level)} className="capitalize h-5 text-[10px]">
                          {log.level}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold text-[10px] h-5">{log.service}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-600">{log.user}</TableCell>
                    <TableCell className="max-w-md font-medium text-sm">{log.message}</TableCell>
                    <TableCell className="font-mono text-[10px] text-gray-400 max-w-[200px] truncate" title={log.details}>
                      {log.details || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No log entries found in the database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </div>
      </Card>

      {/* Alert Configuration - Mobile Optimized */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold">Configure Log Alerts</h2>
          <Button onClick={handleSetAlert} className="w-full sm:w-auto gap-2">
            <AlertCircle className="w-4 h-4" />
            Add New Alert Pattern
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm md:text-base">{alert.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{alert.description}</p>
                  <p className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-2 inline-block">Pattern: {alert.pattern}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEditAlert(alert)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDeleteAlert(alert.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className={`h-8 w-8 ${alert.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} onClick={() => handleToggleAlert(alert.id)}>
                    <Power className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                  {alert.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-[10px] text-gray-400 font-mono">ID: {alert.id.slice(-6)}</span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              No alert patterns configured.
            </div>
          )}
        </div>
      </Card>

      {/* Centralized Logging Stack - Mobile Optimized */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Centralized Logging Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {stack.map((item, idx) => (
            <div key={idx} className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{item.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-600">{item.latency}</p>
                <p className="text-[10px] text-gray-400 uppercase">Latency</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alert Configuration Dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAlertId ? 'Edit Alert Pattern' : 'Create New Alert'}</DialogTitle>
            <DialogDescription>
              Define a pattern to monitor in system logs. You'll be notified when this pattern occurs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Alert Name</label>
              <Input
                id="name"
                value={newAlert.name}
                onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                placeholder="e.g., High Error Rate"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="pattern" className="text-sm font-medium">Log Pattern (Regex or String)</label>
              <Input
                id="pattern"
                value={newAlert.pattern}
                onChange={(e) => setNewAlert({ ...newAlert, pattern: e.target.value })}
                placeholder="e.g., Error: Connection failed"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                placeholder="What this alert monitors..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmCreateAlert}>
              {editingAlertId ? 'Update Alert' : 'Create Alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}