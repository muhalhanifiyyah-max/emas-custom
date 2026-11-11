import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Database,
  Building2,
  Palette,
  BadgeCheck,
  Users,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CustomGoldSession, ROLE_CONFIG } from '../types/customGold';
import {
  authenticateCustomGoldUser,
  checkDatabaseConnection,
  INTERNAL_MULTI_ROLE_ACCOUNTS,
  DbSyncStatus,
} from '../services/supabase';

interface LoginPageProps {
  onLogin: (session: CustomGoldSession) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  darkMode,
  onToggleDarkMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbSyncStatus | null>(null);

  useEffect(() => {
    checkDatabaseConnection().then(setDbStatus);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { session, error: authErr } = await authenticateCustomGoldUser(email, password);
      if (!session) {
        setError(authErr || 'Email atau password tidak valid.');
        return;
      }
      onLogin(session);
    } catch {
      setError('Terjadi kesalahan koneksi sistem. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleSelect = (presetEmail: string, presetPassword: string) => {
    setEmail(presetEmail);
    setPassword(presetPassword);
    setError('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'cabang_rei':
        return <Building2 className="w-4 h-4 text-amber-500" />;
      case 'desainer_produksi':
        return <Palette className="w-4 h-4 text-indigo-500" />;
      case 'finance':
        return <BadgeCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Users className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors ${
        darkMode
          ? 'bg-[#0b0714] text-gray-100'
          : 'bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-gray-900'
      }`}
    >
      {/* Top Right Dark Mode Toggle */}
      <button
        onClick={onToggleDarkMode}
        className="fixed top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all z-20"
        title="Ganti Tema Terang / Gelap"
      >
        {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-200" />}
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Login Form */}
        <div
          className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl shadow-2xl border flex flex-col justify-between ${
            darkMode
              ? 'bg-[#151022] border-purple-800/50 text-gray-100'
              : 'bg-white border-purple-100 text-gray-900'
          }`}
        >
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-700 flex items-center justify-center text-amber-300 shadow-lg shadow-purple-700/30 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight uppercase text-purple-950 dark:text-white">
                  Emas-Custom & BPRS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Raja Emas Indonesia • Terhubung CRM & Dasbor Mitra
                </p>
              </div>
            </div>

            {/* Database Connection Status Pill */}
            <div
              className={`mb-6 px-3.5 py-2.5 rounded-2xl border text-xs flex items-center justify-between ${
                dbStatus?.connected
                  ? darkMode
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : darkMode
                  ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 shrink-0" />
                <span className="font-bold">
                  {dbStatus
                    ? dbStatus.connected
                      ? 'Terhubung Live Database Mitra & CRM'
                      : dbStatus.message
                    : 'Memeriksa koneksi database...'}
                </span>
              </div>
              {dbStatus?.connected && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20">
                  {dbStatus.partnersCount} Mitra · {dbStatus.transactionsCount} Tx
                </span>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                  Email Akun (Staff REI / Mitra BPRS / Admin)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@rajaemasindonesia.co.id / email mitra"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? 'bg-[#0d0917] border-purple-800/60 text-white placeholder-gray-500 focus:border-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-600 focus:bg-white'
                    }`}
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border outline-none transition-all ${
                      darkMode
                        ? 'bg-[#0d0917] border-purple-800/60 text-white placeholder-gray-500 focus:border-purple-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-600 focus:bg-white'
                    }`}
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-purple-700/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Database...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Masuk Platform Emas-Custom</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-purple-900/40 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            <span className="font-bold text-purple-700 dark:text-purple-300">Akun Mitra BPRS / HIMBARSI:</span> Dapat langsung masuk menggunakan email & password yang terdaftar di Dasbor Mitra (sinkronisasi live tabel <code className="font-mono">partners</code>).
          </div>
        </div>

        {/* Right Card: Multi-User Role Quick Access */}
        <div
          className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl shadow-2xl border flex flex-col justify-between ${
            darkMode
              ? 'bg-[#1a132b] border-purple-800/50 text-gray-100'
              : 'bg-purple-950/60 backdrop-blur-xl border-purple-400/20 text-white'
          }`}
        >
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Users className="w-3 h-3" />
                Sistem Multi-User Role
              </span>
              <h2 className="text-lg font-black mt-2">Pilih Role Akses Cepat</h2>
              <p className="text-xs text-purple-200/80 mt-0.5">
                Klik salah satu role di bawah untuk mengisi kredensial otomatis dan mencoba hak akses masing-masing divisi:
              </p>
            </div>

            <div className="space-y-2.5">
              {INTERNAL_MULTI_ROLE_ACCOUNTS.map((item) => {
                const roleMeta = ROLE_CONFIG[item.session.role];
                const isSelected = email.toLowerCase() === item.session.email.toLowerCase();
                return (
                  <button
                    key={item.session.id}
                    type="button"
                    onClick={() => handleQuickRoleSelect(item.session.email, item.passwords[0])}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white text-gray-900 border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-purple-100' : 'bg-white/10'}`}>
                        {getRoleIcon(item.session.role)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs truncate">{item.session.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${roleMeta.badgeColor}`}>
                            {roleMeta.label}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-gray-600' : 'text-purple-200/80'}`}>
                          {roleMeta.description}
                        </p>
                        <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-purple-700 font-bold' : 'text-amber-300/90'}`}>
                          {item.session.email} • pass: {item.passwords[0]}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-700' : 'text-purple-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-black/25 border border-white/10 text-[11px] text-purple-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Sinkronisasi Multi-Platform:</strong> Pesanan yang dibuat atau diperbarui di <span className="text-amber-300 font-semibold">emas-custom</span> otomatis tersinkronisasi ke database Supabase untuk tampil di Dasbor Mitra & CRM.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
