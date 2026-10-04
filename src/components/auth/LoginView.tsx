import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Lock, User, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, language, setLanguage, resetToFreshSystem, loadDemoData, journalVouchers } = useERP();

  const [username, setUsername] = useState('master');
  const [password, setPassword] = useState('master123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(username, password);
    if (!result.success) {
      setError(result.message || 'Invalid username or password');
    }
  };

  const handleFillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  const isFresh = journalVouchers.length === 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#00695c] to-[#0288d1]">
      <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-slate-900 space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-3xl mb-1 shadow-xs">
            🐟
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pond ERP
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'মৎস্য খামার ও অ্যাকাউন্টিং ব্যবস্থাপনা সিস্টেম' : 'Fish Farm Management System'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'bn' ? 'ইউজারনেম' : 'Username'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / ইউজারনেম"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-teal-600 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password / পাসওয়ার্ড"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-teal-600 font-mono text-sm"
              />
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
            </label>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`flex-1 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  language === 'bn' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#00796b] hover:bg-[#005f56] text-white font-bold rounded-lg text-sm transition-all shadow-md active:scale-98 cursor-pointer mt-2"
          >
            {language === 'bn' ? 'Login / লগইন' : 'Login / লগইন'}
          </button>
        </form>

        {/* Quick Credentials Chips (as provided in prompt) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-semibold block text-center uppercase tracking-wider">
            Quick Fill Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleFillCredentials('master', 'master123')}
              className="p-2 border border-slate-200 hover:border-teal-500 rounded-lg text-left bg-slate-50 hover:bg-teal-50 transition-colors"
            >
              <strong className="block text-slate-900 font-semibold">Master Admin</strong>
              <span className="font-mono text-slate-500">master / master123</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('owner', 'owner123')}
              className="p-2 border border-slate-200 hover:border-teal-500 rounded-lg text-left bg-slate-50 hover:bg-teal-50 transition-colors"
            >
              <strong className="block text-slate-900 font-semibold">Owner Admin</strong>
              <span className="font-mono text-slate-500">owner / owner123</span>
            </button>
          </div>
        </div>

        {/* Fresh System Opening Balance status */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-700">
            <span>{isFresh ? 'Fresh System' : 'Demonstration Farm'}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-teal-800">
              Opening Balance: {isFresh ? '৳ 0.00' : '৳ 1,000,000'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1 text-[11px]">
            <button
              type="button"
              onClick={resetToFreshSystem}
              className={`hover:underline ${isFresh ? 'font-bold text-teal-700' : 'text-slate-500'}`}
            >
              Initialize ৳0 Balance
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={loadDemoData}
              className={`hover:underline ${!isFresh ? 'font-bold text-teal-700' : 'text-slate-500'}`}
            >
              Load Demo Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
