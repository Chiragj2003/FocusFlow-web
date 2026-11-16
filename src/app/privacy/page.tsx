// ==================== ORIGINAL CODE START ====================
// 'use client'
// 
// import Link from 'next/link'
// import { ArrowLeft, Sparkles } from 'lucide-react'
// 
// export default function PrivacyPolicyPage() {
//   return (
//     <div className="min-h-screen bg-zinc-950">
//       {/* Header */}
//       <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <Link 
//             href="/" 
//             className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
//           >
//             <ArrowLeft size={18} />
//             Back to Home
//           </Link>
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
//               <Sparkles className="w-4 h-4 text-zinc-900" />
//             </div>
//             <span className="font-bold text-white">FocusFlow</span>
//           </Link>
//         </div>
//       </header>
// 
//       {/* Content */}
//       <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
//         <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm p-8 md:p-12">
//           <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
//           <p className="text-zinc-500 mb-8">Last updated: December 14, 2025</p>
// 
//           <div className="space-y-8">
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 We collect information you provide directly when creating an account, including your email 
//                 address, name, and profile information from your authentication provider. We also collect 
//                 habit data, completion records, and usage analytics to provide our services.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 Your information is used to provide, maintain, and improve FocusFlow services. This includes 
//                 tracking your habits, generating analytics and insights, sending notifications, and 
//                 communicating about updates. We never sell your personal data.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">3. Data Storage</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 Your data is stored securely using industry-standard encryption. We use trusted cloud 
//                 infrastructure providers and implement regular security audits. Authentication is handled 
//                 by Clerk, a SOC 2 compliant authentication provider.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">4. Data Sharing</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 We do not sell, trade, or rent your personal information. We may share data only with 
//                 service providers who assist in operating our application, when required by law, or with 
//                 your explicit consent.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 You have the right to access, update, or delete your personal information at any time. 
//                 You can export your habit data or request account deletion through the Settings page. 
//                 We will respond to your requests within 30 days.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">6. Cookies</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 We use essential cookies to maintain your session and preferences. We may use analytics 
//                 cookies to understand how you use FocusFlow. You can control cookie settings through your 
//                 browser preferences.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
//               <p className="text-zinc-400 leading-relaxed">
//                 If you have questions about this Privacy Policy or our data practices, please contact us 
//                 at <a href="mailto:privacy@focusflow.app" className="text-white hover:underline">privacy@focusflow.app</a>.
//               </p>
//             </section>
//           </div>
//         </div>
//       </main>
// 
//       {/* Footer */}
//       <footer className="border-t border-zinc-800/50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-sm text-zinc-500">
//           <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }
// ==================== ORIGINAL CODE END ==================== */

'use client'

import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, Database, Trash2, Mail } from 'lucide-react'
import { FlameMark } from '@/components/ui/FlameMark'

export default function PrivacyPolicyPage() {
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="bg-[#131316] rounded-3xl border border-[#232328] p-8 md:p-12 shadow-2xl space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy & Data Safety
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2">
              Last updated: November 16, 2026 • Fully compliant with Google Play Data Safety & GDPR/CCPA standards
            </p>
          </div>

          <div className="h-px bg-[#232328]" />

          {/* Quick Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Encrypted in Transit</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All communications and user data are encrypted with modern TLS/HTTPS and AES-256 at rest.
              </p>
            </div>

            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Zero Data Selling</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We never monetize your habits or sell user data to advertising or tracking brokers.
              </p>
            </div>

            <div className="bg-[#18181d] p-5 rounded-2xl border border-[#232328] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Right to Erasure</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Delete your account and all habit tracking records at any time with 1 click.
              </p>
            </div>
          </div>

          <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
              <p className="text-zinc-400">
                FocusFlow collects information necessary to deliver habit tracking and productivity insights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-400 text-sm">
                <li><strong className="text-white">Account Information:</strong> Name, email address, and authentication tokens provided via Clerk (SOC 2 Type II certified).</li>
                <li><strong className="text-white">Habit & Productivity Data:</strong> Custom habits, daily check-ins, focus session durations, streak calculations, and earned badge progress.</li>
                <li><strong className="text-white">Device Information:</strong> Operating system version, app version, and timezone to calculate streaks accurately across day boundaries.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
              <p className="text-zinc-400">
                We strictly use your information to operate FocusFlow:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-zinc-400 text-sm">
                <li>Calculate and render your personal streak flames, completion rates, and weekly analytics.</li>
                <li>Track challenge participation and reward completion medals.</li>
                <li>Trigger local daily reminder notifications scheduled on your device.</li>
                <li>Provide user support and address technical inquiries.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Third-Party Service Providers</h2>
              <p className="text-zinc-400">
                We work only with vetted, enterprise-grade cloud service providers that adhere to rigorous data protection agreements:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-zinc-400 text-sm">
                <li><strong className="text-white">Clerk Inc.:</strong> User authentication and identity security.</li>
                <li><strong className="text-white">Supabase (PostgreSQL):</strong> Encrypted cloud database infrastructure.</li>
                <li><strong className="text-white">Vercel:</strong> Secure global web hosting and API edge routing.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Children’s Privacy (COPPA & Google Play Families)</h2>
              <p className="text-zinc-400">
                FocusFlow does not knowingly collect personal identifiable information from children under 13 years old (or under 16 in the European Union). For full details and parental deletion instructions, please review our dedicated{' '}
                <Link href="/child-safety" className="text-orange-400 font-semibold hover:underline">
                  Child Safety & Family Protection Policy
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Data Retention & Account Deletion</h2>
              <p className="text-zinc-400">
                You retain complete ownership over your data. You may delete your account and all associated habit tracking history at any time from inside the app (Settings &gt; Account Management &gt; Delete Account) or by submitting a web request on our{' '}
                <Link href="/account-deletion" className="text-orange-400 font-semibold hover:underline">
                  Account Deletion Page
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Contact Our Privacy Officer</h2>
              <p className="text-zinc-400">
                If you have questions or requests regarding your personal data or this Privacy Policy, please contact us:
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
            <Link href="/privacy" className="text-orange-400 font-semibold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/child-safety" className="hover:text-white transition-colors">Child Safety</Link>
            <Link href="/account-deletion" className="hover:text-white transition-colors">Delete Account</Link>
          </div>
          <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
