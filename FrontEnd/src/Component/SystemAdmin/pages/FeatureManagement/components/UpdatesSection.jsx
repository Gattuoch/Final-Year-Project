import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Package, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function UpdatesSection({ 
  updates, 
  onCheckUpdates, 
  onCreateUpdate, 
  onEditUpdate, 
  onDeleteUpdate,
  onDeployUpdate
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            <div>
              <h2 className="text-lg md:text-xl font-semibold">{t('features.updates.title')}</h2>
              <p className="text-xs md:text-sm text-gray-500">{t('features.updates.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={onCheckUpdates} className="cursor-pointer"> 
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('features.updates.checkBtn')}
            </Button>
            <Button 
              className="cursor-pointer"
              onClick={onCreateUpdate}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('features.updates.createBtn')}
            </Button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {updates.map((update) => (
            <div key={update.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-mono font-medium text-sm">{update.version}</p>
                <Badge variant="default" className="text-xs">{update.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Description:</p>
                <p className="text-sm break-words mt-1">{update.description}</p>
              </div>
              <div className="text-xs text-gray-500">
                Date: {update.date}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" onClick={() => onEditUpdate(update)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => onDeleteUpdate(update)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {updates.length === 0 && (
            <div className="text-center py-6 md:py-8 text-gray-500 text-sm">
              {t('features.updates.table.noUpdates')}
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('features.updates.table.version')}</TableHead>
                <TableHead>{t('features.updates.table.desc')}</TableHead>
                <TableHead>{t('features.updates.table.date')}</TableHead>
                <TableHead>{t('features.updates.table.status')}</TableHead>
                <TableHead>{t('features.updates.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell className="font-mono whitespace-nowrap">{update.version}</TableCell>
                  <TableCell className="break-words max-w-md">{update.description}</TableCell>
                  <TableCell className="whitespace-nowrap">{update.date}</TableCell>
                  <TableCell>
                    <Badge variant="default">{update.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => onEditUpdate(update)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => onDeleteUpdate(update)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {updates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    {t('features.updates.table.noUpdates')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">{t('features.updates.pending')}</h3>
        <div className="space-y-3">
          {updates.filter(u => u.status === "available" || u.status === "pending").map((update) => (
            <div key={update.id} className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-sm md:text-base">{update.description} <span className="font-bold">{update.version}</span></p>
                  <p className="text-xs md:text-sm text-gray-600">{update.date}</p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <Badge variant="default" className="text-xs">{t('features.updates.available') || 'Available'}</Badge>
                  <Button onClick={onDeployUpdate} size="sm" className="cursor-pointer">
                    {t('features.deployment.deployBtn') || 'Deploy Update'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {updates.filter(u => u.status === "available" || u.status === "pending").length === 0 && (
            <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">{t('features.updates.noPending', 'System is up to date.')}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
