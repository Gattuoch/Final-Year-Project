import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Users, Clock, Calendar, Send, FilePlus, Trash2, Play, Pause } from "lucide-react";

export function ScheduledTab({
  isLoading,
  scheduledReports,
  deliveryStatistics,
  setCreateScheduleDialogOpen,
  handleScheduleStatus,
  handleDeleteSchedule
}) {
  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Scheduled Report Deliveries</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage automatic report distribution</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => setCreateScheduleDialogOpen(true)}>
          <FilePlus className="w-4 h-4 mr-2" />
          New Schedule
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Report</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Recipients</TableHead>
                <TableHead className="text-xs sm:text-sm">Frequency</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Format</TableHead>
                <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Next Run</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500 text-sm">
                    {isLoading ? "Loading..." : "No scheduled reports. Click 'New Schedule' to start."}
                  </TableCell>
                </TableRow>
              ) : scheduledReports.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-xs sm:text-sm">{s.reportName}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm">{s.recipients}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs whitespace-nowrap ${s.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {s.frequency}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs uppercase">{s.format}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs sm:text-sm whitespace-nowrap text-gray-600 font-mono">{s.nextRun}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline" 
                        size="sm"
                        className={`h-8 px-2 sm:px-3 text-xs flex items-center gap-1 ${s.status !== 'Active' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
                        onClick={() => handleScheduleStatus(s.id, s.status)}
                      >
                        {s.status === 'Active' ? (
                          <><Pause className="w-3 h-3" /> <span className="hidden sm:inline">Pause</span></>
                        ) : (
                          <><Play className="w-3 h-3" /> <span className="hidden sm:inline">Resume</span></>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteSchedule(s.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delivery Statistics */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Delivery Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{scheduledReports.length}</p>
                <p className="text-xs sm:text-sm text-blue-700">Schedules</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Send className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{deliveryStatistics.reportsSent}</p>
                <p className="text-xs sm:text-sm text-green-700">Reports Sent</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">{deliveryStatistics.recipients}</p>
                <p className="text-xs sm:text-sm text-purple-700">Recipients</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-orange-900">{deliveryStatistics.successRate}</p>
                <p className="text-xs sm:text-sm text-orange-700">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
