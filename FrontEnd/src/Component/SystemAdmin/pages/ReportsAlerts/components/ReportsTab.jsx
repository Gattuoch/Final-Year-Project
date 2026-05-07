import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Mail, Link2, Download, FileText, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ReportsTab({
  reportTemplates,
  isLoading,
  metrics,
  uptimeData,
  resourceUtilization,
  generatingReportId,
  handleOpenSendDialog,
  handleGenerateShareLink,
  handleExportReport,
  handleGenerateReport
}) {
  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Quick Actions Card - Mobile Optimized */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
            <p className="text-xs sm:text-sm text-gray-600">Send reports to stakeholders instantly</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white flex-1 sm:flex-initial"
              disabled={isLoading || reportTemplates.length === 0}
              onClick={() => {
                if (reportTemplates.length > 0) {
                  handleOpenSendDialog(reportTemplates[0].id, reportTemplates[0].name);
                }
              }}
            >
              <Mail className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-sm">Email</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white flex-1 sm:flex-initial"
              disabled={isLoading || reportTemplates.length === 0}
              onClick={() => {
                if (reportTemplates.length > 0) {
                  handleGenerateShareLink(reportTemplates[0].id);
                }
              }}
            >
              <Link2 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-sm">Link</span>
            </Button>
            <Select
              disabled={isLoading || reportTemplates.length === 0}
              onValueChange={(format) => {
                if (reportTemplates.length > 0) {
                  handleExportReport(reportTemplates[0].id, format);
                }
              }}
            >
              <SelectTrigger className="w-auto sm:w-40 bg-white flex-1 sm:flex-initial">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <SelectValue placeholder="Download" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {reportTemplates.length === 0 && !isLoading && (
          <p className="text-xs text-orange-600 mt-2">No report templates available. Please wait for data to load or contact support.</p>
        )}
      </Card>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">System Uptime</h3>
          <p className="text-xl sm:text-2xl font-bold mb-1">{metrics.systemUptime}</p>
          <p className="text-xs sm:text-sm text-gray-500">Last 30 days</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">API Response Time</h3>
          <p className="text-xl sm:text-2xl font-bold mb-1">{metrics.apiResponseTime}</p>
          <p className="text-xs sm:text-sm text-gray-500">Average (p50)</p>
        </Card>

        <Card className="p-4 sm:p-6">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Error Rate</h3>
          <p className="text-xl sm:text-2xl font-bold mb-1">{metrics.errorRate}</p>
          <p className="text-xs sm:text-sm text-gray-500">Last 24 hours</p>
        </Card>
      </div>

      {/* Chart - Mobile Responsive */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">System Uptime Trend</h2>
        <div className="w-full h-[250px] sm:h-[300px] min-h-[250px]">
          {uptimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={250}>
              <LineChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis domain={[99.9, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {isLoading ? "Loading chart data..." : "No chart data available"}
            </div>
          )}
        </div>
      </Card>

      {/* Reports Table - Horizontal Scroll for Mobile */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Available Reports</h2>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Report Name</TableHead>
                <TableHead className="text-xs sm:text-sm">Type</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Schedule</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Last Run</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportTemplates.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium text-xs sm:text-sm">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{report.schedule}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">{report.lastRun}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 sm:h-9 text-xs"
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={generatingReportId === report.id}
                      >
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">
                          {generatingReportId === report.id ? "Generating..." : "Generate"}
                        </span>
                        <span className="sm:hidden">
                          {generatingReportId === report.id ? "Gen..." : "Gen"}
                        </span>
                      </Button>
                      <Select onValueChange={(format) => handleExportReport(report.id, format)}>
                        <SelectTrigger className="w-20 sm:w-32 h-8 sm:h-9 text-xs">
                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <SelectValue placeholder="Export" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 sm:h-9 text-xs"
                        onClick={() => handleOpenSendDialog(report.id, report.name)}
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Send</span>
                        <span className="sm:hidden">Send</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Resource Utilization - Responsive Grid */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Resource Utilization</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">CPU Usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span>Average</span>
                  <span className="font-semibold">{resourceUtilization.cpu?.average}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: resourceUtilization.cpu?.average?.includes('%') ? resourceUtilization.cpu.average : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span>Peak</span>
                  <span className="font-semibold">{resourceUtilization.cpu?.peak}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 opacity-60">
                  <div 
                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: resourceUtilization.cpu?.peak?.includes('%') ? resourceUtilization.cpu.peak : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">Memory Usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span>Average</span>
                  <span className="font-semibold">{resourceUtilization.memory?.average}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: resourceUtilization.memory?.average?.includes('%') ? resourceUtilization.memory.average : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span>Peak</span>
                  <span className="font-semibold">{resourceUtilization.memory?.peak}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 opacity-60">
                  <div 
                    className="bg-purple-400 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: resourceUtilization.memory?.peak?.includes('%') ? resourceUtilization.memory.peak : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">Disk I/O</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Read Speed</span>
                <span className="font-semibold">{resourceUtilization.disk?.read}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Write Speed</span>
                <span className="font-semibold">{resourceUtilization.disk?.write}</span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">Network Traffic</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Inbound</span>
                <span className="font-semibold">{resourceUtilization.network?.inbound}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Outbound</span>
                <span className="font-semibold">{resourceUtilization.network?.outbound}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
