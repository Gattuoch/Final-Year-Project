import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Sparkles, Trash2, Pencil } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function DeploymentSection({ 
  updates, 
  latestDeployment, 
  onDeploy, 
  onEditUpdate, 
  onDeleteUpdate 
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          <div>
            <h2 className="text-lg md:text-xl font-semibold">{t('features.deployment.title')}</h2>
            <p className="text-xs md:text-sm text-gray-500">{t('features.deployment.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-medium text-sm md:text-base">{t('features.deployment.current')}</h3>
              <Badge variant="default" className="text-xs">{t('features.deployment.live')}</Badge>
            </div>
            <p className="text-base md:text-lg font-semibold">{latestDeployment.version}</p>
            <p className="text-xs md:text-sm text-gray-500">{t('features.deployment.deployed', { date: latestDeployment.date })}</p>
          </div>

          {updates.filter(u => u.status === "pending" || u.status === "available").map(update => (
            <div key={update.id} className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm md:text-base">{t('features.deployment.staging')}</h3>
                <Badge className="text-xs">{t('features.deployment.ready')}</Badge>
              </div>
              <p className="text-base md:text-lg font-semibold">{update.version}</p>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 break-words">
                {t('features.deployment.newFeatures') || 'New Features:'} {update.description}
              </p>
              <Button onClick={onDeploy} className="cursor-pointer w-full sm:w-auto">
                {t('features.deployment.deployBtn')}
              </Button>
            </div>
          ))}
          {updates.filter(u => u.status === "pending" || u.status === "available").length === 0 && (
            <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
              <p className="text-sm text-gray-600">{t('features.updates.noPending', 'System is up to date.')}</p>
            </div>
          )}

          <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm md:text-base mb-2 md:mb-3">{t('features.deployment.strategy')}</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="strategy" defaultChecked className="w-4 h-4" />
                <span className="text-xs md:text-sm">{t('features.deployment.strategyRolling')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="strategy" className="w-4 h-4" />
                <span className="text-xs md:text-sm">{t('features.deployment.strategyBlueGreen')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="strategy" className="w-4 h-4" />
                <span className="text-xs md:text-sm">{t('features.deployment.strategyCanary')}</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">{t('features.deployment.history')}</h3>
        <div className="space-y-2 md:space-y-3">
          {updates.filter(u => u.status === "deployed").map((update) => (
            <div key={update.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-green-50 rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm md:text-base">{update.version} {t('features.tabs.deployment')}</p>
                <p className="text-xs md:text-sm text-gray-500">{update.date} - {t('features.deployment.duration')} 12 minutes</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge variant="default" className="text-xs">{t('features.deployment.success')}</Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-600 hover:bg-blue-100 cursor-pointer"
                  onClick={() => onEditUpdate(update)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-100 cursor-pointer"
                  onClick={() => onDeleteUpdate(update)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {updates.filter(u => u.status === "deployed").length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t('features.deployment.noHistory') || "No deployment history found."}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
