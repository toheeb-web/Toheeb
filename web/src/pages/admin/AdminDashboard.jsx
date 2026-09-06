import React, { useState } from 'react';
import { useApp, formatNaira } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Building2, 
  Bike, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MoreVertical, 
  UserPlus, 
  Lock, 
  Eye, 
  EyeOff, 
  CreditCard, 
  Check, 
  ArrowUpRight, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Utensils, 
  DollarSign, 
  ChevronDown,
  Shield,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { resolveNigerianAccountAPI, NIGERIAN_BANKS } from '../../services/flutterwaveService';

export const AdminDashboard = () => {
  const { 
    users, 
    currentUser, 
    orders, 
    foods, 
    sellers, 
    adminLogin,
    adminVerifyUser, 
    adminSuspendUser, 
    adminUpdateUserRole, 
    adminDeleteUser, 
    adminAddUser,
    updateOrderStatus,
    switchRole,
    showToast
  } = useApp();

  // Admin Authentication State
  const isAdmin = currentUser?.role === 'ADMIN';
  const [adminUsername, setAdminUsername] = useState('Toheebay');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'orders' | 'banking' | 'catalogue'

  // User Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'BUYER' | 'SELLER' | 'RIDER' | 'ADMIN'

  // New User Modal State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+234 ');
  const [newUserRole, setNewUserRole] = useState('BUYER');
  const [newUserBank, setNewUserBank] = useState('058'); // GTBank default
  const [newUserAccount, setNewUserAccount] = useState('0108688385');
  const [newUserAccountName, setNewUserAccountName] = useState('TOHEEBAY');
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  // Live Bank Resolution Test in Tab 3
  const [testBankCode, setTestBankCode] = useState('058');
  const [testAccountNumber, setTestAccountNumber] = useState('0108688385');
  const [testResult, setTestResult] = useState(null);
  const [isTestingBank, setIsTestingBank] = useState(false);

  // Handle Master Admin Login
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = adminLogin(adminUsername, adminPassword);
    if (!res.success) {
      setLoginError(res.error);
    }
  };

  // NUBAN Account Verification for Add User
  const handleVerifyNewUserBank = async () => {
    if (!newUserAccount || newUserAccount.length !== 10) {
      showToast("Please enter a valid 10-digit NUBAN account number.");
      return;
    }
    setIsVerifyingBank(true);
    try {
      const res = await resolveNigerianAccountAPI(newUserAccount, newUserBank);
      if (res.status === 'success' && res.data) {
        setNewUserAccountName(res.data.account_name);
        showToast(`Account verified: ${res.data.account_name}`);
      } else {
        showToast(res.message || "Could not verify account name.");
      }
    } catch (err) {
      showToast("Verification failed. Please check the account number.");
    } finally {
      setIsVerifyingBank(false);
    }
  };

  // Add User Submit
  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showToast("Name and Email are required.");
      return;
    }

    const bankObj = NIGERIAN_BANKS.find(b => b.code === newUserBank);
    adminAddUser({
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      bankName: bankObj ? bankObj.name : 'Guaranty Trust Bank (GTBank)',
      bankCode: newUserBank,
      accountNumber: newUserAccount,
      accountName: newUserAccountName || newUserName.toUpperCase()
    });

    setAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('+234 ');
  };

  // Test Bank Account Resolution
  const handleRunBankTest = async () => {
    if (!testAccountNumber || testAccountNumber.length !== 10) {
      showToast("Enter a 10-digit Nigerian NUBAN account number.");
      return;
    }
    setIsTestingBank(true);
    setTestResult(null);
    try {
      const res = await resolveNigerianAccountAPI(testAccountNumber, testBankCode);
      if (res.status === 'success' && res.data) {
        setTestResult({
          status: 'success',
          accountName: res.data.account_name,
          accountNumber: res.data.account_number,
          bankName: NIGERIAN_BANKS.find(b => b.code === testBankCode)?.name || 'Nigerian Bank'
        });
        showToast(`Verified: ${res.data.account_name}`);
      } else {
        setTestResult({
          status: 'error',
          message: res.message || "Failed to resolve account."
        });
      }
    } catch (err) {
      setTestResult({
        status: 'error',
        message: "Error communicating with banking API."
      });
    } finally {
      setIsTestingBank(false);
    }
  };

  // Calculations
  const totalGMV = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPlatformFees = Math.round(orders.reduce((sum, o) => sum + ((o.subtotal || o.totalAmount || 0) * 0.05), 0));
  const totalVendorPayouts = Math.round(orders.reduce((sum, o) => sum + ((o.subtotal || o.totalAmount || 0) * 0.95), 0));

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.accountNumber?.includes(q) ||
      u.accountName?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  // If user is not authenticated as Master Admin, show secure login
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-50">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-[#E2D7CF] text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-purple-200">
            <Shield className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-[#1C1B1F]">Master Admin Portal</h1>
          <p className="text-xs text-[#79747E] mt-1 mb-6">
            Authorized access only. Monitor users, verify transactions, and manage GTBank settlements.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center space-x-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#49454F] mb-1">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Toheebay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-purple-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-sm focus:ring-2 focus:ring-purple-500 font-semibold pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Default credentials: Toheebay / Nigeria1@</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-extrabold shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In as Master Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-center space-x-2 text-xs text-[#79747E]">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>ChopConnect Nigeria • Live Production</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1C1B1F] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Shield className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-purple-200 border border-purple-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform Master Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, Toheebay
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
              Live Nigeria Operations Hub. Monitor real registered users, oversee delivery dispatches, track 5% platform fees, and verify GTBank settlements.
            </p>

            {/* Master Settlement Account Strip */}
            <div className="mt-4 inline-flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs">
              <span className="font-bold text-amber-300 flex items-center">
                <CreditCard className="w-3.5 h-3.5 mr-1.5" /> GTBank Settlement:
              </span>
              <span className="font-mono font-black text-white">0108688385</span>
              <span className="text-white/60">•</span>
              <span className="font-extrabold text-white">TOHEEBAY</span>
              <span className="bg-emerald-500/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setAddUserModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-md flex items-center space-x-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Real User</span>
            </button>
            <button
              onClick={() => switchRole('BUYER')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl text-xs font-bold backdrop-blur-md transition-all flex items-center space-x-1.5"
            >
              <span>View Marketplace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-[#E2D7CF] shadow-sm">
          <div className="flex items-center justify-between text-[#79747E] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-[#1C1B1F]">{users.length}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-medium flex items-center space-x-1">
            <span className="text-emerald-600 font-bold">{users.filter(u => u.isOnline).length} online now</span>
            <span>• 100% Real</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2D7CF] shadow-sm">
          <div className="flex items-center justify-between text-[#79747E] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Platform GMV</span>
            <DollarSign className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-[#1C1B1F]">{formatNaira(totalGMV)}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-medium">
            {orders.length} total orders recorded
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2D7CF] shadow-sm">
          <div className="flex items-center justify-between text-[#79747E] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">5% Platform Fee</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatNaira(totalPlatformFees)}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-medium">
            Automatically retained on orders
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E2D7CF] shadow-sm">
          <div className="flex items-center justify-between text-[#79747E] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vendor Settlements</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#1C1B1F]">{formatNaira(totalVendorPayouts)}</div>
          <div className="text-[11px] text-neutral-500 mt-1 font-medium">
            95% Net split to GTBank 0108688385
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E2D7CF] mb-6 overflow-x-auto space-x-1 sm:space-x-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-[#79747E] hover:text-[#1C1B1F]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Monitor All Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-[#79747E] hover:text-[#1C1B1F]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Live Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banking')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'banking'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-[#79747E] hover:text-[#1C1B1F]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>GTBank Settlement & NUBAN</span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'catalogue'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-[#79747E] hover:text-[#1C1B1F]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu Catalogue ({foods.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS MONITOR */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-3xl p-4 border border-[#E2D7CF] shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, phone or bank account..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#E2D7CF] text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'BUYER', 'SELLER', 'RIDER', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    roleFilter === role
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-[#E2D7CF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-[#E2D7CF] text-[11px] font-black text-[#79747E] uppercase tracking-wider">
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Bank & NUBAN Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filteredUsers.map((u) => {
                    const isMaster = u.id === 1 || u.role === 'ADMIN';
                    return (
                      <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm ${
                              u.role === 'ADMIN' ? 'bg-purple-700' :
                              u.role === 'SELLER' ? 'bg-amber-600' :
                              u.role === 'RIDER' ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}>
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                u.avatarInitials || u.name?.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm text-[#1C1B1F] flex items-center space-x-1.5">
                                <span>{u.name}</span>
                                {isMaster && (
                                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md">
                                    Master
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#79747E]">
                                {u.username ? `@${u.username}` : u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge & Switcher */}
                        <td className="py-4 px-4">
                          <select
                            disabled={isMaster}
                            value={u.role}
                            onChange={(e) => adminUpdateUserRole(u.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black border uppercase tracking-wider ${
                              u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              u.role === 'SELLER' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              u.role === 'RIDER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="BUYER">BUYER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="RIDER">RIDER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5 text-neutral-700 font-medium">
                              <Phone className="w-3 h-3 text-neutral-400" />
                              <span>{u.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-neutral-500 text-[11px]">
                              <Mail className="w-3 h-3 text-neutral-400" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Bank Details */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-[#1C1B1F] flex items-center space-x-1">
                              <span>{u.bankName || 'GTBank'}</span>
                            </div>
                            <div className="font-mono text-neutral-600 font-semibold text-[11px]">
                              {u.accountNumber || '0108688385'}
                            </div>
                            <div className="text-[10px] text-neutral-400 uppercase">
                              {u.accountName || u.name}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              u.isSuspended
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {u.isSuspended ? 'Suspended' : 'Active & Verified'}
                            </span>
                            <div className="text-[10px] text-neutral-400">
                              {u.isOnline ? '🟢 Online Now' : 'Last seen recently'}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => adminSuspendUser(u.id)}
                              disabled={isMaster}
                              className={`p-1.5 rounded-xl text-xs font-bold transition-colors ${
                                u.isSuspended 
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                  : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                              } ${isMaster ? 'opacity-40 cursor-not-allowed' : ''}`}
                              title={u.isSuspended ? 'Activate User' : 'Suspend User'}
                            >
                              {u.isSuspended ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user "${u.name}" from platform?`)) {
                                  adminDeleteUser(u.id);
                                }
                              }}
                              disabled={isMaster}
                              className={`p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${
                                isMaster ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ORDERS TRACKER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-[#1C1B1F]">Live Delivery & Dispatch Monitor</h2>
            <span className="text-xs text-[#79747E] font-medium">{orders.length} active platform orders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-[#E2D7CF] shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-400">Order #{order.id}</span>
                    <h3 className="text-sm font-extrabold text-[#1C1B1F]">
                      {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Seller: <strong className="text-neutral-700">{order.sellerName || "Toheebay's Kitchen"}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-brand-600 block">{formatNaira(order.totalAmount)}</span>
                    <span className="text-[10px] text-neutral-400">Paid via Flutterwave</span>
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="bg-neutral-50 rounded-2xl p-3 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Vendor Net (95% to GTBank):</span>
                    <span className="font-bold text-emerald-700">{formatNaira(Math.round((order.subtotal || order.totalAmount) * 0.95))}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>5% Platform Commission:</span>
                    <span className="font-bold text-purple-700">{formatNaira(Math.round((order.subtotal || order.totalAmount) * 0.05))}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px] pt-1 border-t border-neutral-200">
                    <span>Delivery Address:</span>
                    <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                  </div>
                </div>

                {/* Status Update Dropdown */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-neutral-500">Order Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold border border-neutral-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY_FOR_DELIVERY">READY FOR DELIVERY</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BANKING & SETTLEMENT */}
      {activeTab === 'banking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Settlement Gateway Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase">
                  Active Settlement
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#1C1B1F]">Guaranty Trust Bank (GTBank)</h3>
                <p className="text-xs text-[#79747E]">Official Settlement Account for ChopConnect Nigeria</p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 space-y-2 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">NUBAN Account Number:</span>
                  <span className="text-sm font-mono font-black text-[#1C1B1F]">0108688385</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Account Holder Name:</span>
                  <span className="text-xs font-black text-[#1C1B1F]">TOHEEBAY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Bank Code:</span>
                  <span className="text-xs font-mono font-bold text-neutral-700">058</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Flutterwave Subaccount:</span>
                  <span className="text-xs font-mono font-bold text-purple-700">RS_0108688385GTB</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                  <span className="text-xs text-neutral-500">Split Ratio:</span>
                  <span className="text-xs font-extrabold text-emerald-700">95% Vendor / 5% Platform Fee</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 font-medium">
                All food sales processed through the integrated Flutterwave gateway automatically credit net earnings directly to this verified GTBank settlement profile.
              </div>
            </div>

            {/* Live NUBAN Resolver Tool */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2D7CF] shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-[#1C1B1F]">Test NUBAN Account Resolution</h3>
              </div>
              <p className="text-xs text-[#79747E]">
                Instantly query Nigerian commercial bank databases to resolve customer or vendor account names via Flutterwave NUBAN API.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Select Bank</label>
                  <select
                    value={testBankCode}
                    onChange={(e) => setTestBankCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-bold bg-white"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">10-Digit Account Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={testAccountNumber}
                    onChange={(e) => setTestAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="0108688385"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-mono font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunBankTest}
                  disabled={isTestingBank}
                  className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingBank ? 'animate-spin' : ''}`} />
                  <span>{isTestingBank ? "Querying Bank..." : "Resolve Account Name"}</span>
                </button>

                {testResult && (
                  <div className={`p-4 rounded-2xl border text-xs ${
                    testResult.status === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {testResult.status === 'success' ? (
                      <div>
                        <div className="font-extrabold text-sm text-emerald-800 flex items-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Account Verified Successfully</span>
                        </div>
                        <div className="mt-2 space-y-1 font-mono">
                          <div>Bank: <strong>{testResult.bankName}</strong></div>
                          <div>Account Number: <strong>{testResult.accountNumber}</strong></div>
                          <div>Detected Name: <strong>{testResult.accountName}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <div className="font-semibold text-red-700">{testResult.message}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CATALOGUE OVERSIGHT */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-[#1C1B1F]">Live Nigerian Food Catalogue</h2>
              <p className="text-xs text-[#79747E]">All dishes active in marketplace • Add custom images from phone storage</p>
            </div>
            <button
              onClick={() => switchRole('SELLER')}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center space-x-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Add Dishes from Phone Storage</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food.id} className="bg-white rounded-3xl overflow-hidden border border-[#E2D7CF] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-neutral-100">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-brand-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                      {food.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      {food.prepTimeMinutes} mins
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-[#1C1B1F]">{food.name}</h3>
                      <span className="font-black text-sm text-brand-600">{formatNaira(food.price)}</span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{food.description}</p>
                    <div className="bg-neutral-50 rounded-xl p-2.5 mt-3 text-[11px] text-neutral-600 flex justify-between">
                      <span>95% Vendor: <strong>{formatNaira(food.price * 0.95)}</strong></span>
                      <span className="text-purple-700 font-bold">5% Platform: {formatNaira(food.price * 0.05)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-[#1C1B1F]">Register Real Platform User</h2>
              </div>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Babatunde Adeyemi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#49454F] mb-1">Phone Number (Nigeria)</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+234 802 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#49454F] mb-1">Platform Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7CF] text-xs font-bold bg-white"
                >
                  <option value="BUYER">BUYER (Customer ordering food)</option>
                  <option value="SELLER">SELLER (Kitchen vendor preparing food)</option>
                  <option value="RIDER">RIDER (Courier delivering food)</option>
                </select>
              </div>

              {/* Bank Settlement Section */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-[#1C1B1F]">
                  <CreditCard className="w-3.5 h-3.5 text-brand-600" />
                  <span>Nigerian Settlement Bank (NUBAN)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#79747E] mb-1">Bank</label>
                    <select
                      value={newUserBank}
                      onChange={(e) => setNewUserBank(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#E2D7CF] text-xs font-bold bg-white"
                    >
                      {NIGERIAN_BANKS.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#79747E] mb-1">Account Number</label>
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        maxLength={10}
                        value={newUserAccount}
                        onChange={(e) => setNewUserAccount(e.target.value.replace(/\D/g, ''))}
                        placeholder="0108688385"
                        className="w-full px-2.5 py-2 rounded-xl border border-[#E2D7CF] text-xs font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyNewUserBank}
                        disabled={isVerifyingBank}
                        className="px-2.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-[11px] font-bold rounded-xl"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>

                {newUserAccountName && (
                  <div className="text-[11px] text-emerald-800 font-bold bg-emerald-100/60 p-2 rounded-xl flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Verified Name: {newUserAccountName}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Create Real User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
