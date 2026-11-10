'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CandidateActivationPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !fullName) {
      setErrorMessage('Please enter your full name and registered email address.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/v1/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 499,
          notes: {
            candidateName: fullName,
            email,
            phone,
            source: 'web_activation_portal',
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId || 'rzp_live_TyRvY8wYW9958F',
        amount: orderData.amountPaise || 49900,
        currency: 'INR',
        name: 'Fresher2Work',
        description: 'Candidate Lifetime Discovery Pass (₹499)',
        image: '/brand/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: fullName,
          email: email,
          contact: phone || '',
        },
        theme: {
          color: '#1f357c',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/v1/payment/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id || orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                candidateName: fullName,
                email: email,
                phone: phone,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
            } else {
              setErrorMessage('Payment captured but verification failed. Please contact support.');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Error verifying transaction.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (failRes: any) {
        setErrorMessage(failRes.error?.description || 'Payment was unsuccessful.');
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to payment gateway.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-[#4ad1c7] selection:text-slate-950">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/brand/logo.png" alt="Fresher2Work" className="h-9 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {success ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-white">Discovery Pass Activated!</h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Congratulations <strong>{fullName}</strong>! Your Discovery Pass is now live. Your verified Talent Passport has been unlocked for top tech recruiters across India.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400 text-left space-y-1.5">
              <p><strong className="text-white">Registered Email:</strong> {email}</p>
              <p><strong className="text-white">Pass Type:</strong> Candidate Lifetime Discovery Pass (₹499)</p>
              <p><strong className="text-white">Status:</strong> <span className="text-emerald-400 font-bold">VERIFIED & ACTIVE</span></p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/u/${email.split('@')[0]}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                View My Talent Passport <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/Fresher2Work.apk"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                Open Candidate App
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-400 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Official Candidate Activation Portal
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
                Unlock Your Candidate <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">Discovery Pass</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Fresher2Work connects real freshers directly with hiring companies. Activating your pass places your verified proof-of-work in front of active tech recruiters.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Verified Recruiter Direct Contact</h3>
                    <p className="mt-1 text-xs text-slate-400">Recruiters unlock and contact you directly via WhatsApp and official email without spam filters.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Public Shareable Talent Passport</h3>
                    <p className="mt-1 text-xs text-slate-400">Personalized <span className="font-mono text-blue-300">fresher2work.com/u/yourname</span> link with WhatsApp live preview cards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">One-Time Fee • Zero Commissions</h3>
                    <p className="mt-1 text-xs text-slate-400">No monthly subscriptions or salary cuts. Pay ₹499 once for lifetime talent pool discovery.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Form */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Lifetime Pass</span>
                  <div className="text-3xl font-black text-white mt-0.5">₹499 <span className="text-xs font-normal text-slate-400">incl. GST</span></div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  Instant Activation
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleStartPayment} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun P"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300">Registered Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">Must match the email used in your candidate app account.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#1f357c] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? (
                    'Connecting to Razorpay…'
                  ) : (
                    <>
                      Pay ₹499 via Razorpay <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 border-t border-slate-800/80 pt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>256-bit SSL Encrypted • Powered by Razorpay</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-slate-500">
                  <span>UPI (GPay / PhonePe / Paytm)</span>
                  <span>•</span>
                  <span>Credit / Debit Cards</span>
                  <span>•</span>
                  <span>NetBanking</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

