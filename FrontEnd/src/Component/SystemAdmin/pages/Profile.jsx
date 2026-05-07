import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Activity,
  Camera,
  Save,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../services/api";
import { useLanguage } from "../../../context/LanguageContext";

export function Profile() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    systemAlerts: true,
    securityAlerts: true,
    weeklyReports: false,
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchActivityLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile from:", api.defaults.baseURL + "/sysadmin/profile");
      const response = await api.get("/sysadmin/profile");
      const user = response.data;
      
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        position: user.metadata?.position || "",
        department: user.metadata?.department || "",
        location: user.metadata?.location || "",
        bio: user.metadata?.bio || "",
        avatar: user.avatar || "",
      });

      if (user.metadata?.preferences) {
        setPreferences({
          ...preferences,
          ...user.metadata.preferences,
          twoFactorAuth: user.metadata.twoFactorAuth || false
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const message = error.response?.data?.message || error.message || t('profile.messages.profileError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get("/sysadmin/profile/activity");
      setActivityLog(response.data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      const message = error.response?.data?.message || t('activity.messages.fetchError');
      // We don't necessarily want to toast for background activity logs if it fails, but let's do it for now to debug
      toast.error(message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch("/sysadmin/profile", profileData);
      toast.success(t('profile.messages.profileSuccess'));
      fetchActivityLogs();
    } catch (error) {
      console.error("Error updating profile:", error);
      const message = error.response?.data?.message || error.response?.data?.error || t('profile.messages.profileError');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error(t('profile.messages.passMismatch'));
      return;
    }
    if (passwords.new.length < 8) {
      toast.error(t('profile.messages.passLength'));
      return;
    }

    try {
      setSaving(true);
      await api.patch("/sysadmin/profile/security", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success(t('profile.messages.passSuccess'));
      setPasswords({ current: "", new: "", confirm: "" });
      fetchActivityLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || t('profile.messages.passError'));
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      setSaving(true);
      await api.patch("/sysadmin/profile/preferences", { preferences });
      toast.success(t('profile.messages.prefSuccess'));
      fetchActivityLogs();
    } catch (error) {
      console.error("Error updating preferences:", error);
      const message = error.response?.data?.message || t('profile.messages.prefError');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleTfaToggle = async (checked) => {
    try {
      setPreferences({ ...preferences, twoFactorAuth: checked });
      await api.patch("/sysadmin/profile/security", { twoFactorAuth: checked });
      toast.success(checked ? t('profile.security.tfaEnabled') : t('profile.security.tfaDisabled'));
      fetchActivityLogs();
    } catch (error) {
      console.error("Error toggling MFA:", error);
      const message = error.response?.data?.message || t('profile.messages.securityError');
      toast.error(message);
      setPreferences({ ...preferences, twoFactorAuth: !checked });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setProfileData({ ...profileData, avatar: base64Image });
        try {
          await api.patch("/sysadmin/profile", { avatar: base64Image });
          toast.success(t('profile.messages.avatarSuccess'));
          fetchActivityLogs();
        } catch (error) {
          console.error("Error updating avatar:", error);
          const message = error.response?.data?.message || t('profile.messages.avatarError');
          toast.error(message);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-500 mt-1">{t('profile.subtitle')}</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">
          <Shield className="w-3 h-3 mr-1" />
          {t('profile.status')}
        </Badge>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1">
          <TabsTrigger value="personal" className="flex-1 min-w-[120px]">{t('profile.tabs.personal')}</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 min-w-[120px]">{t('profile.tabs.security')}</TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1 min-w-[120px]">{t('profile.tabs.preferences')}</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1 min-w-[120px]">{t('profile.tabs.activity')}</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b text-center sm:text-left">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-600 flex items-center justify-center text-white text-2xl font-semibold">
                        {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                      </div>
                    )}
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 cursor-pointer hover:bg-gray-50 shadow-sm">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-gray-500">{profileData.position || t('profile.personal.admin')}</p>
                  <p className="text-sm text-gray-400">{profileData.department || t('profile.personal.dept')}</p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('profile.personal.firstName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('profile.personal.lastName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.personal.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile.personal.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">{t('profile.personal.position')}</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">{t('profile.personal.department')}</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('profile.personal.location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('profile.personal.bio')}</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder={t('profile.personal.bioPlaceholder')}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('profile.personal.saveBtn')}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('profile.security.title')}</h3>
                <p className="text-sm text-gray-500">{t('profile.security.subtitle')}</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('profile.security.current')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('profile.security.new')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('profile.security.confirm')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {t('profile.security.requirements')}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    {t('profile.security.updateBtn')}
                  </Button>
                </div>
              </form>

              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{t('profile.security.tfa')}</h4>
                    <p className="text-sm text-gray-500">{t('profile.security.tfaDesc')}</p>
                  </div>
                  <Switch
                    checked={preferences.twoFactorAuth}
                    onCheckedChange={handleTfaToggle}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('profile.preferences.title')}</h3>
                <p className="text-sm text-gray-500">{t('profile.preferences.subtitle')}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('profile.preferences.email')}</p>
                      <p className="text-sm text-gray-500">{t('profile.preferences.emailDesc')}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('profile.preferences.system')}</p>
                      <p className="text-sm text-gray-500">{t('profile.preferences.systemDesc')}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.systemAlerts}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, systemAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('profile.preferences.security')}</p>
                      <p className="text-sm text-gray-500">{t('profile.preferences.securityDesc')}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.securityAlerts}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, securityAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{t('profile.preferences.weekly')}</p>
                      <p className="text-sm text-gray-500">{t('profile.preferences.weeklyDesc')}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReports: checked })}
                  />
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold mb-4">{t('profile.preferences.sessionTitle')}</h4>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">{t('profile.preferences.sessionTimeout')}</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={preferences.sessionTimeout}
                    onChange={(e) => setPreferences({ ...preferences, sessionTimeout: e.target.value })}
                    min="5"
                    max="120"
                    className="w-full sm:max-w-xs"
                  />
                  <p className="text-sm text-gray-500">{t('profile.preferences.sessionDesc')}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePreferencesUpdate} className="bg-green-600 hover:bg-green-700" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('profile.preferences.saveBtn')}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{t('profile.activity.title')}</h3>
                <p className="text-sm text-gray-500">{t('profile.activity.subtitle')}</p>
              </div>

              <div className="space-y-3">
                {activityLog.length > 0 ? (
                  activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Activity className={`w-4 h-4 ${
                          activity.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          </div>
                          <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className={
                            activity.status === 'success'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {t('profile.activity.noActivity')}
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={fetchActivityLogs}>{t('profile.activity.refresh')}</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
