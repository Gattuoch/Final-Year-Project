import { Card } from "../../../ui/card";
import { Sparkles, TestTube, Package } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function StatsOverview({ featureFlags, abTests, latestDeployment }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mb-2 md:mb-3" />
        <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{t('features.stats.activeFeatures')}</h3>
        <p className="text-xl md:text-2xl font-bold mb-1">
          {featureFlags.filter(f => f.enabled).length}
        </p>
        <p className="text-xs md:text-sm text-gray-500">{t('features.stats.outOf', { total: featureFlags.length })}</p>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
        <TestTube className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mb-2 md:mb-3" />
        <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{t('features.stats.abTests')}</h3>
        <p className="text-xl md:text-2xl font-bold mb-1">
          {abTests.filter(t => t.status === "running").length}
        </p>
        <p className="text-xs md:text-sm text-gray-500">{t('features.stats.activeExp')}</p>
      </Card>

      <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
        <Package className="w-6 h-6 md:w-8 md:h-8 text-green-600 mb-2 md:mb-3" />
        <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{t('features.stats.latestVersion')}</h3>
        <p className="text-xl md:text-2xl font-bold mb-1">{latestDeployment.version}</p>
        <p className="text-xs md:text-sm text-gray-500">{t('features.stats.deployed', { date: latestDeployment.date })}</p>
      </Card>
    </div>
  );
}
