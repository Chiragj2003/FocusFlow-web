'use client'

import Link from 'next/link'
import { ArrowLeft, ShieldCheck, HeartHandshake, Lock, Mail, Users } from 'lucide-react'
import { FlameMark } from '@/components/ui/FlameMark'

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top Navigation */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety & Compliance
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Child Safety & Family Protection Policy
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2">
              Last updated: November 16, 2026 • Compliant with Google Play Families Policy & COPPA Standards
            </p>
          </div>

          <div className="h-px bg-[#232328]" />

          {/* Core Highlights */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Age Requirement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                FocusFlow is designed for general audiences aged 13 and above (or 16+ in the European Economic Area).
              </p>
            </div>

            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Zero Data Selling</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We never sell, rent, or trade personal data or behavioral profiles of any users, regardless of age.
              </p>
            </div>

            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">No Social Chat</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No open chatrooms, direct messaging, or public forums exist in FocusFlow, eliminating online contact risks.
              </p>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                1. Target Audience & Age Restrictions
              </h2>
              <p className="text-zinc-400">
                FocusFlow is a personal productivity, habit formation, and focus timer utility designed for teenagers and adults. We do not knowingly solicit, collect, or process personal data from children under 13 years of age (or under 16 years in applicable EU jurisdictions).
              </p>
              <p className="text-zinc-400">
                If an account is created by someone under the minimum age without parental consent, we will promptly delete the account and all associated habit and profile information upon notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                2. Parental Rights & Information Deletion
              </h2>
              <p className="text-zinc-400">
                Parents and legal guardians have the full legal right under COPPA and international child safety laws to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-zinc-400 text-sm">
                <li>Review any personal information collected from their child.</li>
                <li>Direct us to immediately delete their child’s personal information.</li>
                <li>Refuse to allow any further collection or use of the child’s data.</li>
              </ul>
              <p className="text-zinc-400 mt-2">
                To submit a parental request, please email our dedicated privacy team at{' '}
                <a href="mailto:privacy@focusflow.app" className="text-orange-400 hover:underline font-semibold">
                  privacy@focusflow.app
                </a>{' '}
                with the subject line “COPPA / Parental Deletion Request”. We verify and process all parental requests within 48 business hours.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                3. Content & Experience Safety
              </h2>
              <p className="text-zinc-400">
                FocusFlow is built as a mindful, respectful self-improvement application. To guarantee a secure digital environment:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-zinc-400 text-sm">
                <li><strong className="text-white">Zero Third-Party Advertising:</strong> We do not run third-party advertising networks, interest-based tracking, or ad trackers.</li>
                <li><strong className="text-white">Private Habit Records:</strong> Habit descriptions, completion dates, and focus session notes are completely private to the account holder.</li>
                <li><strong className="text-white">Child-Friendly Aesthetic:</strong> All mascot illustrations (Sparky), icons, and milestone animations follow wholesome, uplifting creative guidelines suitable for all ages.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                4. Contact Our Safety Team
              </h2>
              <p className="text-zinc-400">
                For questions regarding child safety, COPPA compliance, or family protection policies on the Google Play Store, please reach out to:
              </p>
              <div className="bg-[#18181d] p-4 rounded-xl border border-[#232328] flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400 shrink-0" />
                <span className="text-zinc-300 font-mono text-sm">privacy@focusflow.app</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232328] py-8 mt-12 bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-zinc-500 space-y-2">
          <div className="flex justify-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/child-safety" className="text-orange-400 font-semibold">Child Safety</Link>
            <Link href="/account-deletion" className="hover:text-white transition-colors">Delete Account</Link>
          </div>
          <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
