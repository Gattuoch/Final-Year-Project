import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Tent, AlertCircle, CheckCircle, Ban, FileText, RefreshCw, History } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { cn } from "../ui/utils";
import { useLanguage } from "../../../context/LanguageContext";

export function CampManagement() {
  const { t } = useLanguage();
  const [pendingCamps, setPendingCamps] = useState([]);
  const [activeCamps, setActiveCamps] = useState([]);
  const [kycQueue, setKycQueue] = useState([]);
  
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campLogs, setCampLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pendingRes, activeRes, kycRes, logsRes] = await Promise.all([
        api.get("/sysadmin/camps/pending"),
        api.get("/sysadmin/camps/active"),
        api.get("/sysadmin/camps/kyc"),
        api.get("/sysadmin/camps/logs"),
      ]);

      setPendingCamps(pendingRes.data.map(mapCamp));
      setActiveCamps(activeRes.data.map(mapCamp));
      setKycQueue(kycRes.data.map(mapUserKYC));
      setCampLogs(logsRes.data || []);
    } catch (error) {
      console.error("Error fetching camp data:", error);
      toast.error(t('camp.error.load'));
    } finally {
      setIsLoading(false);
    }
  };

  const mapCamp = (c) => ({
    id: c._id,
    name: c.name || "Unknown Camp",
    manager: c.managerId?.fullName || "Unknown Manager",
    location: c.location?.address || c.location?.region || "N/A",
    rating: c.rating?.toFixed(1) || "0.0",
    bookings: c.reviews || 0,
    status: c.status,
    submitted: new Date(c.createdAt).toLocaleDateString(),
    original: c
  });

  const mapUserKYC = (u) => ({
    id: u._id,
    manager: u.fullName || "Unknown Manager",
    campName: u.businessInfo?.businessName || "N/A",
    document: u.businessInfo?.businessLicense ? "Business License" : "Basic Doc",
    submitted: u.businessInfo?.submittedAt ? new Date(u.businessInfo.submittedAt).toLocaleDateString() : new Date(u.createdAt).toLocaleDateString(),
    status: u.businessInfo?.status || "pending",
    original: u
  });

  const handleApproveCamp = async (id) => {
    try {
      await api.put(`/sysadmin/camps/${id}/status`, { status: "approved" });
      toast.success(t('camp.success.approve'));
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('camp.error.approve'));
    }
  };

  const handleRejectCamp = async (id) => {
    if (!rejectionReason) return toast.error(t('camp.error.reasonRequired'));
    try {
      await api.put(`/sysadmin/camps/${id}/status`, { status: "rejected", reason: rejectionReason });
      toast.success(t('camp.success.reject'));
      setRejectionReason("");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('camp.error.reject'));
    }
  };

  const handleBlockCamp = async (id) => {
    try {
      await api.put(`/sysadmin/camps/${id}/status`, { status: "inactive" });
      toast.success(t('camp.success.block'));
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('camp.error.block'));
    }
  };

  const handleBanCamp = async (id) => {
    try {
      await api.put(`/sysadmin/camps/${id}/status`, { status: "banned" });
      toast.success(t('camp.success.ban'));
      fetchData();
    } catch (error) {
      toast.error(t('camp.error.ban'));
    }
  };

  const handleSendWarning = async (id) => {
    if (!warningMessage) return;
    try {
      await api.put(`/sysadmin/camps/${id}/warning`, { warningMessage });
      toast.success(t('camp.success.warning'));
      setWarningMessage("");
    } catch (error) {
      toast.error(t('camp.error.warning'));
    }
  };

  const handleApproveKYC = async (id) => {
    try {
      await api.put(`/sysadmin/camps/kyc/${id}/status`, { status: "approved" });
      toast.success(t('camp.success.kycApprove'));
      fetchData();
    } catch (error) {
      toast.error(t('camp.error.kycApprove'));
    }
  };

  const handleRejectKYC = async (id) => {
    try {
      await api.put(`/sysadmin/camps/kyc/${id}/status`, { status: "rejected" });
      toast.success(t('camp.success.kycReject'));
      fetchData();
    } catch (error) {
      toast.error(t('camp.error.kycReject'));
    }
  };

  const filteredActiveCamps = activeCamps.filter(camp => 
    camp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    camp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{t('camp.title')}</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">{t('camp.subtitle')}</p>
        </div>
        <Button onClick={fetchData} disabled={isLoading} variant="outline" className="gap-2 cursor-pointer w-full sm:w-auto justify-center">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Tent className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            <h3 className="font-semibold text-sm md:text-base">{t('camp.stats.active')}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{activeCamps.filter(c => c.status === 'approved').length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{t('camp.stats.activeDesc')}</p>
        </Card>

        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            <h3 className="font-semibold text-sm md:text-base">{t('camp.stats.pending')}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{pendingCamps.length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{t('camp.stats.pendingDesc')}</p>
        </Card>

        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h3 className="font-semibold text-sm md:text-base">{t('camp.stats.kyc')}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{kycQueue.length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{t('camp.stats.kycDesc')}</p>
        </Card>

        <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Ban className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            <h3 className="font-semibold text-sm md:text-base">{t('camp.stats.blocked')}</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold">{activeCamps.filter(c => c.status === 'inactive').length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{t('camp.stats.blockedDesc')}</p>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4 md:space-y-6">
        <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="pending" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
            {t('camp.tabs.pending')}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
            {t('camp.tabs.active')}
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
            {t('camp.tabs.kyc')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('camp.pendingTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('camp.pendingTab.subtitle')}</p>
              </div>
            </div>

            {/* Mobile Card View for Pending Camps */}
            <div className="block md:hidden space-y-3">
              {isLoading ? (
                <div className="text-center py-6 text-gray-500">{t('camp.loading')}</div>
              ) : pendingCamps.length === 0 ? (
                <div className="text-center py-6 text-gray-500">{t('camp.pendingTab.table.noPending')}</div>
              ) : pendingCamps.map((camp) => (
                <div key={camp.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm break-words flex-1">{camp.name}</p>
                    <Badge variant="secondary" className="text-xs">{camp.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">ID:</span> {camp.id.substring(0,8)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Manager:</span> {camp.manager}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Location:</span> {camp.location.substring(0,25)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted: {camp.submitted}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCamp(camp)}
                        className="w-full cursor-pointer text-sm"
                      >
                        {t('camp.pendingTab.table.review')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-2xl mx-auto p-4 md:p-6">
                      <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl">{t('camp.pendingTab.dialog.title')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm md:text-base">{t('camp.pendingTab.dialog.campName')}</Label>
                          <p className="text-base md:text-lg font-semibold break-words">{camp.name}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <Label className="text-sm md:text-base">{t('camp.pendingTab.dialog.manager')}</Label>
                            <p className="text-sm md:text-base break-words">{camp.manager}</p>
                          </div>
                          <div>
                            <Label className="text-sm md:text-base">{t('camp.pendingTab.dialog.location')}</Label>
                            <p className="text-sm md:text-base break-words">{camp.location}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm md:text-base">{t('camp.pendingTab.dialog.rejectionReason')}</Label>
                          <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder={t('camp.pendingTab.dialog.rejectionPlaceholder')}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={() => handleApproveCamp(camp.id)}
                            className="flex-1 cursor-pointer w-full"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t('camp.pendingTab.dialog.approveBtn')}
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRejectCamp(camp.id)}
                            className="flex-1 cursor-pointer w-full"
                          >
                            {t('camp.pendingTab.dialog.rejectBtn')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('camp.pendingTab.table.id')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.name')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.manager')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.location')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.submitted')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.status')}</TableHead>
                    <TableHead>{t('camp.pendingTab.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-6">{t('camp.loading')}</TableCell></TableRow>
                  ) : pendingCamps.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-6">{t('camp.pendingTab.table.noPending')}</TableCell></TableRow>
                  ) : pendingCamps.map((camp) => (
                    <TableRow key={camp.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{camp.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium break-words max-w-[200px]">{camp.name}</TableCell>
                      <TableCell className="break-words max-w-[150px]">{camp.manager}</TableCell>
                      <TableCell className="break-words max-w-[200px]">{camp.location.substring(0,25)}...</TableCell>
                      <TableCell className="whitespace-nowrap">{camp.submitted}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{camp.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                             <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCamp(camp)}
                              className="cursor-pointer"
                            >
                              {t('camp.pendingTab.table.review')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t('camp.pendingTab.dialog.title')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                               <div>
                                <Label>{t('camp.pendingTab.dialog.campName')}</Label>
                                <p className="text-lg font-semibold">{camp.name}</p>
                              </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label>{t('camp.pendingTab.dialog.manager')}</Label>
                                  <p>{camp.manager}</p>
                                </div>
                                <div>
                                  <Label>{t('camp.pendingTab.dialog.location')}</Label>
                                  <p>{camp.location}</p>
                                </div>
                              </div>
                               <div>
                                <Label>{t('camp.pendingTab.dialog.rejectionReason')}</Label>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder={t('camp.pendingTab.dialog.rejectionPlaceholder')}
                                />
                              </div>
                               <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                  onClick={() => handleApproveCamp(camp.id)}
                                  className="flex-1 cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {t('camp.pendingTab.dialog.approveBtn')}
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleRejectCamp(camp.id)}
                                  className="flex-1 cursor-pointer"
                                >
                                  {t('camp.pendingTab.dialog.rejectBtn')}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('camp.activeTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('camp.activeTab.subtitle')}</p>
              </div>
              <Input 
                placeholder={t('camp.activeTab.searchPlaceholder')} 
                className="w-full sm:max-w-xs" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Card View for Active Camps */}
            <div className="block md:hidden space-y-3">
              {isLoading ? (
                <div className="text-center py-6 text-gray-500">{t('camp.loading')}</div>
              ) : filteredActiveCamps.length === 0 ? (
                <div className="text-center py-6 text-gray-500">{t('camp.activeTab.table.noCamps')}</div>
              ) : filteredActiveCamps.map((camp) => (
                <div key={camp.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm break-words flex-1">{camp.name}</p>
                    <Badge variant={camp.status === "approved" ? "default" : "destructive"} className="text-xs">
                      {camp.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">ID:</span> {camp.id.substring(0,8)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Manager:</span> {camp.manager}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Location:</span> {camp.location.substring(0,25)}...
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{camp.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span>{camp.bookings} bookings</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full cursor-pointer text-sm">
                        {t('camp.activeTab.table.manage')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 md:p-6">
                      <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl">{t('camp.activeTab.dialog.title', { name: camp.name })}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <Label className="text-sm md:text-base">{t('camp.activeTab.dialog.rating')}</Label>
                            <p className="text-base md:text-lg font-semibold">{camp.rating} ★</p>
                          </div>
                          <div>
                            <Label className="text-sm md:text-base">{t('camp.activeTab.dialog.bookings')}</Label>
                            <p className="text-base md:text-lg font-semibold">{camp.bookings}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm md:text-base">{t('camp.activeTab.dialog.warningLabel')}</Label>
                          <Textarea
                            value={warningMessage}
                            onChange={(e) => setWarningMessage(e.target.value)}
                            placeholder={t('camp.activeTab.dialog.warningPlaceholder')}
                            rows={3}
                            className="mt-1"
                          />
                          <Button 
                            variant="outline" 
                            className="mt-2 cursor-pointer w-full"
                            onClick={() => handleSendWarning(camp.id)}
                          >
                            {t('camp.activeTab.dialog.warningBtn')}
                          </Button>
                        </div>
                        <div className="pt-4 border-t space-y-3">
                          {camp.status === "approved" ? (
                            <>
                              <Button 
                                variant="outline" 
                                className="w-full cursor-pointer"
                                onClick={() => handleBlockCamp(camp.id)}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                {t('camp.activeTab.dialog.blockBtn')}
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="w-full cursor-pointer"
                                onClick={() => handleBanCamp(camp.id)}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                {t('camp.activeTab.dialog.banBtn')}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full cursor-pointer"
                              onClick={() => handleApproveCamp(camp.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('camp.activeTab.dialog.unblockBtn')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('camp.activeTab.table.id')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.name')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.manager')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.location')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.rating')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.bookings')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.status')}</TableHead>
                    <TableHead>{t('camp.activeTab.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-6">{t('camp.loading')}</TableCell></TableRow>
                  ) : filteredActiveCamps.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-6">{t('camp.activeTab.table.noCamps')}</TableCell></TableRow>
                  ) : filteredActiveCamps.map((camp) => (
                    <TableRow key={camp.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{camp.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium break-words max-w-[200px]">{camp.name}</TableCell>
                      <TableCell className="break-words max-w-[150px]">{camp.manager}</TableCell>
                      <TableCell className="break-words max-w-[200px]">{camp.location.substring(0,25)}...</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{camp.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{camp.bookings}</TableCell>
                      <TableCell>
                        <Badge variant={camp.status === "approved" ? "default" : "destructive"}>
                          {camp.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                           <Button variant="outline" size="sm" className="cursor-pointer">
                              {t('camp.activeTab.table.manage')}
                            </Button>
                          </DialogTrigger>
                           <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('camp.activeTab.dialog.title', { name: camp.name })}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label>{t('camp.activeTab.dialog.rating')}</Label>
                                  <p className="text-lg font-semibold">{camp.rating} ★</p>
                                </div>
                                <div>
                                  <Label>{t('camp.activeTab.dialog.bookings')}</Label>
                                  <p className="text-lg font-semibold">{camp.bookings}</p>
                                </div>
                              </div>
                              <div>
                                <Label>{t('camp.activeTab.dialog.warningLabel')}</Label>
                                <Textarea
                                  value={warningMessage}
                                  onChange={(e) => setWarningMessage(e.target.value)}
                                  placeholder={t('camp.activeTab.dialog.warningPlaceholder')}
                                  rows={3}
                                />
                                 <Button 
                                  variant="outline" 
                                  className="mt-2 cursor-pointer w-full"
                                  onClick={() => handleSendWarning(camp.id)}
                                >
                                  {t('camp.activeTab.dialog.warningBtn')}
                                </Button>
                              </div>
                              <div className="pt-4 border-t space-y-3">
                                {camp.status === "approved" ? (
                                  <>
                                     <Button 
                                      variant="outline" 
                                      className="w-full cursor-pointer"
                                      onClick={() => handleBlockCamp(camp.id)}
                                    >
                                      <Ban className="w-4 h-4 mr-2" />
                                      {t('camp.activeTab.dialog.blockBtn')}
                                    </Button>
                                     <Button 
                                      variant="destructive" 
                                      className="w-full cursor-pointer"
                                      onClick={() => handleBanCamp(camp.id)}
                                    >
                                      <Ban className="w-4 h-4 mr-2" />
                                      {t('camp.activeTab.dialog.banBtn')}
                                    </Button>
                                  </>
                                ) : (
                                   <Button 
                                    variant="outline" 
                                    className="w-full cursor-pointer"
                                    onClick={() => handleApproveCamp(camp.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {t('camp.activeTab.dialog.unblockBtn')}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('camp.kycTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('camp.kycTab.subtitle')}</p>
              </div>
            </div>

            {/* Mobile Card View for KYC Queue */}
            <div className="block md:hidden space-y-3">
              {isLoading ? (
                <div className="text-center py-6 text-gray-500">{t('camp.loading')}</div>
              ) : kycQueue.length === 0 ? (
                <div className="text-center py-6 text-gray-500">{t('camp.kycTab.table.noTasks')}</div>
              ) : kycQueue.map((kyc) => (
                <div key={kyc.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm break-words flex-1">{kyc.manager}</p>
                    <Badge variant="secondary" className="text-xs">{kyc.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Camp:</span> {kyc.campName}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Document:</span> {kyc.document}
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted: {kyc.submitted}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 cursor-pointer"
                      onClick={() => handleApproveKYC(kyc.id)}
                    >
                      {t('camp.kycTab.table.approve')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 cursor-pointer text-red-600 hover:text-red-700"
                      onClick={() => handleRejectKYC(kyc.id)}
                    >
                      {t('camp.kycTab.table.reject')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('camp.kycTab.table.id')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.manager')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.camp')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.type')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.submitted')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.status')}</TableHead>
                    <TableHead>{t('camp.kycTab.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-6">{t('camp.loading')}</TableCell></TableRow>
                  ) : kycQueue.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-6">{t('camp.kycTab.table.noTasks')}</TableCell></TableRow>
                  ) : kycQueue.map((kyc) => (
                    <TableRow key={kyc.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{kyc.id.substring(0,8)}...</TableCell>
                      <TableCell className="break-words max-w-[150px]">{kyc.manager}</TableCell>
                      <TableCell className="break-words max-w-[150px]">{kyc.campName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{kyc.document}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{kyc.submitted}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{kyc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleApproveKYC(kyc.id)}
                          >
                            {t('camp.kycTab.table.approve')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="cursor-pointer text-red-600 hover:text-red-700"
                            onClick={() => handleRejectKYC(kyc.id)}
                          >
                            {t('camp.kycTab.table.reject')}
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
            <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">{t('camp.kycTab.docs.title')}</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <span className="text-sm md:text-base">{t('camp.kycTab.docs.license')}</span>
                <div className="self-start sm:self-auto">
                  <Badge className="text-xs">{t('camp.kycTab.docs.required')}</Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <span className="text-sm md:text-base">{t('camp.kycTab.docs.tax')}</span>
                <div className="self-start sm:self-auto">
                  <Badge className="text-xs">{t('camp.kycTab.docs.required')}</Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <span className="text-sm md:text-base">{t('camp.kycTab.docs.managerId')}</span>
                <div className="self-start sm:self-auto">
                  <Badge className="text-xs">{t('camp.kycTab.docs.required')}</Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <span className="text-sm md:text-base">{t('camp.kycTab.docs.property')}</span>
                <div className="self-start sm:self-auto">
                  <Badge variant="secondary" className="text-xs">{t('camp.kycTab.docs.optional')}</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4 flex flex-wrap items-center gap-2">
          <History className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          {t('camp.history.title')}
        </h3>
        <div className="space-y-2 md:space-y-3">
          {campLogs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">{t('camp.history.noActions')}</p>
          ) : (
            campLogs.map((log) => (
              <div key={log._id} className={cn(
                "p-3 md:p-4 rounded-lg border",
                log.action.includes("APPROVED") ? "bg-green-50 border-green-100" :
                log.action.includes("REJECTED") || log.action.includes("BAN") ? "bg-red-50 border-red-100" :
                "bg-blue-50 border-blue-100"
              )}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={log.action.includes("APPROVED") ? "default" : "secondary"} className="text-xs">
                      {log.action.replace("CAMP_", "").replace("_", " ")}
                    </Badge>
                    <span className="font-semibold text-xs md:text-sm break-words">{log.metadata?.campName || log.metadata?.managerEmail}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                {log.metadata?.reason && (
                  <p className="text-xs md:text-sm text-gray-600 mt-2 break-words">{t('camp.history.reason', { reason: log.metadata.reason })}</p>
                )}
                <p className="text-xs text-gray-500 mt-2 break-words">{t('camp.history.actionBy', { name: log.actor?.fullName || "System Admin" })}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}