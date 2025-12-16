'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-zinc-900" />
            </div>
            <span className="font-bold text-white">FocusFlow</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm p-8 md:p-12">
          <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-zinc-500 mb-8">Last updated: December 14, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                By accessing and using FocusFlow, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service. We may modify these terms 
                at any time, and continued use constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                FocusFlow is a habit tracking application that allows users to create, track, and analyze 
                their daily habits. Features include habit management, progress tracking, analytics, 
                streaks, and data export capabilities. We reserve the right to modify or discontinue 
                features at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You must create an account to use FocusFlow. You are responsible for maintaining the 
                confidentiality of your account credentials and for all activities under your account. 
                You must provide accurate information and promptly update any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Acceptable Use</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You agree not to misuse FocusFlow or help anyone else do so. This includes attempting to 
                access unauthorized areas, interfering with the service, or using it for unlawful purposes. 
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. User Content</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You retain ownership of any content you create through FocusFlow, including habits and notes. 
                By using our service, you grant us a limited license to use this content solely to provide 
                and improve our services. You are responsible for ensuring your content does not violate 
                any laws or third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                FocusFlow and its original content, features, and functionality are owned by FocusFlow and 
                are protected by international copyright, trademark, and other intellectual property laws. 
                You may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                FocusFlow is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for 
                any indirect, incidental, or consequential damages arising from your use of the service. 
                Our liability is limited to the amount you paid for the service in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Termination</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You may terminate your account at any time through the Settings page. We may suspend or 
                terminate your access for violations of these terms. Upon termination, your right to use 
                the service ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                If you have questions about these Terms of Service, please contact us 
                at <a href="mailto:support@focusflow.app" className="text-white hover:underline">support@focusflow.app</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} FocusFlow</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
