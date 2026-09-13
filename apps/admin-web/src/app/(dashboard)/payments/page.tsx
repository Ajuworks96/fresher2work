'use client';

import { useEffect, useState } from 'react';
import { PaymentRecord, PaymentStatus } from '@fresher2work/types';
import { adminApi } from '@/lib/api';
import {
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdminPayments();
      setPayments(res.payments || []);
    } catch (err) {
      console.warn('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const candidateName = (p as any).studentProfile?.fullName || '';
    const studentEmail = (p as any).studentProfile?.user?.email || '';
    return (
      p.gatewayOrderId.toLowerCase().includes(q) ||
      (p.gatewayPaymentId && p.gatewayPaymentId.toLowerCase().includes(q)) ||
      candidateName.toLowerCase().includes(q) ||
      studentEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">₹99 Student Activation Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically verified audit trail of student candidate profile activations and Razorpay transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID, payment ID, candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-64 shadow-2xs"
            />
          </div>
          <button
            onClick={loadPayments}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Querying payment transaction ledger from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Activation Payments Recorded Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {search
              ? 'No transaction matches your search filter.'
              : 'All dummy records were purged. Real transactions completed via Razorpay in the Flutter app will be recorded here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <tr>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Razorpay Order ID</th>
                <th className="px-6 py-3.5">Gateway Payment ID</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Gateway Status</th>
                <th className="px-6 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const candidate = (p as any).studentProfile;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {candidate?.fullName || 'Candidate'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {p.gatewayOrderId}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-emerald-600 font-semibold">
                      {p.gatewayPaymentId || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                      ₹{((p.amountPaise || 9900) / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          p.status === PaymentStatus.SUCCESS
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.status === PaymentStatus.FAILED
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === PaymentStatus.SUCCESS ? 'bg-emerald-500' : 'bg-amber-400'
                        }`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
