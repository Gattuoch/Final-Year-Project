import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Badge } from "../../../ui/badge";
import { Flag, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function FeatureFlagSection({ 
  featureFlags, 
  onToggle, 
  onEdit, 
  onDelete, 
  onCreateClick 
}) {
  const { t } = useLanguage();

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Flag className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
        <div>
          <h2 className="text-lg md:text-xl font-semibold">{t('features.flags.title')}</h2>
          <p className="text-xs md:text-sm text-gray-500">{t('features.flags.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {featureFlags.map((feature) => (
          <div key={feature.id} className="p-3 md:p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm md:text-base break-words">{feature.name}</h3>
                  {feature.enabled && (
                    <Badge variant="default" className="text-xs">{t('features.flags.enabled')}</Badge>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-500 mb-2 break-words">{feature.description}</p>
                <p className="text-xs md:text-sm text-gray-600">
                  {t('features.flags.activeUsers')} <span className="font-semibold">{feature.users.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onEdit(feature)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onClick={() => onDelete(feature)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(checked) => onToggle(feature.id, checked)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {featureFlags.length === 0 && (
          <div className="text-center py-6 md:py-8 text-gray-500 border rounded-lg text-sm">
            {t('features.flags.noFlags')}
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-6">
        <Button onClick={onCreateClick} className="cursor-pointer w-full sm:w-auto">
          {t('features.flags.createBtn')}
        </Button>
      </div>
    </Card>
  );
}
