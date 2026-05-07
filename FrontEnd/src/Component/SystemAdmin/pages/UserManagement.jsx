import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Users, UserPlus, Ban, AlertTriangle, Shield, RefreshCw, Eye, EyeOff, CheckCircle, History, ShieldCheck, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { cn } from "../ui/utils";
import { useLanguage } from "../../../context/LanguageContext";

export function UserManagement() {
    const { t } = useLanguage();
    const [campers, setCampers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [warningMessage, setWarningMessage] = useState("");
    const [banReason, setBanReason] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [managerSearchQuery, setManagerSearchQuery] = useState("");
    const [managerStatusFilter, setManagerStatusFilter] = useState("all");
    const [isEditing, setIsEditing] = useState(false);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [moderationLogs, setModerationLogs] = useState([]);


    // Form inputs for creating a new user
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newRole, setNewRole] = useState("camper");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [createdUserCredentials, setCreatedUserCredentials] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const [campersRes, managersRes, logsRes] = await Promise.all([
                api.get("/sysadmin/users/campers"),
                api.get("/sysadmin/users/managers"),
                api.get("/sysadmin/users/moderation/logs")
            ]);

            const mapUser = (u) => ({
                id: u._id,
                name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
                firstName: u.firstName || u.fullName?.split(' ')[0] || '',
                lastName: u.lastName || u.fullName?.split(' ').slice(1).join(' ') || '',
                email: u.email,
                phone: u.phone || "N/A",
                joined: new Date(u.createdAt).toLocaleDateString(),
                bookings: u.bookingCount || 0,
                status: u.isBanned ? "banned" : u.isActive ? "active" : "suspended",
                camp: u.businessInfo?.businessName || 'N/A',
                kycStatus: u.businessInfo?.status || 'pending',
                originalData: u
            });


            setCampers(campersRes.data.map(mapUser));
            setManagers(managersRes.data.map(mapUser));
            setModerationLogs(logsRes.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(t('user.error.load'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuspendUser = async (id) => {
        try {
            await api.put(`/sysadmin/users/${id}/status`, { status: "suspended" });
            toast.success(t('user.success.suspend'));
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || t('user.error.suspend'));
        }
    };

    const handleBanUser = async (id) => {
        if (banReason) {
            try {
                await api.put(`/sysadmin/users/${id}/status`, { status: "banned", banReason });
                toast.success(t('user.success.ban'));
                setBanReason("");
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || t('user.error.ban'));
            }
        } else {
            toast.error(t('user.error.reasonRequired'));
        }
    };

    const handleUnblockUser = async (id) => {
        try {
            await api.put(`/sysadmin/users/${id}/status`, { status: "active" });
            toast.success(t('user.success.unblock'));
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || t('user.error.unblock'));
        }
    };

    const handleSendWarning = async (id) => {
        if (warningMessage) {
            try {
                await api.put(`/sysadmin/users/${id}/warning`, { warningMessage });
                toast.success(t('user.success.warning'));
                setWarningMessage("");
            } catch (error) {
                toast.error(t('user.error.warning'));
            }
        }
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(password);
        setShowNewPassword(true);
        toast.success(t('user.success.passwordGenerated'));
    };

    const handleCreateUser = async () => {
        if (!newEmail || !newFirstName) return toast.error(t('user.error.nameEmailRequired'));
        try {
            const res = await api.post("/sysadmin/users", {
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
                phone: newPhone,
                role: newRole,
                password: newPassword || "Temporary123!"
            });

            const credentials = {
                email: newEmail,
                password: newPassword || "Temporary123!",
                role: newRole
            };

            setCreatedUserCredentials(credentials);
            toast.success(t('user.success.create'));
            setNewFirstName(""); setNewLastName(""); setNewEmail(""); setNewPhone(""); setNewRole("camper"); setNewPassword("");
            fetchUsers();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || t('user.error.create');
            toast.error(errorMsg);
        }
    };



    const handleRevokeRole = async (userId, role) => {
        try {
            await api.put(`/sysadmin/users/${userId}/role`, { role: "camper" });
            toast.success(t('user.success.revoke'));
            fetchUsers();
        } catch (error) {
            toast.error(t('user.error.revoke'));
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/sysadmin/users/permanent-delete/${userToDelete.id}`);
            toast.success(
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{t('user.success.deleteTitle')}</p>
                    <p className="text-sm">{t('user.success.deleteDesc')}</p>
                </div>,
                { duration: 5000, icon: '🗑️' }
            );
            fetchUsers();
            setUserToDelete(null);
            setSelectedUser(null);
        } catch (error) {
            toast.error(error.response?.data?.message || t('user.error.delete'));
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredCampers = campers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredManagers = managers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(managerSearchQuery.toLowerCase());
        const matchesStatus = managerStatusFilter === 'all' || user.status === managerStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const startEditing = (user) => {
        setSelectedUser(user);
        setEditFirstName(user.firstName);
        setEditLastName(user.lastName);
        setEditEmail(user.email);
        setEditPhone(user.phone === "N/A" ? "" : user.phone);
        setIsEditing(true);
    };

    const handleUpdateUser = async () => {
        try {
            await api.put(`/sysadmin/users/${selectedUser.id}`, {
                fullName: `${editFirstName} ${editLastName}`.trim(),
                firstName: editFirstName,
                lastName: editLastName,
                email: editEmail,
                phone: editPhone
            });
            toast.success(t('user.success.update'));
            setIsEditing(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || t('user.error.update'));
        }
    };


    const handleApproveKYC = async (userId) => {
        try {
            await api.put(`/sysadmin/users/${userId}`, { kycStatus: "approved" });
            toast.success(t('user.success.approve'));
            fetchUsers();
        } catch (error) {
            toast.error(t('user.error.approve'));
        }
    };


    return (
        <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-0 pb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{t('user.title')}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t('user.subtitle')}</p>
                </div>
                <Button onClick={fetchUsers} disabled={isLoading} variant="outline" className="gap-2 cursor-pointer w-full sm:w-auto justify-center">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('user.refresh')}
                </Button>
            </div>

            {/* Overview Stats - Mobile optimized grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('user.stats.campers')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">{campers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('user.stats.campersDesc')}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('user.stats.managers')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">{managers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('user.stats.managersDesc')}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('user.stats.suspended')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">{campers.filter(c => c.status === 'suspended').length + managers.filter(m => m.status === 'suspended').length}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('user.stats.suspendedDesc')}</p>
                </Card>

                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <Ban className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                        <h3 className="font-semibold text-sm md:text-base">{t('user.stats.banned')}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-bold">{campers.filter(c => c.status === 'banned').length + managers.filter(m => m.status === 'banned').length}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('user.stats.bannedDesc')}</p>
                </Card>
            </div>

            {/* Tabs - Mobile optimized */}
            <Tabs defaultValue="campers" className="space-y-4 md:space-y-6">
                <TabsList className="bg-white border border-gray-200 flex flex-wrap h-auto p-1 gap-1">
                    <TabsTrigger value="campers" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
                        {t('user.tabs.campers')}
                    </TabsTrigger>
                    <TabsTrigger value="managers" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
                        {t('user.tabs.managers')}
                    </TabsTrigger>
                    <TabsTrigger value="create" className="flex-1 min-w-[100px] cursor-pointer text-sm sm:text-base py-2">
                        {t('user.tabs.create')}
                    </TabsTrigger>
                </TabsList>

                {/* Campers Tab */}
                <TabsContent value="campers" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('user.camperTab.title')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('user.camperTab.subtitle')}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    placeholder={t('user.camperTab.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64"
                                />
                                <Select defaultValue="all" onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('user.camperTab.statusFilter.all')}</SelectItem>
                                        <SelectItem value="active">{t('user.camperTab.statusFilter.active')}</SelectItem>
                                        <SelectItem value="suspended">{t('user.camperTab.statusFilter.suspended')}</SelectItem>
                                        <SelectItem value="banned">{t('user.camperTab.statusFilter.banned')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Mobile card view for campers */}
                        <div className="block lg:hidden space-y-3">
                            {isLoading ? (
                                <div className="text-center py-6 text-gray-500 text-sm">{t('user.camperTab.table.loading')}</div>
                            ) : filteredCampers.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 text-sm">{t('user.camperTab.table.noUsers')}</div>
                            ) : (
                                filteredCampers.map((user) => (
                                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm break-words">{user.name}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-1">{user.id.substring(0, 8)}...</p>
                                            </div>
                                            <Badge variant={
                                                user.status === "active" ? "default" :
                                                    user.status === "suspended" ? "secondary" :
                                                        "destructive"
                                            } className="text-xs">
                                                {user.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <p><span className="text-gray-500">Email:</span> <span className="break-words">{user.email}</span></p>
                                            <p><span className="text-gray-500">Phone:</span> {user.phone}</p>
                                            <p><span className="text-gray-500">Joined:</span> {user.joined}</p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedUser(user)}
                                                    className="cursor-pointer w-full text-sm"
                                                >
                                                    {t('user.camperTab.table.manage')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[95vw] sm:max-w-lg p-4 md:p-6">
                                                <DialogHeader>
                                                    <DialogTitle className="text-base sm:text-lg break-words">
                                                        {t('user.camperTab.dialog.title', { name: user.name })}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                                    {isEditing ? (
                                                        <div className="space-y-3 p-3 md:p-4 bg-gray-50 rounded-lg border">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">First Name</Label>
                                                                    <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="text-sm" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">Last Name</Label>
                                                                    <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} className="text-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Email</Label>
                                                                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="text-sm" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Phone</Label>
                                                                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="text-sm" />
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                                <Button onClick={handleUpdateUser} className="flex-1 text-sm">Save Changes</Button>
                                                                <Button variant="outline" onClick={() => setIsEditing(false)} className="text-sm">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.email')}</Label>
                                                                <p className="text-sm font-medium break-words">{user.email}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.phone')}</Label>
                                                                <p className="text-sm font-medium">{user.phone}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.bookings')}</Label>
                                                                <p className="text-sm font-semibold">{user.bookings}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.joined')}</Label>
                                                                <p className="text-sm font-medium">{user.joined}</p>
                                                            </div>
                                                            <div className="col-span-full">
                                                                <Button variant="ghost" size="sm" onClick={() => startEditing(user)} className="text-blue-600 h-7 p-0 hover:bg-transparent text-xs">
                                                                    {t('user.camperTab.dialog.info.editDetails')}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <Label className="text-xs">{t('user.camperTab.dialog.warning.label')}</Label>
                                                        <Textarea
                                                            value={warningMessage}
                                                            onChange={(e) => setWarningMessage(e.target.value)}
                                                            placeholder={t('user.camperTab.dialog.warning.placeholder')}
                                                            rows={2}
                                                            className="mt-1 text-sm"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="mt-2 cursor-pointer w-full text-sm"
                                                            onClick={() => handleSendWarning(user.id)}
                                                        >
                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                            {t('user.camperTab.dialog.warning.btn')}
                                                        </Button>
                                                    </div>

                                                    <div className="pt-4 border-t space-y-3">
                                                        {user.status === "active" && (
                                                            <Button
                                                                variant="outline"
                                                                className="w-full cursor-pointer text-sm"
                                                                onClick={() => handleSuspendUser(user.id)}
                                                            >
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                {t('user.camperTab.dialog.actions.suspend')}
                                                            </Button>
                                                        )}

                                                        {(user.status === "suspended" || user.status === "banned") && (
                                                            <Button
                                                                variant="outline"
                                                                className="w-full cursor-pointer text-sm"
                                                                onClick={() => handleUnblockUser(user.id)}
                                                            >
                                                                {t('user.camperTab.dialog.actions.unblock')}
                                                            </Button>
                                                        )}

                                                        {user.status !== "banned" && (
                                                            <>
                                                                <Textarea
                                                                    value={banReason}
                                                                    onChange={(e) => setBanReason(e.target.value)}
                                                                    placeholder={t('user.camperTab.dialog.actions.banPlaceholder')}
                                                                    rows={2}
                                                                    className="text-sm"
                                                                />
                                                                <Button
                                                                    variant="destructive"
                                                                    className="w-full cursor-pointer text-sm"
                                                                    onClick={() => handleBanUser(user.id)}
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    {t('user.camperTab.dialog.actions.banBtn')}
                                                                </Button>
                                                            </>
                                                        )}

                                                        <Button
                                                            variant="destructive"
                                                            className="w-full cursor-pointer mt-4 text-sm"
                                                            onClick={() => setUserToDelete(user)}
                                                        >
                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                            {t('user.camperTab.dialog.actions.deleteBtn')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop table view */}
                        <div className="hidden lg:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">{t('user.camperTab.table.id')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.name')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.email')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.phone')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.joined')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.status')}</TableHead>
                                        <TableHead>{t('user.camperTab.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={7} className="text-center py-6">{t('user.camperTab.table.loading')}</TableCell></TableRow>
                                    ) : filteredCampers.length === 0 ? (
                                        <TableRow><TableCell colSpan={7} className="text-center py-6">{t('user.camperTab.table.noUsers')}</TableCell></TableRow>
                                    ) : (
                                        filteredCampers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-mono text-xs whitespace-nowrap">{user.id.substring(0, 8)}...</TableCell>
                                                <TableCell className="font-medium break-words max-w-[200px]">{user.name}</TableCell>
                                                <TableCell className="break-words max-w-[200px]">{user.email}</TableCell>
                                                <TableCell className="whitespace-nowrap">{user.phone}</TableCell>
                                                <TableCell className="whitespace-nowrap">{user.joined}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        user.status === "active" ? "default" :
                                                            user.status === "suspended" ? "secondary" :
                                                                "destructive"
                                                    }>
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedUser(user)}
                                                                className="cursor-pointer"
                                                            >
                                                                {t('user.camperTab.table.manage')}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-lg">
                                                            <DialogHeader>
                                                                <DialogTitle>{t('user.camperTab.dialog.title', { name: user.name })}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                                                {isEditing ? (
                                                                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <div className="space-y-1">
                                                                                <Label>First Name</Label>
                                                                                <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label>Last Name</Label>
                                                                                <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label>Email</Label>
                                                                            <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label>Phone</Label>
                                                                            <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                                                                        </div>
                                                                        <div className="flex gap-2 pt-2">
                                                                            <Button onClick={handleUpdateUser} className="flex-1">Save Changes</Button>
                                                                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.email')}</Label>
                                                                            <p className="text-sm font-medium break-words">{user.email}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.phone')}</Label>
                                                                            <p className="text-sm font-medium">{user.phone}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.bookings')}</Label>
                                                                            <p className="text-sm font-semibold">{user.bookings}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.joined')}</Label>
                                                                            <p className="text-sm font-medium">{user.joined}</p>
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Button variant="ghost" size="sm" onClick={() => startEditing(user)} className="text-blue-600 h-7 p-0 hover:bg-transparent">
                                                                                {t('user.camperTab.dialog.info.editDetails')}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <Label>{t('user.camperTab.dialog.warning.label')}</Label>
                                                                    <Textarea
                                                                        value={warningMessage}
                                                                        onChange={(e) => setWarningMessage(e.target.value)}
                                                                        placeholder={t('user.camperTab.dialog.warning.placeholder')}
                                                                        rows={2}
                                                                        className="mt-1"
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        className="mt-2 cursor-pointer w-full text-sm"
                                                                        onClick={() => handleSendWarning(user.id)}
                                                                    >
                                                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                                                        {t('user.camperTab.dialog.warning.btn')}
                                                                    </Button>
                                                                </div>

                                                                <div className="pt-4 border-t space-y-3">
                                                                    {user.status === "active" && (
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full cursor-pointer"
                                                                            onClick={() => handleSuspendUser(user.id)}
                                                                        >
                                                                            <Ban className="w-4 h-4 mr-2" />
                                                                            {t('user.camperTab.dialog.actions.suspend')}
                                                                        </Button>
                                                                    )}

                                                                    {(user.status === "suspended" || user.status === "banned") && (
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full cursor-pointer"
                                                                            onClick={() => handleUnblockUser(user.id)}
                                                                        >
                                                                            {t('user.camperTab.dialog.actions.unblock')}
                                                                        </Button>
                                                                    )}

                                                                    {user.status !== "banned" && (
                                                                        <>
                                                                            <Textarea
                                                                                value={banReason}
                                                                                onChange={(e) => setBanReason(e.target.value)}
                                                                                placeholder={t('user.camperTab.dialog.actions.banPlaceholder')}
                                                                                rows={2}
                                                                            />
                                                                            <Button
                                                                                variant="destructive"
                                                                                className="w-full cursor-pointer"
                                                                                onClick={() => handleBanUser(user.id)}
                                                                            >
                                                                                <Ban className="w-4 h-4 mr-2" />
                                                                                {t('user.camperTab.dialog.actions.banBtn')}
                                                                            </Button>
                                                                        </>
                                                                    )}

                                                                    <Button
                                                                        variant="destructive"
                                                                        className="w-full cursor-pointer mt-4"
                                                                        onClick={() => setUserToDelete(user)}
                                                                    >
                                                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                                                        {t('user.camperTab.dialog.actions.deleteBtn')}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Moderation Logs Card - Mobile optimized */}
                    <Card className="p-4 md:p-6">
                        <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">{t('user.moderation.title')}</h3>
                        <div className="space-y-2 md:space-y-3">
                            {moderationLogs.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">{t('user.moderation.noActions')}</p>
                            ) : (
                                moderationLogs.map((log) => (
                                    <div key={log._id} className={cn(
                                        "p-3 md:p-4 rounded-lg border",
                                        log.action.includes("BANNED") ? "bg-red-50 border-red-100" :
                                            log.action.includes("WARNING") ? "bg-yellow-50 border-yellow-100" :
                                                "bg-blue-50 border-blue-100"
                                    )}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                {log.action.includes("BANNED") ? <Ban className="w-4 h-4 text-red-600" /> :
                                                    log.action.includes("WARNING") ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                                                        <ShieldCheck className="w-4 h-4 text-blue-600" />}
                                                <p className="font-medium text-xs md:text-sm">
                                                    {log.action.replace("USER_", "").toLowerCase().replace("_", " ")}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-700 font-medium break-words">
                                            {log.metadata?.email || "Unknown User"}
                                        </p>
                                        {log.metadata?.message && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 italic break-words">
                                                "{log.metadata.message}"
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('user.moderation.actionBy', {
                                                name: log.actor?.fullName || "Admin"
                                            })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </TabsContent>

                {/* Managers Tab */}
                <TabsContent value="managers" className="space-y-4 md:space-y-6 mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="flex flex-col gap-4 mb-4 md:mb-6">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{t('user.managerTab.title')}</h2>
                                <p className="text-xs md:text-sm text-gray-500">{t('user.managerTab.subtitle')}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    placeholder={t('user.managerTab.searchPlaceholder')}
                                    value={managerSearchQuery}
                                    onChange={(e) => setManagerSearchQuery(e.target.value)}
                                    className="w-full sm:w-64"
                                />
                                <Select defaultValue="all" onValueChange={setManagerStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">{t('user.camperTab.statusFilter.all')}</SelectItem>
                                        <SelectItem value="active">{t('user.camperTab.statusFilter.active')}</SelectItem>
                                        <SelectItem value="suspended">{t('user.camperTab.statusFilter.suspended')}</SelectItem>
                                        <SelectItem value="banned">{t('user.camperTab.statusFilter.banned')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Mobile card view for managers */}
                        <div className="block lg:hidden space-y-3">
                            {isLoading ? (
                                <div className="text-center py-6 text-gray-500 text-sm">{t('user.managerTab.table.loading')}</div>
                            ) : filteredManagers.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 text-sm">{t('user.managerTab.table.noUsers')}</div>
                            ) : (
                                filteredManagers.map((manager) => (
                                    <div key={manager.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm break-words">{manager.name}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-1">{manager.id.substring(0, 8)}...</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant={manager.kycStatus === "approved" ? "default" : "secondary"} className="text-xs">
                                                    {manager.kycStatus}
                                                </Badge>
                                                <Badge variant={manager.status === "active" ? "default" : manager.status === "suspended" ? "secondary" : "destructive"} className="text-xs">
                                                    {manager.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <p><span className="text-gray-500">Email:</span> <span className="break-words">{manager.email}</span></p>
                                            <p><span className="text-gray-500">Camp:</span> {manager.camp}</p>
                                            <p><span className="text-gray-500">Joined:</span> {manager.joined}</p>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="cursor-pointer w-full text-sm">
                                                    {t('user.managerTab.table.view')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[95vw] sm:max-w-lg p-4 md:p-6">
                                                <DialogHeader>
                                                    <DialogTitle className="text-base sm:text-lg break-words">
                                                        {t('user.managerTab.dialog.title', { name: manager.name })}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                                    {isEditing ? (
                                                        <div className="space-y-3 p-3 md:p-4 bg-gray-50 rounded-lg border">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">First Name</Label>
                                                                    <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="text-sm" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">Last Name</Label>
                                                                    <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} className="text-sm" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Email</Label>
                                                                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="text-sm" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Phone</Label>
                                                                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="text-sm" />
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                                                <Button onClick={handleUpdateUser} className="flex-1 text-sm">Save Changes</Button>
                                                                <Button variant="outline" onClick={() => setIsEditing(false)} className="text-sm">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.email')}</Label>
                                                                <p className="text-sm font-medium break-words">{manager.email}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.phone')}</Label>
                                                                <p className="text-sm font-medium">{manager.phone}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.managerTab.table.camp')}</Label>
                                                                <p className="text-sm font-semibold break-words">{manager.camp}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">{t('user.camperTab.dialog.info.joined')}</Label>
                                                                <p className="text-sm font-medium">{manager.joined}</p>
                                                            </div>
                                                            <div className="col-span-full">
                                                                <Button variant="ghost" size="sm" onClick={() => startEditing(manager)} className="text-blue-600 h-7 p-0 hover:bg-transparent text-xs">
                                                                    {t('user.camperTab.dialog.info.editDetails')}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <Label className="text-xs">{t('user.managerTab.dialog.warning.label')}</Label>
                                                        <Textarea
                                                            value={warningMessage}
                                                            onChange={(e) => setWarningMessage(e.target.value)}
                                                            placeholder={t('user.managerTab.dialog.warning.placeholder')}
                                                            rows={2}
                                                            className="mt-1 text-sm"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="mt-2 cursor-pointer w-full text-sm"
                                                            onClick={() => handleSendWarning(manager.id)}
                                                        >
                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                            {t('user.managerTab.dialog.warning.btn')}
                                                        </Button>
                                                    </div>

                                                    <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="font-semibold mb-2 text-sm">{t('user.managerTab.dialog.docs.title')}</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                <span className="text-sm">{t('user.managerTab.dialog.docs.kyc')}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={manager.kycStatus === "approved" ? "default" : "secondary"} className="text-xs">
                                                                        {manager.kycStatus}
                                                                    </Badge>
                                                                    {manager.kycStatus !== "approved" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 p-2"
                                                                            onClick={() => handleApproveKYC(manager.id)}
                                                                        >
                                                                            {t('user.managerTab.dialog.docs.approve')}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                className="w-full cursor-pointer text-orange-600 text-sm"
                                                                onClick={() => handleRevokeRole(manager.id, manager.role)}
                                                            >
                                                                <Shield className="w-4 h-4 mr-2" />
                                                                {t('user.managerTab.dialog.actions.revoke')}
                                                            </Button>
                                                            {manager.status === "active" ? (
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full cursor-pointer text-sm"
                                                                    onClick={() => handleSuspendUser(manager.id)}
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    {t('user.managerTab.dialog.actions.suspend')}
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full cursor-pointer text-sm"
                                                                    onClick={() => handleUnblockUser(manager.id)}
                                                                >
                                                                    {t('user.managerTab.dialog.actions.unblock')}
                                                                </Button>
                                                            )}

                                                            <Button
                                                                variant="destructive"
                                                                className="w-full cursor-pointer mt-2 text-sm"
                                                                onClick={() => setUserToDelete(manager)}
                                                            >
                                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                                {t('user.managerTab.dialog.actions.delete')}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop table view for managers */}
                        <div className="hidden lg:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('user.managerTab.table.id')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.name')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.email')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.camp')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.joined')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.kyc')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.status')}</TableHead>
                                        <TableHead>{t('user.managerTab.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={8} className="text-center py-6">{t('user.managerTab.table.loading')}</TableCell></TableRow>
                                    ) : filteredManagers.length === 0 ? (
                                        <TableRow><TableCell colSpan={8} className="text-center py-6">{t('user.managerTab.table.noUsers')}</TableCell></TableRow>
                                    ) : (
                                        filteredManagers.map((manager) => (
                                            <TableRow key={manager.id}>
                                                <TableCell className="font-mono text-xs whitespace-nowrap">{manager.id.substring(0, 8)}...</TableCell>
                                                <TableCell className="font-medium break-words max-w-[200px]">{manager.name}</TableCell>
                                                <TableCell className="break-words max-w-[200px]">{manager.email}</TableCell>
                                                <TableCell className="break-words max-w-[150px]">{manager.camp}</TableCell>
                                                <TableCell className="whitespace-nowrap">{manager.joined}</TableCell>
                                                <TableCell>
                                                    <Badge variant={manager.kycStatus === "approved" ? "default" : "secondary"}>
                                                        {manager.kycStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={manager.status === "active" ? "default" : manager.status === "suspended" ? "secondary" : "destructive"}>
                                                        {manager.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="cursor-pointer">
                                                                {t('user.managerTab.table.view')}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-lg">
                                                            <DialogHeader>
                                                                <DialogTitle>{t('user.managerTab.dialog.title', { name: manager.name })}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                                                {isEditing ? (
                                                                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <div className="space-y-1">
                                                                                <Label>First Name</Label>
                                                                                <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label>Last Name</Label>
                                                                                <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label>Email</Label>
                                                                            <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label>Phone</Label>
                                                                            <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                                                                        </div>
                                                                        <div className="flex gap-2 pt-2">
                                                                            <Button onClick={handleUpdateUser} className="flex-1">Save Changes</Button>
                                                                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.email')}</Label>
                                                                            <p className="text-sm font-medium break-words">{manager.email}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.phone')}</Label>
                                                                            <p className="text-sm font-medium">{manager.phone}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.managerTab.table.camp')}</Label>
                                                                            <p className="text-sm font-semibold break-words">{manager.camp}</p>
                                                                        </div>
                                                                        <div>
                                                                            <Label>{t('user.camperTab.dialog.info.joined')}</Label>
                                                                            <p className="text-sm font-medium">{manager.joined}</p>
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Button variant="ghost" size="sm" onClick={() => startEditing(manager)} className="text-blue-600 h-7 p-0 hover:bg-transparent">
                                                                                {t('user.camperTab.dialog.info.editDetails')}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <Label>{t('user.managerTab.dialog.warning.label')}</Label>
                                                                    <Textarea
                                                                        value={warningMessage}
                                                                        onChange={(e) => setWarningMessage(e.target.value)}
                                                                        placeholder={t('user.managerTab.dialog.warning.placeholder')}
                                                                        rows={2}
                                                                        className="mt-1"
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        className="mt-2 cursor-pointer w-full text-sm"
                                                                        onClick={() => handleSendWarning(manager.id)}
                                                                    >
                                                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                                                        {t('user.managerTab.dialog.warning.btn')}
                                                                    </Button>
                                                                </div>


                                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                                    <h4 className="font-semibold mb-2 text-sm">{t('user.managerTab.dialog.docs.title')}</h4>
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm">{t('user.managerTab.dialog.docs.kyc')}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                <Badge variant={manager.kycStatus === "approved" ? "default" : "secondary"}>
                                                                                    {manager.kycStatus}
                                                                                </Badge>
                                                                                {manager.kycStatus !== "approved" && (
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                                                                                        onClick={() => handleApproveKYC(manager.id)}
                                                                                    >
                                                                                        {t('user.managerTab.dialog.docs.approve')}
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="space-y-2 pt-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full cursor-pointer text-orange-600"
                                                                            onClick={() => handleRevokeRole(manager.id, manager.role)}
                                                                        >
                                                                            <Shield className="w-4 h-4 mr-2" />
                                                                            {t('user.managerTab.dialog.actions.revoke')}
                                                                        </Button>
                                                                        {manager.status === "active" ? (
                                                                            <Button
                                                                                variant="outline"
                                                                                className="w-full cursor-pointer"
                                                                                onClick={() => handleSuspendUser(manager.id)}
                                                                            >
                                                                                <Ban className="w-4 h-4 mr-2" />
                                                                                {t('user.managerTab.dialog.actions.suspend')}
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                variant="outline"
                                                                                className="w-full cursor-pointer"
                                                                                onClick={() => handleUnblockUser(manager.id)}
                                                                            >
                                                                                {t('user.managerTab.dialog.actions.unblock')}
                                                                            </Button>
                                                                        )}

                                                                        <Button
                                                                            variant="destructive"
                                                                            className="w-full cursor-pointer mt-4"
                                                                            onClick={() => setUserToDelete(manager)}
                                                                        >
                                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                                            {t('user.managerTab.dialog.actions.delete')}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Create User Tab */}
                <TabsContent value="create" className="mt-4">
                    <Card className="p-4 md:p-6">
                        <div className="mb-4 md:mb-6">
                            <h2 className="text-lg md:text-xl font-semibold">{t('user.createTab.title')}</h2>
                            <p className="text-xs md:text-sm text-gray-500">{t('user.createTab.subtitle')}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                            <div className="flex-1 space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <Label htmlFor="firstName" className="text-sm">{t('user.createTab.form.firstName')}</Label>
                                        <Input id="firstName" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} placeholder={t('user.createTab.form.firstNamePlaceholder')} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="text-sm">{t('user.createTab.form.lastName')}</Label>
                                        <Input id="lastName" value={newLastName} onChange={e => setNewLastName(e.target.value)} placeholder={t('user.createTab.form.lastNamePlaceholder')} className="mt-1" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm">{t('user.createTab.form.email')}</Label>
                                    <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="mt-1" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm">{t('user.createTab.form.phone')}</Label>
                                    <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="mt-1" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm">{t('user.createTab.form.role')}</Label>
                                    <Select value={newRole} onValueChange={setNewRole}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="camper">{t('user.createTab.form.roles.camper')}</SelectItem>
                                            <SelectItem value="manager">{t('user.createTab.form.roles.manager')}</SelectItem>
                                            <SelectItem value="admin">{t('user.createTab.form.roles.admin')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm">{t('user.createTab.form.password')}</Label>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                        <Input
                                            type="text"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder={t('user.createTab.form.passwordPlaceholder')}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" onClick={generatePassword} className="cursor-pointer whitespace-nowrap text-sm">
                                            {t('user.createTab.form.generate')}
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button onClick={handleCreateUser} size="lg" className="cursor-pointer w-full sm:w-auto">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {t('user.createTab.form.createBtn')}
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:w-80 space-y-4 md:space-y-6">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                        Role Management
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <p className="text-sm font-bold text-gray-900">Camper</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Can search and book camps</p>
                                            <Badge variant="outline" className="mt-2 text-[10px] h-5">Default</Badge>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <p className="text-sm font-bold text-gray-900">Camp Manager</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Can create and manage camp listings</p>
                                            <Badge variant="outline" className="mt-2 text-[10px] h-5">Requires KYC</Badge>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <p className="text-sm font-bold text-gray-900">Administrator</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Full platform access and control</p>
                                            <Badge variant="outline" className="mt-2 text-[10px] h-5">Restricted</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Success Dialog for Credentials */}
                            <Dialog open={!!createdUserCredentials} onOpenChange={() => setCreatedUserCredentials(null)}>
                                <DialogContent className="sm:max-w-md max-w-[95vw] p-4 md:p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-green-600 flex items-center gap-2 text-base sm:text-lg">
                                            <Shield className="w-5 h-5" />
                                            {t('user.createTab.credentials.title')}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs sm:text-sm">
                                            {t('user.createTab.credentials.subtitle')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-3 border">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2">
                                                                                       <span className="text-xs sm:text-sm text-gray-500 font-medium">{t('user.createTab.credentials.email')}</span>
                                            <span className="text-xs sm:text-sm font-bold break-words">{createdUserCredentials?.email}</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-2">
                                            <span className="text-xs sm:text-sm text-gray-500 font-medium">{t('user.createTab.credentials.password')}</span>
                                            <span className="text-xs sm:text-sm font-bold font-mono text-blue-600 break-all">{createdUserCredentials?.password}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs sm:text-sm text-gray-500 font-medium">{t('user.createTab.credentials.role')}</span>
                                            <Badge variant="outline" className="capitalize text-xs">{createdUserCredentials?.role}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded text-xs border border-amber-200">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <p className="text-xs">{t('user.createTab.credentials.warning')}</p>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => setCreatedUserCredentials(null)} className="w-full">
                                            {t('user.createTab.credentials.done')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Permanent Deletion Confirmation Dialog */}
            <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-md border-red-200 p-4 md:p-6">
                    <DialogHeader>
                        <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-lg sm:text-xl text-red-900 font-bold">{t('user.deleteDialog.title')}</DialogTitle>
                        <DialogDescription className="text-center text-red-600/70 text-xs sm:text-sm">
                            {t('user.deleteDialog.subtitle')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100 shadow-sm">
                            <p className="text-xs sm:text-sm text-red-800 font-semibold mb-2 flex items-center gap-2">
                                <Ban className="w-4 h-4" />
                                {t('user.deleteDialog.warningHeader')}
                            </p>
                            <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                                {t('user.deleteDialog.confirmMsg', { name: userToDelete?.name })}
                                {t('user.deleteDialog.purgeMsg')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('user.deleteDialog.consequences.title')}</p>
                            <ul className="text-xs text-gray-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                    <span className="text-xs">{t('user.deleteDialog.consequences.item1')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                    <span className="text-xs">{t('user.deleteDialog.consequences.item2')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                    <span className="text-xs">{t('user.deleteDialog.consequences.item3')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <Button
                            variant="outline"
                            className="flex-1 hover:bg-gray-50 transition-colors text-sm"
                            onClick={() => setUserToDelete(null)}
                            disabled={isDeleting}
                        >
                            {t('user.deleteDialog.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 gap-2 shadow-sm active:scale-95 transition-all text-sm"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    {t('user.deleteDialog.purging')}
                                </>
                            ) : (
                                <>
                                    <Ban className="w-4 h-4" />
                                    {t('user.deleteDialog.deleteBtn')}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}