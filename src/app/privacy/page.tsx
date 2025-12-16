'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 mb-8">Last updated: December 14, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We collect information you provide directly when creating an account, including your email 
                address, name, and profile information from your authentication provider. We also collect 
                habit data, completion records, and usage analytics to provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Your information is used to provide, maintain, and improve FocusFlow services. This includes 
                tracking your habits, generating analytics and insights, sending notifications, and 
                communicating about updates. We never sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Data Storage</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Your data is stored securely using industry-standard encryption. We use trusted cloud 
                infrastructure providers and implement regular security audits. Authentication is handled 
                by Clerk, a SOC 2 compliant authentication provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Data Sharing</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information. We may share data only with 
                service providers who assist in operating our application, when required by law, or with 
                your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                You have the right to access, update, or delete your personal information at any time. 
                You can export your habit data or request account deletion through the Settings page. 
                We will respond to your requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Cookies</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We use essential cookies to maintain your session and preferences. We may use analytics 
                cookies to understand how you use FocusFlow. You can control cookie settings through your 
                browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us 
                at <a href="mailto:privacy@focusflow.app" className="text-white hover:underline">privacy@focusflow.app</a>.
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
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
