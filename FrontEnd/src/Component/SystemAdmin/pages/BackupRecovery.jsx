import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HardDrive, Clock, CheckCircle, AlertCircle, Download, RotateCcw, RefreshCw, AlertTriangle, ShieldCheck, History, ShieldAlert } from "lucide-react";
import { Progress } from "../ui/progress";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";


import { useState, useEffect } from "react";
import api from "../../../services/api";

const formatRelativeTime = (dateString) => {
    if (!dateString || dateString === "Never") return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 10) return "Just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
};

const getNextBackupTime = (hour, minute) => {
    const now = new Date();
    const next = new Date();
    next.setUTCHours(hour, minute, 0, 0);

    if (next <= now) {
        next.setUTCDate(next.getUTCDate() + 1);
    }

    const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return next.toLocaleString('en-US', options);
};



const initialFullBackups = [
    { id: "FB-2026-104", database: "PostgreSQL", size: "98.7 GB", timestamp: "2026-04-15 02:00:00", status: "completed", location: "s3://backups/prod/full/2026-04-15" },
    { id: "FB-2026-103", database: "PostgreSQL", size: "97.2 GB", timestamp: "2026-04-14 02:00:00", status: "completed", location: "s3://backups/prod/full/2026-04-14" },
    { id: "FB-2026-102", database: "MongoDB", size: "45.1 GB", timestamp: "2026-04-15 02:15:00", status: "completed", location: "s3://backups/prod/mongo/2026-04-15" },
];

const initialIncrementalBackups = [
    { id: "IB-2026-5432", timestamp: "2026-04-15 14:45:00", changes: "234 MB", status: "completed" },
    { id: "IB-2026-5431", timestamp: "2026-04-15 14:30:00", changes: "189 MB", status: "completed" },
    { id: "IB-2026-5430", timestamp: "2026-04-15 14:15:00", changes: "312 MB", status: "completed" },
    { id: "IB-2026-5429", timestamp: "2026-04-15 14:00:00", changes: "267 MB", status: "completed" },
    { id: "IB-2026-5428", timestamp: "2026-04-15 13:45:00", changes: "198 MB", status: "completed" },
];

const initialRecoveryTests = [
    { id: "RT-2026-045", type: "Full Restore", environment: "Test", date: "2026-04-10", duration: "45min", status: "passed" },
    { id: "RT-2026-044", type: "Point-in-Time", environment: "Test", date: "2026-04-03", duration: "23min", status: "passed" },
    { id: "RT-2026-043", type: "Full Restore", environment: "Test", date: "2026-03-27", duration: "48min", status: "passed" },
];

