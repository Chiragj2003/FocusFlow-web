'use client'

import Link from 'next/link'
import { ArrowLeft, Trash2, ShieldAlert, CheckCircle2, Mail, ExternalLink } from 'lucide-react'
import { FlameMark } from '@/components/ui/FlameMark'

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="border-b border-[#232328] bg-[#0e0e11]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <FlameMark size={28} />
            <span className="font-black text-lg text-white tracking-tight">
              Focus<span className="text-orange-500">Flow</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-[#131316] rounded-3xl border border-[#232328] p-8 md:p-12 shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              User Data Control
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Request Account & Data Deletion
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2">
              Google Play Data Safety Compliant • Full User Data Erasure Instructions
            </p>
          </div>

          <div className="h-px bg-[#232328]" />

          {/* Intro Card */}
          <div className="bg-red-500/5 rounded-2xl border border-red-500/25 p-5 md:p-6 space-y-3">
            <h2 className="text-base font-bold text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Permanent Erasure Guarantee
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              In accordance with Google Play Store Developer Guidelines and global privacy laws (GDPR, CCPA), you can delete your FocusFlow account and all associated habit tracking history at any time. Deletion is irreversible.
            </p>
          </div>

          {/* Two Ways to Delete */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">How to Delete Your Account</h2>

            {/* Option 1: In App */}
            <div className="bg-[#18181d] rounded-2xl border border-[#232328] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                  Method 1 (Instant)
                </span>
                <span className="text-xs text-zinc-400 font-medium">Inside FocusFlow Mobile or Web</span>
              </div>
              <h3 className="text-base font-bold text-white">Self-Service In-App Deletion</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-300">
                <li>Log in to FocusFlow on mobile or website.</li>
                <li>Navigate to <strong className="text-white">Settings</strong> from the bottom navigation or sidebar.</li>
                <li>Scroll down to the <strong className="text-white">Account Management</strong> section.</li>
                <li>Click on <strong className="text-red-400">Delete Account</strong>.</li>
                <li>Type <code className="bg-black/50 text-red-400 px-1.5 py-0.5 rounded font-mono text-xs">delete my account</code> in the confirmation prompt.</li>
                <li>Click the red confirmation button. Your account and all stored habit records are purged immediately.</li>
              </ol>

              <div className="pt-2">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 bg-[#232328] hover:bg-[#2c2c33] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Go to In-App Settings <ExternalLink size={14} />
                </Link>
              </div>
            </div>

            {/* Option 2: Web Request via Email */}
            <div className="bg-[#18181d] rounded-2xl border border-[#232328] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                  Method 2 (Web / Email Request)
                </span>
                <span className="text-xs text-zinc-400 font-medium">Without opening the app</span>
              </div>
              <h3 className="text-base font-bold text-white">Submit Deletion Request via Email</h3>
              <p className="text-sm text-zinc-300">
                If you have uninstalled the app or cannot log in, email our support desk directly from your registered email address:
              </p>
              <div className="bg-[#131316] p-4 rounded-xl border border-[#232328] space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>Send to: <strong className="text-white font-mono">support@focusflow.app</strong></span>
                </div>
                <p className="text-zinc-400">
                  Subject: <span className="text-white font-mono text-xs">Account Deletion Request - [Your Registered Email]</span>
                </p>
                <p className="text-zinc-400">
                  Body: <span className="text-zinc-300 italic">“Please permanently delete my FocusFlow account and all associated data.”</span>
                </p>
              </div>
              <p className="text-xs text-zinc-400">
                Email requests are processed within 7 business days, and you will receive a confirmation once deletion is complete.
              </p>
            </div>
          </div>

          {/* What Data is Deleted */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">What Data is Deleted?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'User Profile & Authentication Data (Name, Email, Clerk ID)',
                'All Habits, Categories, and Custom Goal Definitions',
                'All Daily Check-in & Habit Completion Logs',
                'Focus Timer Session History and Duration Logs',
                'Streak Records, Longest Streaks, and Milestone History',
                'Unlocked Badges, 3D Medals, and Challenge Progress',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 bg-[#18181d] p-3 rounded-xl border border-[#232328]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Period */}
          <div className="space-y-2 text-sm text-zinc-400">
            <h3 className="font-bold text-white text-base">Data Retention & Backup Policy</h3>
            <p>
              Once account deletion is triggered, your data is immediately disconnected and removed from active production databases. Any residual database backup snapshots are automatically purged within 30 calendar days in compliance with industry security protocols.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232328] py-8 mt-12 bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-zinc-500 space-y-2">
          <div className="flex justify-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/child-safety" className="hover:text-white transition-colors">Child Safety</Link>
            <Link href="/account-deletion" className="text-orange-400 font-semibold">Delete Account</Link>
          </div>
          <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
