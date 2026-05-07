import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { Button } from "../../../ui/button";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../../../services/api";

export function SecurityPolicies({ policy, onUpdate, isLoading }) {
  const [formData, setFormData] = useState({
    mfaEnabled: true,
    minPasswordLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  });
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    }
  }, [policy]);

  const handleSavePasswordPolicy = async () => {
    try {
      setIsSaving(true);
      const res = await api.put("/sysadmin/security/policy", {
        ...formData,
        minPasswordLength: formData.minPasswordLength === "" ? 0 : parseInt(formData.minPasswordLength)
      });
      toast.success(res.data.message || "Password policy updated successfully");
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update password policy"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6">

      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 mb-4 md:mb-6">
        <Lock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Password & Authentication Policies
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Configure password complexity and MFA requirements
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">

        {/* MFA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b">
          <div>
            <Label className="text-sm sm:text-base font-medium">
              Multi-Factor Authentication (MFA)
            </Label>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Require all administrators to use MFA
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <Switch 
              checked={formData.mfaEnabled} 
              onCheckedChange={(val) => handleChange("mfaEnabled", val)} 
            />
          </div>
        </div>

        {/* Password Length */}
        <div className="space-y-2 sm:space-y-3">
          <Label className="text-sm sm:text-base">
            Minimum Password Length
          </Label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Input 
              type="number" 
              value={formData.minPasswordLength || ""} 
              onChange={(e) => handleChange("minPasswordLength", e.target.value === "" ? "" : parseInt(e.target.value))}
              className="w-full sm:w-32 text-sm"
            />
            <span className="text-xs sm:text-sm text-gray-500">
              characters
            </span>
          </div>
        </div>

        {/* Special Characters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b">
          <div>
            <Label className="text-sm sm:text-base font-medium">
              Require Special Characters
            </Label>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Password must include @, #, $, etc.
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <Switch 
              checked={formData.requireSpecialChars} 
              onCheckedChange={(val) => handleChange("requireSpecialChars", val)} 
            />
          </div>
        </div>

        {/* Numbers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b">
          <div>
            <Label className="text-sm sm:text-base font-medium">
              Require Numbers
            </Label>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Password must include at least one number
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <Switch 
              checked={formData.requireNumbers} 
              onCheckedChange={(val) => handleChange("requireNumbers", val)} 
            />
          </div>
        </div>

        {/* Uppercase */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b">
          <div>
            <Label className="text-sm sm:text-base font-medium">
              Require Uppercase Letters
            </Label>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Password must include uppercase characters
            </p>
          </div>
          <div className="self-end sm:self-auto">
            <Switch 
              checked={formData.requireUppercase} 
              onCheckedChange={(val) => handleChange("requireUppercase", val)} 
            />
          </div>
        </div>

        {/* Button */}
        <div className="pt-2 md:pt-4">
          <Button 
            onClick={handleSavePasswordPolicy}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto text-sm"
          >
            {isSaving ? "Saving..." : "Save Password Policy"}
          </Button>
        </div>

      </div>
    </Card>
  );
}