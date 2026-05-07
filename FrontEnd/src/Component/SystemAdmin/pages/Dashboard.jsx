import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Tent,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "sonner";
import { useLanguage } from "../../../context/LanguageContext";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    occupancyRate: 0,
    conversionRate: 0,
    pendingCamps: 0,
    pendingKYC: 0,
    uptime: 99.9,
    errorRate: 0.03,
    warningCount: 0,
    criticalErrors: 0
  });

  const [charts, setCharts] = useState({
    revenueTrend: [],
    occupancyTrend: [],
    systemHealthData: [],
    apiLatencyData: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/sysadmin/dashboard");

      if (res.data) {
        setMetrics(res.data.metrics);
        setCharts(res.data.charts);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error(t('dashboard.errorLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center text-gray-500 font-medium">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={isLoading} variant="outline" className="gap-2 cursor-pointer w-full sm:w-auto justify-center">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/financial')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.totalRevenue')}</p>
              <p className="text-2xl font-bold mt-1">ETB {metrics.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{t('dashboard.revenueGrowth')}</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/users')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.activeUsers')}</p>
              <p className="text-2xl font-bold mt-1">{metrics.activeUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{t('dashboard.usersGrowth')}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/camps')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.occupancyRate')}</p>
              <p className="text-2xl font-bold mt-1">{metrics.occupancyRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{t('dashboard.occupancyGrowth')}</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Tent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/reports')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.conversionRate')}</p>
              <p className="text-2xl font-bold mt-1">{metrics.conversionRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>{t('dashboard.conversionGrowth')}</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/camps')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.pendingCamps')}</p>
              <p className="text-3xl font-bold mt-2">{metrics.pendingCamps}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/camps')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.pendingKYC')}</p>
              <p className="text-3xl font-bold mt-2">{metrics.pendingKYC}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/super-admin/logs')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.systemUptime')}</p>
              <p className="text-3xl font-bold mt-2">{metrics.uptime}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('dashboard.charts.revenue')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('dashboard.charts.occupancy')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System Health & API Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('dashboard.charts.resources')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.systemHealthData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {charts.systemHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">{t('dashboard.charts.latency')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.apiLatencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="p50" stroke="#10b981" name="P50" />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" name="P95" />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* System Status */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{t('dashboard.health.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.health.webServer')}</p>
              <p className="font-semibold mt-1">{t('dashboard.health.healthy')}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.health.database')}</p>
              <p className="font-semibold mt-1">{t('dashboard.health.healthy')}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">{t('dashboard.health.redis')}</p>
              <p className="font-semibold mt-1">{t('dashboard.health.hitRatio', { ratio: '94.2' })}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Error Monitoring */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{t('dashboard.errors.title')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">{t('dashboard.errors.rate')}</p>
                <p className="text-sm text-gray-500">{t('dashboard.errors.last24')}</p>
              </div>
            </div>
            <p className="font-semibold">{metrics.errorRate}%</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">{t('dashboard.errors.warnings')}</p>
                <p className="text-sm text-gray-500">{t('dashboard.errors.lastHour')}</p>
              </div>
            </div>
            <p className="font-semibold">{metrics.warningCount}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium">{t('dashboard.errors.critical')}</p>
                <p className="text-sm text-gray-500">{t('dashboard.errors.last7Days')}</p>
              </div>
            </div>
            <p className="font-semibold">{metrics.criticalErrors}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
export default Dashboard;