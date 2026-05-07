import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RefreshCw } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "../../../services/api";
import { toast } from "sonner";
import { useLanguage } from "../../../context/LanguageContext";

// Sub-components
import { StatsOverview } from "./FeatureManagement/components/StatsOverview";
import { FeatureFlagSection } from "./FeatureManagement/components/FeatureFlagSection";
import { ABTestSection } from "./FeatureManagement/components/ABTestSection";
import { UpdatesSection } from "./FeatureManagement/components/UpdatesSection";
import { DeploymentSection } from "./FeatureManagement/components/DeploymentSection";

// Modals
import { CreateFeatureFlagModal, EditFeatureFlagModal } from "./FeatureManagement/components/FeatureFlagModals";
import { CreateABTestModal, EditABTestModal } from "./FeatureManagement/components/ABTestModals";
import { CreateUpdateModal, EditUpdateModal } from "./FeatureManagement/components/UpdateModals";
import { DeleteConfirmModal } from "./FeatureManagement/components/DeleteConfirmModal";

export function FeatureManagement() {
  const { t } = useLanguage();
  
  // Data state
  const [featureFlags, setFeatureFlags] = useState([]);
  const [abTests, setAbTests] = useState([]);
  const [updates, setUpdates] = useState([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingABTest, setIsSubmittingABTest] = useState(false);

  // Modal open states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateABTestModalOpen, setIsCreateABTestModalOpen] = useState(false);
  const [isCreateUpdateModalOpen, setIsCreateUpdateModalOpen] = useState(false);

  // Form states
  const [newFlag, setNewFlag] = useState({ name: "", description: "", enabled: false });
  const [newABTest, setNewABTest] = useState({ name: "", variant: "A/B", traffic: "50/50", metric: "Conversion Rate" });
  const [newUpdateRecord, setNewUpdateRecord] = useState({ version: "", description: "", status: "available" });

  // Edit/Delete target states
  const [editingFlag, setEditingFlag] = useState(null);
  const [editingABTest, setEditingABTest] = useState(null);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeTestResults, setActiveTestResults] = useState(null);

  const fetchFeaturesData = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get("/sysadmin/features");
      if (res.data && res.data.success) {
        setFeatureFlags(res.data.data.featureFlags || []);
        setAbTests(res.data.data.abTests || []);
        setUpdates(res.data.data.updates || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.fetchError'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeaturesData();
  }, []);

  // Handlers
  const handleToggleFeature = async (id, enabled) => {
    try {
      const res = await api.post(`/sysadmin/features/toggle/${id}`, { enabled });
      toast.success(res.data.message || t('features.messages.toggleSuccess', { id, status: enabled ? t('features.flags.enabled').toLowerCase() : "disabled" }));
      setFeatureFlags(prev => prev.map(f => f.id === id ? { ...f, enabled } : f));
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.toggleError'));
    }
  };

  const handleCreateFeatureFlag = async (e) => {
    if (e) e.preventDefault();
    if (!newFlag.name) {
      toast.error(t('features.messages.nameRequired') || "Name is required");
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const res = await api.post("/sysadmin/features", newFlag);
      if (res.data && res.data.success) {
        toast.success(res.data.message || t('features.messages.createFlagSuccess'));
        fetchFeaturesData();
        setIsCreateModalOpen(false);
        setNewFlag({ name: "", description: "", enabled: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.createError'));
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleEditFeatureFlag = async (e) => {
    if (e) e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const res = await api.put(`/sysadmin/features/flag/${editingFlag.id}`, editingFlag);
      toast.success(res.data.message || "Feature flag updated");
      fetchFeaturesData();
      setEditingFlag(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update flag");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteFeatureFlag = async () => {
    if (!itemToDelete) return;
    setIsSubmittingEdit(true);
    try {
      const res = await api.delete(`/sysadmin/features/flag/${itemToDelete.id}`);
      toast.success(res.data.message || "Feature flag deleted");
      fetchFeaturesData();
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete flag");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleStartABTest = async (e) => {
    if (e) e.preventDefault();
    if (!newABTest.name) {
      toast.error(t('features.messages.nameRequired') || "Name is required");
      return;
    }

    setIsSubmittingABTest(true);
    try {
      const res = await api.post("/sysadmin/features/abtest/start", newABTest);
      toast.success(res.data.message || t('features.messages.abStartSuccess'));
      fetchFeaturesData();
      setIsCreateABTestModalOpen(false);
      setNewABTest({ name: "", variant: "A/B", traffic: "50/50", metric: "Conversion Rate" });
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.abStartError'));
    } finally {
      setIsSubmittingABTest(false);
    }
  };

  const handleEditABTest = async (e) => {
    if (e) e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const res = await api.put(`/sysadmin/features/abtest/${editingABTest.id}`, editingABTest);
      toast.success(res.data.message || "A/B test updated");
      fetchFeaturesData();
      setEditingABTest(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update A/B test");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleStopABTest = async (id) => {
    try {
      const res = await api.post(`/sysadmin/features/abtest/stop/${id}`);
      toast.success(res.data.message || t('features.messages.abStopSuccess', { id }));
      fetchFeaturesData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.abStopError'));
    }
  };

  const handleDeleteABTest = async () => {
    if (!itemToDelete) return;
    setIsSubmittingEdit(true);
    try {
      const res = await api.delete(`/sysadmin/features/abtest/${itemToDelete.id}`);
      toast.success(res.data.message || "A/B test deleted successfully");
      fetchFeaturesData();
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete A/B test");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleCreateUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const res = await api.post("/sysadmin/features/updates", newUpdateRecord);
      toast.success(res.data.message || "System update record created");
      fetchFeaturesData();
      setIsCreateUpdateModalOpen(false);
      setNewUpdateRecord({ version: "", description: "", status: "available" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create update");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleEditUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const res = await api.put(`/sysadmin/features/updates/${editingUpdate.id}`, editingUpdate);
      toast.success(res.data.message || "Update record modified");
      fetchFeaturesData();
      setEditingUpdate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to modify update");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteUpdate = async () => {
    if (!itemToDelete) return;
    setIsSubmittingEdit(true);
    try {
      const res = await api.delete(`/sysadmin/features/updates/${itemToDelete.id}`);
      toast.success(res.data.message || "Update record deleted");
      fetchFeaturesData();
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete update record");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleCheckUpdates = async () => {
    try {
      const res = await api.post("/sysadmin/features/updates/apply");
      toast.success(res.data.message || t('features.messages.updateSuccess'));
      fetchFeaturesData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.updateError'));
    }
  };

  const handleDeploy = async () => {
    try {
      const res = await api.post("/sysadmin/features/deploy");
      toast.success(res.data.message || t('features.messages.deploySuccess'));
      fetchFeaturesData();
    } catch (error) {
      toast.error(error.response?.data?.message || t('features.messages.deployError'));
    }
  };

  const handleGeneralDelete = () => {
    if (itemToDelete?.type === 'flag') handleDeleteFeatureFlag();
    else if (itemToDelete?.type === 'abtest') handleDeleteABTest();
    else handleDeleteUpdate();
  };

  const latestDeployment = useMemo(() => {
    return updates
      .filter(u => u.status === "deployed")
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || { version: "---", date: "---" };
  }, [updates]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen px-4 text-center">{t('features.loading')}</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{t('features.title')}</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">{t('features.subtitle')}</p>
        </div>
        <Button 
          onClick={fetchFeaturesData} 
          disabled={isRefreshing}
          variant="outline" 
          className="gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <RefreshCw className={isRefreshing ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          {isRefreshing ? t('refreshing') || "Refreshing..." : t('refresh')}
        </Button>
      </div>

      <StatsOverview 
        featureFlags={featureFlags} 
        abTests={abTests} 
        latestDeployment={latestDeployment} 
      />

      <Tabs defaultValue="features" className="space-y-4 md:space-y-6">
        <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="features" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('features.tabs.features')}
          </TabsTrigger>
          <TabsTrigger value="abtests" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('features.tabs.abtests')}
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('features.tabs.updates')}
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex-1 min-w-[100px] sm:min-w-[120px] cursor-pointer text-sm sm:text-base py-2">
            {t('features.tabs.deployment')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4 md:space-y-6 mt-4">
          <FeatureFlagSection 
            featureFlags={featureFlags}
            onToggle={handleToggleFeature}
            onEdit={setEditingFlag}
            onDelete={(f) => setItemToDelete({ ...f, type: 'flag' })}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>

        <TabsContent value="abtests" className="space-y-4 md:space-y-6 mt-4">
          <ABTestSection 
            abTests={abTests}
            onEdit={setEditingABTest}
            onDelete={(t) => setItemToDelete({ ...t, type: 'abtest' })}
            onStop={handleStopABTest}
            onViewResults={setActiveTestResults}
            onCreateClick={() => setIsCreateABTestModalOpen(true)}
            activeTestResults={activeTestResults}
            onCloseResults={() => setActiveTestResults(null)}
          />
        </TabsContent>

        <TabsContent value="updates" className="space-y-4 md:space-y-6 mt-4">
          <UpdatesSection 
            updates={updates}
            onCheckUpdates={handleCheckUpdates}
            onCreateUpdate={() => setIsCreateUpdateModalOpen(true)}
            onEditUpdate={setEditingUpdate}
            onDeleteUpdate={(u) => setItemToDelete({ ...u, type: 'update' })}
            onDeployUpdate={handleDeploy}
          />
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4 md:space-y-6 mt-4">
          <DeploymentSection 
            updates={updates}
            latestDeployment={latestDeployment}
            onDeploy={handleDeploy}
            onEditUpdate={setEditingUpdate}
            onDeleteUpdate={(u) => setItemToDelete({ ...u, type: 'update' })}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateFeatureFlagModal 
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        newFlag={newFlag}
        setNewFlag={setNewFlag}
        onSubmit={handleCreateFeatureFlag}
        isSubmitting={isSubmittingEdit}
      />
      
      <EditFeatureFlagModal 
        editingFlag={editingFlag}
        setEditingFlag={setEditingFlag}
        onSubmit={handleEditFeatureFlag}
        isSubmitting={isSubmittingEdit}
      />

      <CreateABTestModal 
        isOpen={isCreateABTestModalOpen}
        onOpenChange={setIsCreateABTestModalOpen}
        newABTest={newABTest}
        setNewABTest={setNewABTest}
        onSubmit={handleStartABTest}
        isSubmitting={isSubmittingABTest}
      />

      <EditABTestModal 
        editingABTest={editingABTest}
        setEditingABTest={setEditingABTest}
        onSubmit={handleEditABTest}
        isSubmitting={isSubmittingEdit}
      />

      <CreateUpdateModal 
        isOpen={isCreateUpdateModalOpen}
        onOpenChange={setIsCreateUpdateModalOpen}
        newUpdateRecord={newUpdateRecord}
        setNewUpdateRecord={setNewUpdateRecord}
        onSubmit={handleCreateUpdate}
        isSubmitting={isSubmittingEdit}
      />

      <EditUpdateModal 
        editingUpdate={editingUpdate}
        setEditingUpdate={setEditingUpdate}
        onSubmit={handleEditUpdate}
        isSubmitting={isSubmittingEdit}
      />

      <DeleteConfirmModal 
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        onConfirm={handleGeneralDelete}
        isSubmitting={isSubmittingEdit}
      />
    </div>
  );
}