export function BackupRecovery() {
    const [fullBackups, setFullBackups] = useState(initialFullBackups);
    const [incrementalBackups, setIncrementalBackups] = useState(initialIncrementalBackups);
    const [recoveryTests, setRecoveryTests] = useState(initialRecoveryTests);
    const [isRestoring, setIsRestoring] = useState(null);
    const [isDownloading, setIsDownloading] = useState(null);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [overview, setOverview] = useState({
        lastFull: "2 hours ago",
        lastIncremental: "3 minutes ago",
        totalSize: "1.2 TB",
        recoveryTests: "100% Pass"
    });
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isPITRModalOpen, setIsPITRModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState(null);
    const [testConfig, setTestConfig] = useState({ type: "Full Restore", environment: "Test" });
    const [selectedPITRTime, setSelectedPITRTime] = useState(new Date(Date.now() - 3600000).toISOString().slice(0, 16)); // Default to 1 hour ago
    const [isPITRInProgress, setIsPITRInProgress] = useState(false);
    const [isDRModalOpen, setIsDRModalOpen] = useState(false);
    const [drStats, setDrStats] = useState({
        lastDrill: "March 1, 2026",
        lastRTO: "3 hours 42 minutes",
        status: "Successful"
    });
    const [isRunbookModalOpen, setIsRunbookModalOpen] = useState(false);
    const [selectedRunbook, setSelectedRunbook] = useState(null);

    const runbooksContent = {
        "Zone Failure Recovery": {
            description: "Complete availability zone failure procedures",
            steps: [
                "Isolate affected primary availability zone (AZ-1).",
                "Verify health of secondary standby cluster in AZ-2.",
                "Execute Route53 DNS failover to standby endpoint.",
                "Promote secondary database instance to primary writer.",
                "Initiate DevOps emergency response channel (#dr-emergency)."
            ],
            priority: "Critical",
            eta: "15-30 minutes"
        },
        "Database Corruption Recovery": {
            description: "Data integrity and logical corruption procedures",
            steps: [
                "Identify precise timestamp of corruption via Audit Logs.",
                "Initiate Point-in-Time Recovery (PITR) to T-1 minute.",
                "Verify data integrity on the recovered snapshot.",
                "Perform logical diff between current and recovered states.",
                "Notify impacted stakeholders and initiate post-mortem."
            ],
            priority: "High",
            eta: "1-2 hours"
        },
        "Security Breach Response": {
            description: "Unauthorized access and data exfiltration procedures",
            steps: [
                "Revoke all active database administrative credentials.",
                "Isolate affected server instances from public network.",
                "Rotate master encryption keys (KMS) for all buckets.",
                "Initiate forensic log analysis and snapshot preservation.",
                "Coordinate with legal and compliance departments."
            ],
            priority: "Critical",
            eta: "Immediate"
        }
    };








    const fetchBackupData = async () => {
        try {
            const res = await api.get("/sysadmin/backup");
            if (res.data && res.data.success) {
                setFullBackups(res.data.data.fullBackups || []);
                setIncrementalBackups(res.data.data.incrementalBackups || []);
                setRecoveryTests(res.data.data.recoveryTests || []);
                setOverview(res.data.data.overview || {});
            }
        } catch (error) {
            console.error("Backup fetch error:", error);
        }
    };

    useEffect(() => {
        fetchBackupData();

        const interval = setInterval(() => {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            // 15 minute interval (0, 15, 30, 45)
            const secondsInCycle = 15 * 60;
            const secondsPassed = (minutes % 15) * 60 + seconds;
            const remaining = secondsInCycle - secondsPassed;

            setTimeLeft(remaining);
            setProgress((secondsPassed / secondsInCycle) * 100);

            // Refresh data 5 seconds into a new cycle to ensure backend backup is finished
            if (remaining === secondsInCycle - 5) {
                fetchBackupData();
            }
        }, 1000);


        return () => clearInterval(interval);
    }, []);


    const handleRunFullBackup = async () => {
        try {
            setIsBackingUp(true);
            const res = await api.post("/sysadmin/backup");
            if (res.data.success) {
                toast.success(res.data.message || "Manual backup started successfully");
                fetchBackupData();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Internal server error: Failed to initiate backup";
            toast.error(errorMsg);
            console.error("Backup trigger error:", error);
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleRestoreBackup = (backup) => {
        setSelectedBackup(backup);
        setIsRestoreModalOpen(true);
    };


    const handleDownloadClick = (backup) => {
        setSelectedBackup(backup);
        setIsDownloadModalOpen(true);
    };

    const handleDownloadBackup = async (format) => {
        if (!selectedBackup) return;
        const id = selectedBackup.id;

        try {
            setIsDownloading(id);
            setIsDownloadModalOpen(false);
            const loadingToast = toast.loading(`Preparing ${format.toUpperCase()} for ${id}...`);

            // Real backend call for all formats (GZ, JSON, PDF)
            const res = await api.get(`/sysadmin/backup/download/${id}?format=${format}`, {
                responseType: format === 'gz' || format === 'pdf' ? 'blob' : 'json'
            });

            if (res.status === 200) {
                toast.success(`${format.toUpperCase()} file ready!`, { id: loadingToast });

                let url;
                if (format === 'gz' || format === 'pdf') {
                    url = window.URL.createObjectURL(new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'application/gzip' }));
                } else {
                    url = window.URL.createObjectURL(new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' }));
                }


                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${id}.${format}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                toast.error("Failed to generate download", { id: loadingToast });
            }
        } catch (error) {
            console.error("Download error:", error);
            toast.error(`Download failed: Could not generate ${format.toUpperCase()}`);
        } finally {
            setIsDownloading(null);
            setSelectedBackup(null);
        }
    };



    const confirmRestore = async () => {
        if (!selectedBackup) return;
        const id = selectedBackup.id;

        try {
            setIsRestoring(id);
            setIsRestoreModalOpen(false);

            const promise = api.post("/sysadmin/backup/restore", { id });

            toast.promise(promise, {
                loading: `Restoring system from ${id}...`,
                success: (res) => res.data.message || `System restored to snapshot ${id}`,
                error: (err) => err.response?.data?.message || `Restoration failed for ${id}`
            });

            const res = await promise;
            if (res.data.success) {
                // Success handled by toast.promise
            }
        } catch (error) {
            console.error("Restoration error:", error);
        } finally {
            setIsRestoring(null);
            setSelectedBackup(null);
        }
    };

    const handlePointInTimeRestore = () => {
        if (!selectedPITRTime) {
            toast.error("Please select a recovery time first");
            return;
        }
        toast.info("Preparing recovery confirmation...");
        setIsPITRModalOpen(true);
    };



    const confirmPITR = async () => {
        try {
            setIsPITRInProgress(true);
            const promise = api.post("/sysadmin/backup/pitr", { targetDate: selectedPITRTime });

            toast.promise(promise, {
                loading: "Executing Point-in-Time Recovery...",
                success: (res) => {
                    setIsPITRModalOpen(false);
                    return res.data.message;
                },
                error: (err) => {
                    return err.response?.data?.message || "PITR operation failed";
                }
            });

            await promise;
        } catch (error) {
            console.error("PITR error:", error);
        } finally {
            setIsPITRInProgress(false);
        }
    };



    const handleTestRestore = () => {
        setIsTestModalOpen(true);
    };

    const confirmScheduleTest = async () => {
        try {
            setIsTestModalOpen(false);
            const testDate = new Date().toISOString();
            const promise = api.post("/sysadmin/backup/test", {
                ...testConfig,
                date: testDate
            });

            toast.promise(promise, {
                loading: "Scheduling restore test...",
                success: (res) => {
                    // Add new test to the top of the list
                    setRecoveryTests(prev => [
                        {
                            id: res.data.testId,
                            type: testConfig.type,
                            environment: testConfig.environment,
                            date: testDate,
                            duration: "calculating...",
                            status: "pending"
                        },
                        ...prev
                    ]);
                    return res.data.message;
                },
                error: "Failed to schedule test"
            });
        } catch (error) {
            console.error("Schedule test error:", error);
        }
    };



    const handleRunDisasterRecovery = () => {
        setIsDRModalOpen(true);
    };

    const confirmDRDrill = async () => {
        try {
            setIsDRModalOpen(false);
            const promise = api.post("/sysadmin/backup/dr-drill");
            
            toast.promise(promise, {
                loading: "Executing Disaster Recovery Drill...",
                success: (res) => {
                    setDrStats({
                        lastDrill: res.data.drillDate,
                        lastRTO: res.data.achievedRTO,
                        status: "Successful"
                    });
                    return res.data.message;
                },
                error: "DR Drill failed"
            });
        } catch (error) {
            console.error("DR Drill error:", error);
        }
    };


    const handleViewRunbook = (name) => {
        setSelectedRunbook({ name, ...runbooksContent[name] });
        setIsRunbookModalOpen(true);
    };

    return (


        <div className="space-y-4 md:space-y-6 px-4 md:px-0">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Backup & Recovery</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Ensure data durability and disaster recovery</p>
            </div>

            {/* Status Overview - Mobile optimized grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Card className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <h3 className="font-semibold text-sm md:text-base">Last Full Backup</h3>
                    </div>
                    <p className="text-base md:text-lg font-bold">{formatRelativeTime(overview.lastFull)}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{overview.lastFull !== "Never" ? overview.lastFull : "N/A"}</p>
                </Card>

                <Card className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h3 className="font-semibold text-sm md:text-base">Last Incremental</h3>
                    </div>
                    <p className="text-base md:text-lg font-bold">{formatRelativeTime(overview.lastIncremental)}</p>
                    <div className="mt-4">
                        <p className="text-xs md:text-sm text-gray-500">Every 15 minutes</p>
                    </div>
                </Card>



                <Card className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        <h3 className="font-semibold text-sm md:text-base">Total Backup Size</h3>
                    </div>
                    <p className="text-base md:text-lg font-bold">{overview.totalSize}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Last 30 days</p>
                </Card>

                <Card className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <h3 className="font-semibold text-sm md:text-base">Recovery Tests</h3>
                    </div>
                    <p className="text-base md:text-lg font-bold">{overview.recoveryTests}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Last 3 months</p>
                </Card>
            </div>

            {/* Mobile-friendly Tabs */}
            <Tabs defaultValue="full" className="space-y-4 md:space-y-6">
                <div className="overflow-x-auto pb-2 -mx-4 px-4">
                    <TabsList className="w-full min-w-max md:min-w-0">
                        <TabsTrigger value="full" className="text-sm md:text-base">Full Backups</TabsTrigger>
                        <TabsTrigger value="incremental" className="text-sm md:text-base">Incremental</TabsTrigger>
                        <TabsTrigger value="recovery" className="text-sm md:text-base">Recovery</TabsTrigger>
                        <TabsTrigger value="disaster" className="text-sm md:text-base">DR</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="full" className="space-y-4 md:space-y-6">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">Full Database Backups</h2>
                                <p className="text-xs md:text-sm text-gray-500">Automated daily at 2:00 AM</p>
                            </div>
                            <Button onClick={handleRunFullBackup} disabled={isBackingUp} className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all gap-2">
                                {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isBackingUp ? "Backing up..." : "Run Manual Backup"}
                            </Button>
                        </div>

                        {/* Mobile: Card view, Desktop: Table view */}
                        <div className="block md:hidden space-y-4">
                            {fullBackups.map((backup) => (
                                <div key={backup.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-mono text-sm font-medium">{backup.id}</p>
                                            <p className="text-sm text-gray-600">{backup.database}</p>
                                        </div>
                                        <Badge variant="default" className="text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            {backup.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Size</p>
                                            <p className="font-medium">{backup.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Timestamp</p>
                                            <p className="font-medium text-xs">{backup.timestamp}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-white/50 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 font-semibold gap-2"
                                            disabled={isRestoring === backup.id}
                                            onClick={() => handleRestoreBackup(backup)}

                                        >
                                            {isRestoring === backup.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                                            Restore
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="px-3 hover:bg-gray-100"
                                            disabled={isDownloading === backup.id}
                                            onClick={() => handleDownloadClick(backup)}
                                        >
                                            {isDownloading === backup.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-4 h-4" />}
                                        </Button>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table view */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Backup ID</TableHead>
                                        <TableHead>Database</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fullBackups.map((backup) => (
                                        <TableRow key={backup.id}>
                                            <TableCell className="font-mono text-sm">{backup.id}</TableCell>
                                            <TableCell>{backup.database}</TableCell>
                                            <TableCell>{backup.size}</TableCell>
                                            <TableCell>{backup.timestamp}</TableCell>
                                            <TableCell>
                                                <Badge variant="default">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {backup.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isRestoring === backup.id}
                                                        className="bg-white/50 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 font-semibold gap-2"
                                                        onClick={() => handleRestoreBackup(backup)}

                                                    >
                                                        {isRestoring === backup.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="hover:bg-gray-100"
                                                        disabled={isDownloading === backup.id}
                                                        onClick={() => handleDownloadClick(backup)}
                                                    >
                                                        {isDownloading === backup.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                    </Button>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Backup Schedule Configuration</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm md:text-base">MongoDB Full Backup</p>
                                        <Badge variant="default" className="w-fit">Enabled</Badge>
                                    </div>
                                    <p className="text-xs font-semibold text-blue-600">Daily Schedule</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-700">Next scheduled run:</p>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="font-bold">{getNextBackupTime(2, 15)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Configured for 2:15 AM UTC (Local Time Shown)</p>
                                </div>
                            </div>
                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <p className="font-medium text-sm md:text-base">Retention Policy</p>
                                    <Badge variant="secondary" className="w-fit">30 Days</Badge>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 italic">"Backups older than 30 days are automatically archived to glacier storage for cost optimization."</p>
                            </div>
                        </div>
                    </Card>

                </TabsContent>

                <TabsContent value="incremental" className="space-y-4 md:space-y-6">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">Incremental Backups</h2>
                                <p className="text-xs md:text-sm text-gray-500">Automated every 15 minutes</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 md:mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <p className="text-xs md:text-sm text-gray-600">Next backup in: {Math.floor(timeLeft / 60)} minutes {timeLeft % 60} seconds</p>
                                <p className="text-xs md:text-sm text-gray-600">{Math.round(progress)}% complete</p>
                            </div>
                            <Progress value={progress} />
                        </div>


                        {/* Mobile card view */}
                        <div className="block md:hidden space-y-3">
                            {incrementalBackups.map((backup) => (
                                <div key={backup.id} className="border rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="font-mono text-sm font-medium">{backup.id}</p>
                                        <Badge variant="default" className="text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            {backup.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Timestamp</p>
                                            <p className="font-medium text-xs">{backup.timestamp}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Changes</p>
                                            <p className="font-medium">{backup.changes}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table view */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Backup ID</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Changes</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {incrementalBackups.map((backup) => (
                                        <TableRow key={backup.id}>
                                            <TableCell className="font-mono text-sm">{backup.id}</TableCell>
                                            <TableCell>{backup.timestamp}</TableCell>
                                            <TableCell>{backup.changes}</TableCell>
                                            <TableCell>
                                                <Badge variant="default">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {backup.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="recovery" className="space-y-4 md:space-y-6">
                    <Card className="p-4 md:p-6">
                        <div className="flex items-start gap-2 md:gap-3 mb-4 md:mb-6">
                            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">Point-in-Time Recovery</h2>
                                <p className="text-xs md:text-sm text-gray-500">Restore database to any point in time within the last 30 days</p>
                            </div>
                        </div>

                        <div className="p-3 md:p-4 bg-orange-50 rounded-lg mb-4 md:mb-6">
                            <p className="font-medium text-sm mb-1 md:mb-2">⚠️ Warning</p>
                            <p className="text-xs md:text-sm text-gray-700">
                                Point-in-time recovery should only be performed when data corruption is detected.
                                Always test recovery in a staging environment first.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Recovery Target (Local Time)</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="datetime-local"
                                        value={selectedPITRTime}
                                        onChange={(e) => setSelectedPITRTime(e.target.value)}
                                        className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-mono shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <Button onClick={handlePointInTimeRestore} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all gap-2">
                                        <History className="w-4 h-4" />
                                        Execute Recovery
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Supports up to 30 days of retention (Earliest: {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()})
                                </p>
                            </div>
                        </div>

                    </Card>

                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">Backup Integrity Tests</h2>
                                <p className="text-xs md:text-sm text-gray-500">Regular restore tests to verify backup validity</p>
                            </div>
                            <Button onClick={handleTestRestore} className="w-full sm:w-auto">
                                Schedule Test
                            </Button>
                        </div>

                        {/* Mobile card view */}
                        <div className="block md:hidden space-y-3">
                            {recoveryTests.map((test) => (
                                <div key={test.id} className="border rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="font-mono text-sm font-medium">{test.id}</p>
                                        <Badge variant="default" className="text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            {test.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Type:</span>
                                            <span className="font-medium">{test.type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Environment:</span>
                                            <span>{test.environment}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Date:</span>
                                            <div className="text-right">
                                                <p className="font-medium">{formatRelativeTime(test.date)}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(test.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Duration:</span>
                                            <span>{test.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table view */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Environment</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recoveryTests.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell className="font-mono text-sm">{test.id}</TableCell>
                                            <TableCell>{test.type}</TableCell>
                                            <TableCell>{test.environment}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{formatRelativeTime(test.date)}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(test.date).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>{test.duration}</TableCell>
                                            <TableCell>
                                                <Badge variant="default">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {test.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="disaster" className="space-y-4 md:space-y-6">
                    <Card className="p-4 md:p-6">
                        <div className="flex items-start gap-2 md:gap-3 mb-4 md:mb-6">
                            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">Disaster Recovery</h2>
                                <p className="text-xs md:text-sm text-gray-500">Maintain and test disaster recovery procedures</p>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div className="p-3 md:p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                                    <p className="font-medium text-sm md:text-base text-red-900">Emergency Recovery Procedures</p>
                                </div>
                                <p className="text-xs md:text-sm text-red-800 mb-3 md:mb-4">
                                    In case of complete zone failure, follow the disaster recovery runbook
                                </p>
                                <Button variant="destructive" onClick={handleRunDisasterRecovery} className="w-full sm:w-auto">
                                    Initiate DR Drill
                                </Button>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-sm md:text-base mb-2">Last DR Drill</p>
                                <p className="text-xs md:text-sm text-gray-500">{drStats.lastDrill}</p>
                                <Badge variant="default" className="mt-2">{drStats.status}</Badge>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-sm md:text-base mb-2">Recovery Time Objective (RTO)</p>
                                <p className="text-xs md:text-sm text-gray-500">Target: 4 hours</p>
                                <p className="text-xs md:text-sm text-gray-500">Last achieved: {drStats.lastRTO}</p>
                            </div>


                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-sm md:text-base mb-2">Recovery Point Objective (RPO)</p>
                                <p className="text-xs md:text-sm text-gray-500">Target: 15 minutes</p>
                                <p className="text-xs md:text-sm text-gray-500">Current: 15 minutes (incremental backups)</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">DR Runbooks</h3>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm md:text-base">Zone Failure Recovery</p>
                                    <p className="text-xs md:text-sm text-gray-500">Complete availability zone failure</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewRunbook("Zone Failure Recovery")} className="w-full sm:w-auto">View Runbook</Button>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm md:text-base">Database Corruption Recovery</p>
                                    <p className="text-xs md:text-sm text-gray-500">Data integrity issues</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewRunbook("Database Corruption Recovery")} className="w-full sm:w-auto">View Runbook</Button>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm md:text-base">Security Breach Response</p>
                                    <p className="text-xs md:text-sm text-gray-500">Unauthorized access recovery</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewRunbook("Security Breach Response")} className="w-full sm:w-auto">View Runbook</Button>
                            </div>

                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Premium Restore Confirmation Modal */}
            <Dialog key="restore-modal" open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>

                <DialogContent className="sm:max-w-[500px] border-none bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden p-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">Critical: System Restore</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Confirming this action will overwrite your current database state.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 my-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Target Backup ID</span>
                                <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedBackup?.id}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Timestamp</span>
                                <span className="text-sm font-medium">{selectedBackup?.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Database Engine</span>
                                <Badge variant="secondary" className="font-semibold">{selectedBackup?.database || 'MongoDB'}</Badge>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex gap-3 items-start text-xs text-red-600 font-medium">
                                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                                    <p>This action is irreversible. All current session data, active transactions, and unsaved changes will be lost.</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsRestoreModalOpen(false)}
                                className="flex-1 sm:flex-none border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmRestore}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-none shadow-lg shadow-red-200 gap-2"
                            >
                                <History className="w-4 h-4" />
                                Proceed with Restore
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Download Format Picker Modal */}
            <Dialog key="download-modal" open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>

                <DialogContent className="sm:max-w-[450px] border-none bg-white/90 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Download className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">Export Backup Data</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Select the preferred format for <span className="font-mono text-blue-600 font-semibold">{selectedBackup?.id}</span>
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-3 my-6">
                            <button
                                onClick={() => handleDownloadBackup('gz')}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-blue-100">
                                        <HardDrive className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Database Dump (.gz)</p>
                                        <p className="text-xs text-gray-500">Complete compressed binary data</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 group-hover:text-blue-500">READY</div>
                            </button>

                            <button
                                onClick={() => handleDownloadBackup('pdf')}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-orange-50 hover:border-orange-200 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-orange-100">
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Backup Report (.pdf)</p>
                                        <p className="text-xs text-gray-500">Formal summary with system manifest</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 group-hover:text-orange-500">NEW</div>
                            </button>

                            <button
                                onClick={() => handleDownloadBackup('json')}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-purple-100">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Metadata Manifest (.json)</p>
                                        <p className="text-xs text-gray-500">Technical details in JSON format</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 group-hover:text-purple-500">API</div>
                            </button>
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => setIsDownloadModalOpen(false)}
                                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium PITR Confirmation Modal */}
            <Dialog key="pitr-modal" open={isPITRModalOpen} onOpenChange={setIsPITRModalOpen}>

                <DialogContent className="sm:max-w-[500px] border-none bg-white/90 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400"></div>

                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">Execute PITR</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Point-in-Time Recovery is a critical operation.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6">
                            <p className="text-sm text-red-800 font-medium mb-1">Target Timestamp (Local)</p>
                            <p className="text-lg font-bold text-red-900 font-mono">
                                {selectedPITRTime ? new Date(selectedPITRTime).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : "No time selected"}
                            </p>
                            <p className="text-xs text-red-600 mt-2 italic">Note: All transactions occurred after this precise moment will be irreversibly discarded.</p>
                        </div>



                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsPITRModalOpen(false)} disabled={isPITRInProgress}>Cancel</Button>
                            <Button onClick={confirmPITR} disabled={isPITRInProgress} className="bg-red-600 hover:bg-red-700 text-white gap-2 min-w-[140px]">
                                {isPITRInProgress ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <History className="w-4 h-4" />
                                        Confirm Recovery
                                    </>
                                )}
                            </Button>
                        </DialogFooter>

                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Schedule Test Modal */}
            <Dialog key="test-modal" open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>

                <DialogContent className="sm:max-w-[450px] border-none bg-white/90 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-green-400"></div>

                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">Schedule Restore Test</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Validate your backups with a simulated restore.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 my-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Test Type</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    value={testConfig.type}
                                    onChange={(e) => setTestConfig({ ...testConfig, type: e.target.value })}
                                >
                                    <option>Full Restore</option>
                                    <option>Point-in-Time</option>
                                    <option>Snapshot Validation</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Environment</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    value={testConfig.environment}
                                    onChange={(e) => setTestConfig({ ...testConfig, environment: e.target.value })}
                                >
                                    <option>Test</option>
                                    <option>Staging</option>
                                    <option>SandBox</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
                            <Button onClick={confirmScheduleTest} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Schedule Test Now
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium DR Drill Confirmation Modal */}
            <Dialog key="dr-modal" open={isDRModalOpen} onOpenChange={setIsDRModalOpen}>
                <DialogContent className="sm:max-w-[500px] border-none bg-white/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-black to-red-600"></div>
                    
                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-600 rounded-full shadow-lg shadow-red-200">
                                    <ShieldAlert className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-gray-900 uppercase tracking-tighter">DR Failover Drill</DialogTitle>
                                    <DialogDescription className="text-gray-500 font-medium">
                                        Simulated Zone Failure & Cross-Region Recovery
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 my-6">
                            <div className="p-4 bg-gray-900 rounded-xl text-white">
                                <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2">Drill Scope</p>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                        Complete Primary Zone Isolation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                        Secondary Cluster Promotion (Standby)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                        DNS Propagation & Load Balancer Failover
                                    </li>
                                </ul>
                            </div>

                            <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg flex gap-3 items-start">
                                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                    While this is a drill, it will trigger automated alerts to the DevOps team and switch traffic to the standby cluster. No user data will be lost.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDRModalOpen(false)} className="border-gray-200">Abort Drill</Button>
                            <Button onClick={confirmDRDrill} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-xl shadow-red-100">
                                Initiate Failover Now
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Runbook Viewer Modal */}
            <Dialog key="runbook-modal" open={isRunbookModalOpen} onOpenChange={setIsRunbookModalOpen}>
                <DialogContent className="sm:max-w-[600px] border-none bg-white/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
                    
                    <div className="p-6">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <HardDrive className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">{selectedRunbook?.name}</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Standard Operating Procedure (SOP)
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Priority Level</p>
                                <Badge variant={selectedRunbook?.priority === "Critical" ? "destructive" : "default"}>
                                    {selectedRunbook?.priority}
                                </Badge>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Estimated Time (ETA)</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    {selectedRunbook?.eta}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-700 uppercase tracking-tight">Recovery Checklist</p>
                            <div className="space-y-3">
                                {selectedRunbook?.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-3 items-start p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-6 h-6 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-center">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <p className="text-xs text-blue-800 font-medium italic">
                                Note: These procedures are reviewed quarterly and verified during DR failover drills.
                            </p>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button onClick={() => setIsRunbookModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                Close Procedure
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}