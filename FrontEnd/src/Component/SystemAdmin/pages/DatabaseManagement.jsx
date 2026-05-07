import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Database, Zap, Search, Activity, Terminal, Shield, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";
import api from "../../../services/api";
import { useLanguage } from "../../../context/LanguageContext";

export function DatabaseManagement() {
  const { t } = useLanguage();
  const [dbData, setDbData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fetchDbData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/db-management");
      if (res.data && res.data.success) {
        setDbData(res.data.data);
      }
    } catch (error) {
      console.error("DB Data Fetch Error:", error);
      toast.error("Failed to load database metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      const res = await api.post("/db-management/optimize/all");
      toast.success(res.data.message || "Database optimization started");
    } catch (error) {
      toast.error("Optimization failed");
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen px-4 text-center">Loading Database Metrics...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Monitor performance, optimize queries, and manage schema</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={fetchDbData} variant="outline" size="icon" className="shrink-0 cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleOptimize} disabled={isOptimizing} className="gap-2 flex-1 sm:flex-none cursor-pointer">
            {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Optimize All
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Database Size</h3>
          </div>
          <p className="text-xl font-bold">{dbData?.overview?.systemDb}</p>
          <p className="text-xs text-gray-500 mt-1">MongoDB Atlas Cluster</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-sm">Active Collections</h3>
          </div>
          <p className="text-xl font-bold">{dbData?.overview?.collections}</p>
          <p className="text-xs text-gray-500 mt-1">Total system collections</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-sm">Query Performance</h3>
          </div>
          <p className="text-xl font-bold">{dbData?.overview?.performance}</p>
          <p className="text-xs text-green-600 mt-1">Optimal index usage</p>
        </Card>
      </div>

      {/* Slow Queries & Indexes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Slow Query Log</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Executions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbData?.slowQueries?.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-xs max-w-[200px] break-all">{q.query}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100">{q.duration}</Badge>
                    </TableCell>
                    <TableCell>{q.executions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Index Health</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index Name</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbData?.indexes?.map((idx, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{idx.name}</TableCell>
                    <TableCell>{idx.table}</TableCell>
                    <TableCell>{idx.usage}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Migration History */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Schema Migrations</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Migration ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbData?.migrations?.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-sm">{m.id}</TableCell>
                  <TableCell>{m.description}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-700">Completed</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{m.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
