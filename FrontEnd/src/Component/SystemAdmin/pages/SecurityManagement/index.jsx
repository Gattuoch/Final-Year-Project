import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../../services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SecurityPolicies } from "./components/SecurityPolicies";
import { IPBlacklist } from "./components/IPBlacklist";
import { SecurityIncidents } from "./components/SecurityIncidents";
import { VulnerabilityScans } from "./components/VulnerabilityScans";

export function SecurityManagement() {
  const [securityData, setSecurityData] = useState({
    policy: {
      mfaEnabled: true,
      minPasswordLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true
    },
    blockedIPs: [],
    incidents: [],
    scans: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    if (error.response) {
      const data = error.response.data;
      return data?.message || data?.error || (typeof data === 'string' ? data : fallback);
    } else if (error.request) {
      return "Connection error: No response from the server.";
    }
    return error.message || fallback || "An unexpected error occurred.";
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/sysadmin/security");
      setSecurityData(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load security data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-3 md:px-0">
      
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Security Management
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
          Enforce and monitor platform security policies
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="policies" className="space-y-3 sm:space-y-4 md:space-y-6">
        
        {/* Responsive Tabs */}
        <div className="w-full">
          <TabsList className="
            flex 
            flex-wrap md:flex-nowrap 
            justify-start md:justify-start 
            gap-1 sm:gap-2
            w-full
          ">
            
            <TabsTrigger 
              value="policies"
              className="
                flex-1 md:flex-none
                text-[10px] sm:text-xs md:text-sm
                px-2 sm:px-3 py-1.5 sm:py-2
                whitespace-nowrap
              "
            >
              Security Policies
            </TabsTrigger>

            <TabsTrigger 
              value="ip-blacklist"
              className="
                flex-1 md:flex-none
                text-[10px] sm:text-xs md:text-sm
                px-2 sm:px-3 py-1.5 sm:py-2
                whitespace-nowrap
              "
            >
              IP Blacklist
            </TabsTrigger>

            <TabsTrigger 
              value="incidents"
              className="
                flex-1 md:flex-none
                text-[10px] sm:text-xs md:text-sm
                px-2 sm:px-3 py-1.5 sm:py-2
                whitespace-nowrap
              "
            >
              Security Incidents
            </TabsTrigger>

            <TabsTrigger 
              value="scans"
              className="
                flex-1 md:flex-none
                text-[10px] sm:text-xs md:text-sm
                px-2 sm:px-3 py-1.5 sm:py-2
                whitespace-nowrap
              "
            >
              Vulnerability Scans
            </TabsTrigger>

          </TabsList>
        </div>

        {/* Content */}
        <TabsContent value="policies" className="space-y-3 sm:space-y-4 md:space-y-6">
          <SecurityPolicies 
            policy={securityData.policy} 
            onUpdate={fetchData} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="ip-blacklist" className="space-y-3 sm:space-y-4 md:space-y-6">
          <IPBlacklist 
            blockedIPs={securityData.blockedIPs} 
            onUpdate={fetchData} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="incidents" className="space-y-3 sm:space-y-4 md:space-y-6">
          <SecurityIncidents 
            incidents={securityData.incidents} 
            isLoading={isLoading} 
            onUpdate={fetchData}
          />
        </TabsContent>

        <TabsContent value="scans" className="space-y-3 sm:space-y-4 md:space-y-6">
          <VulnerabilityScans 
            scans={securityData.scans} 
            isLoading={isLoading} 
            onUpdate={fetchData}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}