// ==================== ORIGINAL CODE START ====================
// 'use client'
// 
// import Link from 'next/link'
// import { ArrowLeft, Sparkles } from 'lucide-react'
// 
// export default function TermsOfServicePage() {
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
//           <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
//           <p className="text-zinc-500 mb-8">Last updated: December 14, 2025</p>
// 
//           <div className="space-y-8">
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 By accessing and using FocusFlow, you accept and agree to be bound by these Terms of Service. 
//                 If you do not agree to these terms, please do not use our service. We may modify these terms 
//                 at any time, and continued use constitutes acceptance of modified terms.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 FocusFlow is a habit tracking application that allows users to create, track, and analyze 
//                 their daily habits. Features include habit management, progress tracking, analytics, 
//                 streaks, and data export capabilities. We reserve the right to modify or discontinue 
//                 features at any time.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 You must create an account to use FocusFlow. You are responsible for maintaining the 
//                 confidentiality of your account credentials and for all activities under your account. 
//                 You must provide accurate information and promptly update any changes.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">4. Acceptable Use</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 You agree not to misuse FocusFlow or help anyone else do so. This includes attempting to 
//                 access unauthorized areas, interfering with the service, or using it for unlawful purposes. 
//                 We reserve the right to suspend or terminate accounts that violate these terms.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">5. User Content</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 You retain ownership of any content you create through FocusFlow, including habits and notes. 
//                 By using our service, you grant us a limited license to use this content solely to provide 
//                 and improve our services. You are responsible for ensuring your content does not violate 
//                 any laws or third-party rights.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 FocusFlow and its original content, features, and functionality are owned by FocusFlow and 
//                 are protected by international copyright, trademark, and other intellectual property laws. 
//                 You may not copy, modify, or distribute our content without permission.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 FocusFlow is provided &quot;as is&quot; without warranties of any kind. We shall not be liable for 
//                 any indirect, incidental, or consequential damages arising from your use of the service. 
//                 Our liability is limited to the amount you paid for the service in the past 12 months.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">8. Termination</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 We may terminate or suspend your account at any time, without prior notice, for conduct 
//                 that we believe violates these terms or is harmful to other users, us, or third parties. 
//                 You may also delete your account at any time through the Settings page.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">9. Governing Law</h2>
//               <p className="text-zinc-400 leading-relaxed mb-4">
//                 These terms shall be governed by and construed in accordance with applicable laws, 
//                 without regard to its conflict of law provisions. Any disputes shall be resolved in 
//                 the appropriate courts.
//               </p>
//             </section>
// 
//             <section>
//               <h2 className="text-xl font-bold text-white mb-4">10. Contact</h2>
//               <p className="text-zinc-400 leading-relaxed">
//                 If you have questions about these Terms of Service, please contact us 
//                 at <a href="mailto:support@focusflow.app" className="text-white hover:underline">support@focusflow.app</a>.
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
import { ArrowLeft, FileText } from 'lucide-react'
import { FlameMark } from '@/components/ui/FlameMark'

export default function TermsOfServicePage() {
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
              <FileText className="w-3.5 h-3.5" />
              Legal & User Agreement
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2">
              Last updated: November 16, 2026 • Effective for all FocusFlow mobile app and website users
            </p>
          </div>

          <div className="h-px bg-[#232328]" />

          <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
              <p className="text-zinc-400">
                By downloading, accessing, or using the FocusFlow mobile application or web app, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, please discontinue use immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
              <p className="text-zinc-400">
                FocusFlow provides digital habit tracking, focus timer with ambient soundscapes, personal streaks, milestone recognition, and analytical productivity charts. We continuously improve our features and may update or add new functionality at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. User Accounts & Security</h2>
              <p className="text-zinc-400">
                You are responsible for safeguarding your login credentials and for any activity under your account. You agree to provide truthful registration information and notify us immediately of any unauthorized account access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. User Content & Ownership</h2>
              <p className="text-zinc-400">
                You retain complete ownership over all habits, completion logs, notes, and milestones you record on FocusFlow. We process your data strictly to deliver your personalized tracker experience as described in our Privacy Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Intellectual Property</h2>
              <p className="text-zinc-400">
                The FocusFlow brand, FlameMark, Sparky mascot illustrations, 3D medals, sound designs, UI animations, and code are the exclusive intellectual property of FocusFlow and protected by international copyright laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Termination & Deletion</h2>
              <p className="text-zinc-400">
                You can terminate your account at any time via Settings &gt; Account Management or via our{' '}
                <Link href="/account-deletion" className="text-orange-400 font-semibold hover:underline">
                  Account Deletion Page
                </Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">7. Support & Contact</h2>
              <p className="text-zinc-400">
                For questions regarding these Terms, contact our team at{' '}
                <a href="mailto:support@focusflow.app" className="text-orange-400 font-semibold hover:underline">
                  support@focusflow.app
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232328] py-8 mt-12 bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-zinc-500 space-y-2">
          <div className="flex justify-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-orange-400 font-semibold">Terms of Service</Link>
            <Link href="/child-safety" className="hover:text-white transition-colors">Child Safety</Link>
            <Link href="/account-deletion" className="hover:text-white transition-colors">Delete Account</Link>
          </div>
          <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
