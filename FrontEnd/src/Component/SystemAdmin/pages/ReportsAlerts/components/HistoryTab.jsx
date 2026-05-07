import { Card } from "../../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import { Users } from "lucide-react";

export function HistoryTab({ alertHistory }) {
  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Alert History</h2>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Type</TableHead>
                <TableHead className="text-xs sm:text-sm">Message</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Recipients</TableHead>
                <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Sent At</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertHistory.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">{alert.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] sm:max-w-md text-xs sm:text-sm">
                    {alert.message.length > 50 ? `${alert.message.substring(0, 50)}...` : alert.message}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      {alert.recipients}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs sm:text-sm whitespace-nowrap">
                    {alert.sentAt}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="text-xs">{alert.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
