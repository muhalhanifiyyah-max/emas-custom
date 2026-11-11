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
  Sun,
  Moon,
} from 'lucide-react';
import { CustomGoldSession } from '../types/customGold';
import {
  authenticateCustomGoldUser,
  checkDatabaseConnection,
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

      <div className="w-full max-w-md">
        <div
          className={`p-6 sm:p-8 rounded-3xl shadow-2xl border ${
            darkMode
              ? 'bg-[#151022] border-purple-800/50 text-gray-100'
              : 'bg-white border-purple-100 text-gray-900'
          }`}
        >
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
                    ? 'Terhubung Live DB Mitra & CRM'
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
                Email Akun
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.co.id"
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
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Masuk Platform Emas-Custom</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-purple-900/40 text-center text-[11px] text-gray-500 dark:text-gray-400">
            Gunakan akun staff internal REI atau akun mitra yang terdaftar di Dasbor Mitra & CRM.
          </div>
        </div>
      </div>
    </div>
  );
};
