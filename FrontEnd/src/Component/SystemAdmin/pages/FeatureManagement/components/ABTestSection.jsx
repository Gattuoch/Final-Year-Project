import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { TestTube, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function ABTestSection({ 
  abTests, 
  onEdit, 
  onDelete, 
  onStop, 
  onViewResults, 
  onCreateClick,
  activeTestResults,
  onCloseResults
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <TestTube className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            <div>
              <h2 className="text-lg md:text-xl font-semibold">{t('features.abTests.title')}</h2>
              <p className="text-xs md:text-sm text-gray-500">{t('features.abTests.subtitle')}</p>
            </div>
          </div>
          <Button onClick={onCreateClick} className="cursor-pointer w-full sm:w-auto">
            {t('features.abTests.newBtn')}
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {abTests.map((test) => (
            <div key={test.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm break-words flex-1">{test.name}</p>
                <Badge variant={test.status === "running" ? "default" : "secondary"} className="text-xs">
                  {test.status}
                </Badge>
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Variant:</span> {test.variant}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Traffic:</span> {test.traffic}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Metric:</span> {test.metric}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Start Date:</span> {test.startDate}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 cursor-pointer" onClick={() => onViewResults(test)}>
                  {t('features.abTests.table.results')}
                </Button>
                {test.status === "running" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onStop(test.id)}
                    className="flex-1 cursor-pointer"
                  >
                    {t('features.abTests.table.stop')}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(test)}
                  className="cursor-pointer px-2"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(test)}
                  className="cursor-pointer px-2"
                >
                  <Trash2 className="w-4 h-4" />
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
                <TableHead className="whitespace-nowrap">{t('features.abTests.table.name')}</TableHead>
                <TableHead>{t('features.abTests.table.variants')}</TableHead>
                <TableHead>{t('features.abTests.table.traffic')}</TableHead>
                <TableHead>{t('features.abTests.table.metric')}</TableHead>
                <TableHead>{t('features.abTests.table.date')}</TableHead>
                <TableHead>{t('features.abTests.table.status')}</TableHead>
                <TableHead>{t('features.abTests.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium break-words max-w-[200px]">{test.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{test.variant}</TableCell>
                  <TableCell className="whitespace-nowrap">{test.traffic}</TableCell>
                  <TableCell className="whitespace-nowrap">{test.metric}</TableCell>
                  <TableCell className="whitespace-nowrap">{test.startDate}</TableCell>
                  <TableCell>
                    <Badge variant={test.status === "running" ? "default" : "secondary"}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer"
                        onClick={() => onViewResults(test)}
                      >
                        {t('features.abTests.table.results')}
                      </Button>
                      {test.status === "running" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onStop(test.id)}
                          className="cursor-pointer"
                        >
                          {t('features.abTests.table.stop')}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(test)}
                        className="cursor-pointer px-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onDelete(test)}
                        className="cursor-pointer px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {abTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    {t('features.abTests.table.noTests')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {activeTestResults && activeTestResults.results && (
        <Card className="p-4 md:p-6 border-blue-200 bg-blue-50/30">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="font-semibold text-base md:text-lg">
              {t('features.abTests.results.title')} : {activeTestResults.name}
            </h3>
            <Button variant="ghost" size="sm" onClick={onCloseResults}>
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-white border border-blue-100 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm md:text-base">{t('features.abTests.results.variantA')}</h4>
                <Badge variant="outline" className="text-xs">{t('features.abTests.results.traffic', { percent: activeTestResults.results.variantA.traffic })}</Badge>
              </div>
              <p className="text-xl md:text-2xl font-bold mb-1">{activeTestResults.results.variantA.rate}%</p>
              <p className="text-xs md:text-sm text-gray-600">{t('features.abTests.results.convRate')}</p>
              <p className="text-xs text-gray-500 mt-2">
                {t('features.abTests.results.convStats', { 
                  conversions: activeTestResults.results.variantA.conversions.toLocaleString(), 
                  visitors: activeTestResults.results.variantA.visitors.toLocaleString() 
                })}
              </p>
            </div>
            <div className="p-3 md:p-4 bg-white border border-green-100 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm md:text-base">{t('features.abTests.results.variantB')}</h4>
                <Badge variant="outline" className="text-xs">{t('features.abTests.results.traffic', { percent: activeTestResults.results.variantB.traffic })}</Badge>
              </div>
              <p className="text-xl md:text-2xl font-bold mb-1 text-green-600">{activeTestResults.results.variantB.rate}%</p>
              <p className="text-xs md:text-sm text-gray-600">{t('features.abTests.results.convRate')}</p>
              <p className="text-xs text-gray-500 mt-2">
                {t('features.abTests.results.convStats', { 
                  conversions: activeTestResults.results.variantB.conversions.toLocaleString(), 
                  visitors: activeTestResults.results.variantB.visitors.toLocaleString() 
                })}
              </p>
              {activeTestResults.results.improvement > 0 && (
                <p className="text-xs md:text-sm text-green-600 mt-2">
                  {t('features.abTests.results.improvement', { percent: activeTestResults.results.improvement })}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
