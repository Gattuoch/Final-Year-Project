import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Settings, Key, Globe, Activity, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "sonner";
import { useLanguage } from "../../../context/LanguageContext";

export function SystemConfiguration() {
  const { changeLanguage, t } = useLanguage();
  const [externalServices, setExternalServices] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: "Loading...",
    apiLatency: "Loading...",
    cacheHitRatio: "Loading...",
    errorRate: "Loading..."
  });
  const [componentStatus, setComponentStatus] = useState([]);

  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [language, setLanguage] = useState("am");
  const [chapaApiKey, setChapaApiKey] = useState("");
  const [cloudinaryKey, setCloudinaryKey] = useState("");
  
  const [commissionRate, setCommissionRate] = useState(10);
  const [payoutThreshold, setPayoutThreshold] = useState(500);
  const [cancellationWindow, setCancellationWindow] = useState(24);

  const [paymentFallback, setPaymentFallback] = useState(true);
  const [imageFallback, setImageFallback] = useState(true);
  const [notificationFallback, setNotificationFallback] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);


  const fetchConfigData = async () => {
    try {
      const res = await api.get("/sysadmin/config");
      if (res.data && res.data.success) {
        setExternalServices(res.data.data.externalServices || []);
        if (res.data.data.systemHealth) setSystemHealth(res.data.data.systemHealth);
        setComponentStatus(res.data.data.componentStatus || []);
        if (res.data.data.settings) {
            setTimezone(res.data.data.settings.timezone || "UTC");
            setCurrency(res.data.data.settings.currency || "USD");
            setDateFormat(res.data.data.settings.dateFormat || "DD/MM/YYYY");
            setLanguage(res.data.data.settings.language || "am");
            setChapaApiKey(res.data.data.settings.chapaApiKey || "");
            setCloudinaryKey(res.data.data.settings.cloudinaryKey || "");
            setCommissionRate(res.data.data.settings.commissionRate || 10);
            setPayoutThreshold(res.data.data.settings.payoutThreshold || 500);
            setCancellationWindow(res.data.data.settings.cancellationWindow || 24);
            setPaymentFallback(res.data.data.settings.paymentFallback ?? true);
            setImageFallback(res.data.data.settings.imageFallback ?? true);
            setNotificationFallback(res.data.data.settings.notificationFallback ?? true);
        }
      }
    } catch (error) {
      console.error("Fetch config error:", error);
      toast.error(error.response?.data?.message || t('systemConfig.error.fetch'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigData();
  }, []);

  const handleSaveConfig = async () => {
    try {
        const res = await api.post("/sysadmin/config/save", {
            timezone,
            currency,
            dateFormat,
            language,
            chapaApiKey,
            cloudinaryKey,
            commissionRate,
            payoutThreshold,
            cancellationWindow,
            paymentFallback,
            imageFallback,
            notificationFallback
        });
        toast.success(res.data.message || t('systemConfig.success.save'));
        
        // Dynamically change language across the app
        changeLanguage(language);
    } catch (error) {
        console.error("Save config error:", error);
        toast.error(error.response?.data?.message || error.message || t('systemConfig.error.save'));
    }
  };

  const handleTestConnection = async (serviceName) => {
    try {
        const res = await api.post("/sysadmin/config/test-connection", {
            service: serviceName
        });
        toast.success(res.data.message || t('systemConfig.success.test', { service: serviceName }));
        
        // Refetch to update all data
        fetchConfigData();
        
        // Also update the currently selected service in the dialog
        if (res.data.data && selectedService?.name === serviceName) {
            const m = res.data.data;
            setSelectedService({
                ...selectedService,
                status: m.status,
                lastUpdated: m.lastUpdated,
                latency: m.value
            });
        }
    } catch (error) {
        toast.error(error.response?.data?.message || t('systemConfig.error.test', { service: serviceName }));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen px-4 text-center">{t('systemConfig.loading')}</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{t('systemConfig.title')}</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">{t('systemConfig.subtitle')}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
        <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="general" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('systemConfig.tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('systemConfig.tabs.apiKeys')}
          </TabsTrigger>
          <TabsTrigger value="services" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('systemConfig.tabs.services')}
          </TabsTrigger>
          <TabsTrigger value="health" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('systemConfig.tabs.health')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('systemConfig.regional.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('systemConfig.regional.subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label htmlFor="timezone" className="text-sm md:text-base">{t('systemConfig.regional.timezone')}</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency" className="text-sm md:text-base">{t('systemConfig.regional.currency')}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat" className="text-sm md:text-base">{t('systemConfig.regional.dateFormat')}</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="dateFormat" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className="text-sm md:text-base">{t('systemConfig.regional.language')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('languages.en')}</SelectItem>
                      <SelectItem value="am">{t('languages.am')}</SelectItem>
                      <SelectItem value="om">{t('languages.om')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <Button onClick={handleSaveConfig} className="cursor-pointer w-full sm:w-auto">
                  {t('systemConfig.regional.saveBtn')}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t('systemConfig.business.title')}</h2>
            <div className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="commission" className="text-sm md:text-base">{t('systemConfig.business.commission')}</Label>
                <Input
                  id="commission"
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full sm:max-w-xs mt-1"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.business.commissionDesc')}</p>
              </div>

              <div>
                <Label htmlFor="minPayout" className="text-sm md:text-base">{t('systemConfig.business.payout')}</Label>
                <Input
                  id="minPayout"
                  type="number"
                  value={payoutThreshold}
                  onChange={(e) => setPayoutThreshold(e.target.value)}
                  className="w-full sm:max-w-xs mt-1"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.business.payoutDesc')}</p>
              </div>

              <div>
                <Label htmlFor="cancellation" className="text-sm md:text-base">{t('systemConfig.business.cancellation')}</Label>
                <Input
                  id="cancellation"
                  type="number"
                  value={cancellationWindow}
                  onChange={(e) => setCancellationWindow(e.target.value)}
                  className="w-full sm:max-w-xs mt-1"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.business.cancellationDesc')}</p>
              </div>
            </div>
            <div className="pt-4 md:pt-6">
                <Button onClick={handleSaveConfig} className="cursor-pointer w-full sm:w-auto">
                    {t('systemConfig.business.saveBtn')}
                </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Key className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('systemConfig.apiKeysTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('systemConfig.apiKeysTab.subtitle')}</p>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-2 md:gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm md:text-base text-yellow-900">{t('systemConfig.apiKeysTab.securityWarning')}</p>
                  <p className="text-xs md:text-sm text-yellow-800">
                    {t('systemConfig.apiKeysTab.securityDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <Label htmlFor="chapaKey" className="text-sm md:text-base">{t('systemConfig.apiKeysTab.chapa')}</Label>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-1">
                  <Input
                    id="chapaKey"
                    type="password"
                    value={chapaApiKey}
                    onChange={(e) => setChapaApiKey(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" onClick={() => handleTestConnection("Chapa")} className="cursor-pointer w-full sm:w-auto justify-center">
                    {t('systemConfig.apiKeysTab.testBtn')}
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.apiKeysTab.chapaDesc')}</p>
              </div>

              <div>
                <Label htmlFor="cloudinaryKey" className="text-sm md:text-base">{t('systemConfig.apiKeysTab.cloudinary')}</Label>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-1">
                  <Input
                    id="cloudinaryKey"
                    type="password"
                    value={cloudinaryKey}
                    onChange={(e) => setCloudinaryKey(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" onClick={() => handleTestConnection("Cloudinary")} className="cursor-pointer w-full sm:w-auto justify-center">
                    {t('systemConfig.apiKeysTab.testBtn')}
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.apiKeysTab.cloudinaryDesc')}</p>
              </div>

              <div>
                <Label htmlFor="smsKey" className="text-sm md:text-base">{t('systemConfig.apiKeysTab.sms')}</Label>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-1">
                  <Input
                    id="smsKey"
                    type="password"
                    defaultValue="**********************"
                    className="w-full"
                  />
                  <Button variant="outline" onClick={() => handleTestConnection("SMS Provider")} className="cursor-pointer w-full sm:w-auto justify-center">
                    {t('systemConfig.apiKeysTab.testBtn')}
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.apiKeysTab.smsDesc')}</p>
              </div>

              <div>
                <Label htmlFor="emailKey" className="text-sm md:text-base">{t('systemConfig.apiKeysTab.email')}</Label>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-1">
                  <Input
                    id="emailKey"
                    type="password"
                    defaultValue="**********************"
                    className="w-full"
                  />
                  <Button variant="outline" onClick={() => handleTestConnection("Email Service")} className="cursor-pointer w-full sm:w-auto justify-center">
                    {t('systemConfig.apiKeysTab.testBtn')}
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{t('systemConfig.apiKeysTab.emailDesc')}</p>
              </div>

              <div className="pt-2 md:pt-4">
                <Button onClick={handleSaveConfig} className="cursor-pointer w-full sm:w-auto justify-center">
                  {t('systemConfig.apiKeysTab.saveBtn')}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('systemConfig.servicesTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('systemConfig.servicesTab.subtitle')}</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {externalServices.map((service) => (
                <div key={service.name} className="p-3 md:p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 md:mb-3">
                    <h3 className="font-semibold text-sm md:text-base break-words">{service.name}</h3>
                    <div className="self-start sm:self-auto">
                      <Badge variant="default" className="text-xs">{service.status}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">{t('systemConfig.servicesTab.latency')}</p>
                      <p className="font-semibold">{service.latency}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{t('systemConfig.servicesTab.uptime')}</p>
                      <p className="font-semibold">{service.uptime}</p>
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedService(service);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        {t('systemConfig.servicesTab.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {externalServices.length === 0 && (
                  <div className="text-center py-6 md:py-8 text-gray-500 border rounded-lg text-sm">
                      {t('systemConfig.servicesTab.noData')}
                  </div>
              )}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t('systemConfig.servicesTab.fallbackTitle')}</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm md:text-base">{t('systemConfig.servicesTab.paymentFallback')}</h3>
                  <Switch 
                    checked={paymentFallback} 
                    onCheckedChange={setPaymentFallback}
                  />
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  {t('systemConfig.servicesTab.paymentFallbackDesc')}
                </p>
              </div>

              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm md:text-base">{t('systemConfig.servicesTab.imageFallback')}</h3>
                  <Switch 
                    checked={imageFallback} 
                    onCheckedChange={setImageFallback}
                  />
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  {t('systemConfig.servicesTab.imageFallbackDesc')}
                </p>
              </div>

              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm md:text-base">{t('systemConfig.servicesTab.notificationFallback')}</h3>
                  <Switch 
                    checked={notificationFallback} 
                    onCheckedChange={setNotificationFallback}
                  />
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  {t('systemConfig.servicesTab.notificationFallbackDesc')}
                </p>
              </div>
            </div>
            <div className="pt-4 md:pt-6">
                <Button onClick={handleSaveConfig} className="cursor-pointer w-full sm:w-auto">
                    {t('systemConfig.regional.saveBtn')}
                </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4 md:space-y-6 mt-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{t('systemConfig.healthTab.title')}</h2>
                <p className="text-xs md:text-sm text-gray-500">{t('systemConfig.healthTab.subtitle')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                <h3 className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{t('systemConfig.healthTab.systemUptime')}</h3>
                <p className="text-xl md:text-2xl font-bold text-green-600 break-words">{systemHealth.uptime}</p>
                <p className="text-xs text-gray-500 mt-1">{t('systemConfig.healthTab.last30Days')}</p>
              </div>

              <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{t('systemConfig.healthTab.avgLatency')}</h3>
                <p className="text-xl md:text-2xl font-bold text-blue-600 break-words">{systemHealth.apiLatency}</p>
                <p className="text-xs text-gray-500 mt-1">{t('systemConfig.healthTab.p50')}</p>
              </div>

              <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{t('systemConfig.healthTab.cacheRatio')}</h3>
                <p className="text-xl md:text-2xl font-bold text-purple-600 break-words">{systemHealth.cacheHitRatio}</p>
                <p className="text-xs text-gray-500 mt-1">{t('systemConfig.healthTab.redis')}</p>
              </div>

              <div className="p-3 md:p-4 bg-orange-50 rounded-lg">
                <h3 className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{t('systemConfig.healthTab.errorRate')}</h3>
                <p className="text-xl md:text-2xl font-bold text-orange-600 break-words">{systemHealth.errorRate}</p>
                <p className="text-xs text-gray-500 mt-1">{t('systemConfig.healthTab.last24Hours')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{t('systemConfig.healthTab.componentStatus')}</h2>
            <div className="space-y-2 md:space-y-3">
              {componentStatus.map((comp, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-50 rounded-lg gap-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-sm md:text-base break-words">{comp.name}</p>
                        <p className="text-xs md:text-sm text-gray-500">{comp.description}</p>
                      </div>
                    </div>
                    <div className="self-start sm:self-auto">
                      <Badge variant="default" className="text-xs">{comp.status}</Badge>
                    </div>
                  </div>
              ))}
              {componentStatus.length === 0 && (
                  <div className="text-center py-6 md:py-8 text-gray-500 border rounded-lg text-sm">
                      {t('systemConfig.healthTab.noStatus')}
                  </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span className="break-words">{selectedService?.name}</span>
              <Badge variant={selectedService?.status === 'healthy' ? 'default' : 'destructive'} className="ml-2">
                {selectedService?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{t('systemConfig.servicesTab.latency')}</p>
                <p className="text-lg font-bold text-blue-600">{selectedService?.latency}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{t('systemConfig.servicesTab.uptime')}</p>
                <p className="text-lg font-bold text-green-600">{selectedService?.uptime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Service Description</p>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
                {selectedService?.fullDescription || "No description available."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity className="w-3 h-3" />
              <span>Last checked: {selectedService?.lastUpdated ? new Date(selectedService.lastUpdated).toLocaleString() : '---'}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => handleTestConnection(selectedService?.name)}
              className="w-full sm:w-auto"
            >
              Test Connection
            </Button>
            <Button 
              onClick={() => setDetailsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}