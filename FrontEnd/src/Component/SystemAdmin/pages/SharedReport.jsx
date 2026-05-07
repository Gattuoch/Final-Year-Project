import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertTriangle, FileText, Clock, ArrowLeftRight } from "lucide-react";
import api from "../../../services/api";

export default function SharedReport() {
  const { hash } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/sysadmin/reports/shared/${hash}`);
        if (res.data?.success) {
          setReport(res.data.report);
        } else {
          setError(res.data?.message || "Unable to load shared report.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load shared report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Shared Report</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">View Report</h1>
          </div>
          <Button asChild variant="outline" className="h-10">
            <Link to="/">Go Home</Link>
          </Button>
        </div>

        {loading ? (
          <Card className="p-6 text-center text-slate-700">Loading shared report...</Card>
        ) : error ? (
          <Card className="p-6 bg-red-50 border border-red-200 text-red-700">
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle className="w-10 h-10" />
              <p className="text-lg font-semibold">Unable to load shared report</p>
              <p className="text-sm text-slate-700 max-w-2xl text-center">{error}</p>
            </div>
          </Card>
        ) : (
          <Card className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shared Report Link</p>
                <h2 className="text-2xl font-semibold text-slate-900">{report.name}</h2>
                <p className="mt-2 text-sm text-slate-600">Report type: {report.type}</p>
              </div>
              <Badge variant="outline" className="text-sm">
                Generated on {new Date(report.generatedAt).toLocaleString()}
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <FileText className="w-4 h-4" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">Overview</p>
                </div>
                <p className="text-sm text-slate-700">View the latest shared report summary from the system. This page is publicly available to anyone holding the share link.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">Performance</p>
                </div>
                <p className="text-sm text-slate-700">Uptime: {report.data.uptime}</p>
                <p className="mt-1 text-sm text-slate-700">Response time: {report.data.responseTime}</p>
                <p className="mt-1 text-sm text-slate-700">Error rate: {report.data.errorRate}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <ArrowLeftRight className="w-4 h-4" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">Data Snapshot</p>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  {Object.entries(report.data).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
