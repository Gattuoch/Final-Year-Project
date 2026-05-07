import { useState, useEffect } from "react";
import api from "../../../services/api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DollarSign, TrendingUp, RefreshCw, CreditCard, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { useLanguage } from "../../../context/LanguageContext";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

export function FinancialManagement() {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [revenueByRegion, setRevenueByRegion] = useState([]);
    const [seasonalDemand, setSeasonalDemand] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    const [overview, setOverview] = useState({
        totalRevenue: "—",
        totalRevenuePeriod: "—",
        commissions: "—",
        commissionsRate: "—",
        pendingPayouts: "—",
        pendingPayoutsManagers: "—",
        refundsIssued: "—",
        refundsPeriod: "—"
    });

    const [metrics, setMetrics] = useState({
        averageBookingValue: "—",
        totalBookings: "—",
        totalBookingsTrend: "—",
        refundRate: "—",
        refundRateStatus: "—"
    });

    const [reconciliationData, setReconciliationData] = useState({
        currentSettlement: {
            platformTotal: "—",
            gatewaySettlement: "—",
            difference: "—"
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [refundAmount, setRefundAmount] = useState("");
    const [refundId, setRefundId] = useState("");

    const [financeSettings, setFinanceSettings] = useState({
        commissionRate: 10,
        payoutThreshold: 500,
        payoutSchedule: "weekly"
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);


    const fetchFinanceData = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const res = await api.get("/sysadmin/finance");
            if (res.data && res.data.success && res.data.data) {
                const d = res.data.data;
                setTransactions(d.transactions || []);
                setPayouts(d.payouts || []);
                setRevenueByRegion(d.revenueByRegion || []);
                setSeasonalDemand(d.seasonalDemand || []);
                setPaymentMethods(d.paymentMethods || []);
                if (d.overview) setOverview(d.overview);
                if (d.metrics) setMetrics(d.metrics);
                if (d.reconciliationData) setReconciliationData(d.reconciliationData);
                
                if (d.settings) {
                    setFinanceSettings({
                        commissionRate: d.settings.commissionRate || 10,
                        payoutThreshold: d.settings.payoutThreshold || 500,
                        payoutSchedule: d.settings.payoutSchedule || "weekly"
                    });
                }
            } else {
                setFetchError(t('finance.loadingError') || "Unexpected response from server.");
                toast.error(t('finance.loadingError') || "Unexpected response from server.");
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Failed to fetch financial data";
            console.error("Finance fetch error:", error.response?.status, msg);
            setFetchError(`Error ${error.response?.status || ""}: ${msg}`);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const handleProcessRefund = async (id, amount) => {
        if (!id) return toast.error("Please provide a transaction ID");
        try {
            const res = await api.post(`/sysadmin/finance/refund/${id}`, { amount });
            toast.success(res.data.message || `Refund ${id} processed successfully`);
            setRefundId("");
            setRefundAmount("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to process refund");
        }
    };

    const handleProcessPayout = async (id) => {
        try {
            const res = await api.post(`/sysadmin/finance/payout/${id || ''}`);
            toast.success(res.data.message || `Payout queued for processing`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to queue payout");
        }
    };

    const handleReconcile = async () => {
        try {
            const res = await api.post(`/sysadmin/finance/reconcile`);
            toast.success(res.data.message || "Reconciliation started - this may take several minutes");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to start reconciliation");
        }
    };

    const handleExportReport = async () => {
        try {
            const res = await api.post("/sysadmin/finance/export");
            if (res.data.csv) {
                const blob = new Blob([res.data.csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'financial_report.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                toast.success("Report downloaded successfully");
            } else {
                toast.success(res.data.message || "Financial report generated");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to export report");
        }
    };

    const handleUpdateSettings = async () => {
        setIsSavingSettings(true);
        try {
            const res = await api.put("/sysadmin/finance/settings", financeSettings);
            toast.success(res.data.message || "Settings updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update settings");
        } finally {
            setIsSavingSettings(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4 px-4">
                <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                <p className="text-sm md:text-base text-gray-500 text-center">{t('finance.loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{t('finance.title')}</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">{t('finance.subtitle')}</p>
                </div>
                <Button onClick={fetchFinanceData} disabled={isLoading} variant="outline" className="gap-2 cursor-pointer w-full sm:w-auto justify-center">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('refresh')}
                </Button>
            </div>

            {fetchError && (
                <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="font-semibold text-red-700 text-sm md:text-base">{t('finance.loadingError')}</p>
                        <p className="text-xs md:text-sm text-red-600 mt-1 break-words">{fetchError}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchFinanceData} disabled={isLoading} className="cursor-pointer w-full sm:w-auto">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> {t('finance.retry')}
                    </Button>
                </div>
            )}

            {/* Financial Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('finance.overview.totalRevenue')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold break-words">{overview.totalRevenue}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">{overview.totalRevenuePeriod}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('finance.overview.commissions')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold break-words">{overview.commissions}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">{overview.commissionsRate}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('finance.overview.pendingPayouts')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold break-words">{overview.pendingPayouts}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">{overview.pendingPayoutsManagers}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('finance.overview.refundsIssued')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold break-words">{overview.refundsIssued}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 break-words">{overview.refundsPeriod}</p>
                </Card>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4 md:space-y-6">
                <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1 gap-1">
                    <TabsTrigger value="transactions" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
                        {t('finance.tabs.transactions')}
                    </TabsTrigger>
                    <TabsTrigger value="payouts" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
                        {t('finance.tabs.payouts')}
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
                        {t('finance.tabs.analytics')}
                    </TabsTrigger>
                    <TabsTrigger value="reconciliation" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
                        {t('finance.tabs.reconciliation')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('finance.transactionsTab.historyTitle')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('finance.transactionsTab.historySubtitle')}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('finance.transactionsTab.allTypes')}</SelectItem>
                                        <SelectItem value="booking">{t('finance.transactionsTab.bookings')}</SelectItem>
                                        <SelectItem value="refund">{t('finance.transactionsTab.refunds')}</SelectItem>
                                        <SelectItem value="deposit">{t('finance.transactionsTab.deposits')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={handleExportReport} className="cursor-pointer w-full sm:w-auto">
                                    {t('finance.transactionsTab.exportCsv')}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Card View for Transactions */}
                        <div className="block md:hidden space-y-3">
                            {transactions.map((txn) => (
                                <div key={txn.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-xs">{txn.id}</span>
                                        <Badge variant={txn.status === "completed" ? "default" : "secondary"} className="text-xs">
                                            {txn.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs">{txn.type}</Badge>
                                        <span className={txn.amount < 0 ? "text-red-600 font-semibold" : "font-semibold"}>
                                            ETB {Math.abs(txn.amount).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">User:</span> {txn.user}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">Camp:</span> {txn.camp}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">Commission:</span> ETB {Math.abs(txn.commission)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {txn.date}
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full cursor-pointer text-sm">
                                        {t('finance.transactionsTab.table.viewDetails')}
                                    </Button>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <div className="text-center py-6 md:py-8 text-gray-500 text-sm">
                                    {t('finance.transactionsTab.table.noData')}
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">{t('finance.transactionsTab.table.id')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.type')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.user')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.camp')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.amount')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.commission')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.status')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.date')}</TableHead>
                                        <TableHead>{t('finance.transactionsTab.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((txn) => (
                                        <TableRow key={txn.id}>
                                            <TableCell className="font-mono text-sm whitespace-nowrap">{txn.id}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{txn.type}</Badge>
                                            </TableCell>
                                            <TableCell className="break-words max-w-[150px]">{txn.user}</TableCell>
                                            <TableCell className="break-words max-w-[150px]">{txn.camp}</TableCell>
                                            <TableCell className={txn.amount < 0 ? "text-red-600" : ""}>
                                                ETB {Math.abs(txn.amount).toLocaleString()}
                                            </TableCell>
                                            <TableCell>ETB {Math.abs(txn.commission)}</TableCell>
                                            <TableCell>
                                                <Badge variant={txn.status === "completed" ? "default" : "secondary"}>
                                                    {txn.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm whitespace-nowrap">{txn.date}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" className="cursor-pointer">
                                                    {t('finance.transactionsTab.table.viewDetails')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {transactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                                                {t('finance.transactionsTab.table.noData')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t('finance.transactionsTab.manualRefund.title')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            <Input 
                                placeholder={t('finance.transactionsTab.manualRefund.idPlaceholder')} 
                                value={refundId} 
                                onChange={(e) => setRefundId(e.target.value)} 
                                className="w-full"
                            />
                            <Input 
                                placeholder={t('finance.transactionsTab.manualRefund.amountPlaceholder')} 
                                type="number" 
                                value={refundAmount} 
                                onChange={(e) => setRefundAmount(e.target.value)}
                                className="w-full"
                            />
                            <Button onClick={() => handleProcessRefund(refundId || "TXN-2024-XXXX", refundAmount)} className="cursor-pointer w-full">
                                {t('finance.transactionsTab.manualRefund.btn')}
                            </Button>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 mt-2">
                            {t('finance.transactionsTab.manualRefund.desc')}
                        </p>
                    </Card>
                </TabsContent>

                <TabsContent value="payouts" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('finance.payoutsTab.title')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('finance.payoutsTab.subtitle')}</p>
                            </div>
                            <Button onClick={() => handleProcessPayout(null)} className="w-full sm:w-auto">
                                {t('finance.payoutsTab.processAllBtn')}
                            </Button>
                        </div>

                        {/* Mobile Card View for Payouts */}
                        <div className="block md:hidden space-y-3">
                            {payouts.map((payout) => (
                                <div key={payout.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-xs">{payout.id}</span>
                                        <Badge variant={payout.status === "processed" ? "default" : "secondary"} className="text-xs">
                                            {payout.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">Manager:</span> {payout.manager}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-medium">Camp:</span> {payout.camp}
                                    </div>
                                    <div className="text-sm font-semibold text-green-600">
                                        ETB {payout.amount.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {payout.date}
                                    </div>
                                    {payout.status === "pending" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleProcessPayout(payout.id)}
                                            className="w-full cursor-pointer"
                                        >
                                            {t('finance.payoutsTab.table.processBtn')}
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer">
                                            {t('finance.payoutsTab.table.viewReceipt')}
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {payouts.length === 0 && (
                                <div className="text-center py-6 md:py-8 text-gray-500 text-sm">
                                    {t('finance.payoutsTab.table.noData')}
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('finance.payoutsTab.table.id')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.manager')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.camp')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.amount')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.status')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.date')}</TableHead>
                                        <TableHead>{t('finance.payoutsTab.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payouts.map((payout) => (
                                        <TableRow key={payout.id}>
                                            <TableCell className="font-mono text-sm whitespace-nowrap">{payout.id}</TableCell>
                                            <TableCell className="break-words max-w-[150px]">{payout.manager}</TableCell>
                                            <TableCell className="break-words max-w-[150px]">{payout.camp}</TableCell>
                                            <TableCell className="font-semibold">
                                                ETB {payout.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                                                    {payout.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{payout.date}</TableCell>
                                            <TableCell>
                                                {payout.status === "pending" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleProcessPayout(payout.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        {t('finance.payoutsTab.table.processBtn')}
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                                        {t('finance.payoutsTab.table.viewReceipt')}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {payouts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                                {t('finance.payoutsTab.table.noData')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <h2 className="text-lg md:text-xl font-semibold">{t('finance.payoutsTab.config.title')}</h2>
                            <Button 
                                onClick={handleUpdateSettings} 
                                disabled={isSavingSettings}
                                className="cursor-pointer w-full sm:w-auto"
                            >
                                {isSavingSettings ? t('finance.payoutsTab.config.savingBtn') : t('finance.payoutsTab.config.saveBtn')}
                            </Button>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <Label className="font-medium mb-2 block text-sm md:text-base">{t('finance.payoutsTab.config.commission')}</Label>
                                <Input 
                                    type="number" 
                                    value={financeSettings.commissionRate} 
                                    onChange={(e) => setFinanceSettings({...financeSettings, commissionRate: e.target.value})}
                                    className="w-full sm:max-w-xs" 
                                />
                                <p className="text-xs md:text-sm text-gray-500 mt-1">
                                    {t('finance.payoutsTab.config.commissionDesc')}
                                </p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <Label className="font-medium mb-2 block text-sm md:text-base">{t('finance.payoutsTab.config.threshold')}</Label>
                                <Input 
                                    type="number" 
                                    value={financeSettings.payoutThreshold} 
                                    onChange={(e) => setFinanceSettings({...financeSettings, payoutThreshold: e.target.value})}
                                    className="w-full sm:max-w-xs" 
                                />
                                <p className="text-xs md:text-sm text-gray-500 mt-1">
                                    {t('finance.payoutsTab.config.thresholdDesc')}
                                </p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <Label className="font-medium mb-2 block text-sm md:text-base">{t('finance.payoutsTab.config.schedule')}</Label>
                                <Select 
                                    value={financeSettings.payoutSchedule} 
                                    onValueChange={(val) => setFinanceSettings({...financeSettings, payoutSchedule: val})}
                                >
                                    <SelectTrigger className="w-full sm:max-w-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">{t('finance.payoutsTab.config.daily')}</SelectItem>
                                        <SelectItem value="weekly">{t('finance.payoutsTab.config.weekly')}</SelectItem>
                                        <SelectItem value="biweekly">{t('finance.payoutsTab.config.biweekly')}</SelectItem>
                                        <SelectItem value="monthly">{t('finance.payoutsTab.config.monthly')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('finance.analyticsTab.title')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('finance.analyticsTab.subtitle')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('finance.analyticsTab.revenueByRegion')}</h3>
                                <div className="w-full h-[250px] md:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revenueByRegion}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="revenue" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('finance.analyticsTab.seasonalDemand')}</h3>
                                <div className="w-full h-[250px] md:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={seasonalDemand}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        <Card className="p-4 md:p-6">
                            <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('finance.analyticsTab.paymentMethods')}</h3>
                            <div className="w-full h-[250px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentMethods}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => {
                                                if (window.innerWidth < 768) {
                                                    return `${value}%`;
                                                }
                                                return `${name}: ${value}%`;
                                            }}
                                            outerRadius={window.innerWidth < 768 ? 80 : 100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {paymentMethods.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-4 md:p-6">
                            <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('finance.analyticsTab.keyMetrics')}</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs md:text-sm text-gray-600">{t('finance.analyticsTab.avgBookingValue')}</p>
                                    <p className="text-xl md:text-2xl font-bold break-words">{metrics.averageBookingValue}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs md:text-sm text-gray-600">{t('finance.analyticsTab.totalBookings')}</p>
                                    <p className="text-xl md:text-2xl font-bold break-words">{metrics.totalBookings}</p>
                                    <p className="text-xs md:text-sm text-green-600 break-words">{metrics.totalBookingsTrend}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs md:text-sm text-gray-600">{t('finance.analyticsTab.refundRate')}</p>
                                    <p className="text-xl md:text-2xl font-bold break-words">{metrics.refundRate}</p>
                                    <p className="text-xs md:text-sm text-gray-500 break-words">{metrics.refundRateStatus}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="reconciliation" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('finance.reconciliationTab.title')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('finance.reconciliationTab.subtitle')}</p>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div>
                                        <h3 className="font-semibold text-sm md:text-base">{t('finance.reconciliationTab.settlementTitle')}</h3>
                                        <p className="text-xs md:text-sm text-gray-600">{t('finance.reconciliationTab.settlementDate')}</p>
                                    </div>
                                    <div className="self-start sm:self-auto">
                                        <Badge className="text-xs">{t('finance.reconciliationTab.pendingReview')}</Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-600">{t('finance.reconciliationTab.platformTotal')}</p>
                                        <p className="font-semibold text-sm md:text-base break-words">{reconciliationData.currentSettlement.platformTotal}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-600">{t('finance.reconciliationTab.gatewaySettlement')}</p>
                                        <p className="font-semibold text-sm md:text-base break-words">{reconciliationData.currentSettlement.gatewaySettlement}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-gray-600">{t('finance.reconciliationTab.difference')}</p>
                                        <p className="font-semibold text-green-600 text-sm md:text-base break-words">{reconciliationData.currentSettlement.difference}</p>
                                    </div>
                                </div>
                                <Button onClick={handleReconcile} className="cursor-pointer w-full sm:w-auto">
                                    {t('finance.reconciliationTab.markReconciled')}
                                </Button>
                            </div>

                            <div className="p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-sm md:text-base">{t('finance.reconciliationTab.prevSettlement')}</h3>
                                        <p className="text-xs md:text-sm text-gray-600">{t('finance.reconciliationTab.prevReconciledOn')}</p>
                                    </div>
                                    <div className="self-start sm:self-auto">
                                        <Badge variant="default" className="text-xs">{t('finance.reconciliationTab.reconciled')}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('finance.reconciliationTab.historyTitle')}</h3>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                <div>
                                    <p className="font-medium text-sm md:text-base">{t('finance.reconciliationTab.march')}</p>
                                    <p className="text-xs md:text-sm text-gray-500">{t('finance.reconciliationTab.marchDesc')}</p>
                                </div>
                                <div className="self-start sm:self-auto">
                                    <Badge variant="default" className="text-xs">{t('finance.reconciliationTab.reconciled')}</Badge>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                <div>
                                    <p className="font-medium text-sm md:text-base">{t('finance.reconciliationTab.feb')}</p>
                                    <p className="text-xs md:text-sm text-gray-500">{t('finance.reconciliationTab.febDesc')}</p>
                                </div>
                                <div className="self-start sm:self-auto">
                                    <Badge variant="default" className="text-xs">{t('finance.reconciliationTab.reconciled')}</Badge>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                <div>
                                    <p className="font-medium text-sm md:text-base">{t('finance.reconciliationTab.jan')}</p>
                                    <p className="text-xs md:text-sm text-gray-500">{t('finance.reconciliationTab.janDesc')}</p>
                                </div>
                                <div className="self-start sm:self-auto">
                                    <Badge variant="default" className="text-xs">{t('finance.reconciliationTab.reconciled')}</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}