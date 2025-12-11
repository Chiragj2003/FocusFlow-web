'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 11, 2025</p>

          <div className="space-y-8 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to FocusFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
                and personal information. This Privacy Policy explains how we collect, use, disclose, and 
                safeguard your information when you use our habit tracking application and related services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email address</li>
                <li>Name (first and last)</li>
                <li>Profile picture (optional, via authentication provider)</li>
                <li>Timezone preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We automatically collect certain information when you use FocusFlow:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Habit names, descriptions, and categories you create</li>
                <li>Habit completion data and timestamps</li>
                <li>Streak information and progress metrics</li>
                <li>Device information and browser type</li>
                <li>IP address and general location (country/region)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide, operate, and maintain FocusFlow services</li>
                <li>Track and display your habits, streaks, and progress</li>
                <li>Generate personalized insights and analytics</li>
                <li>Send you notifications and reminders (with your consent)</li>
                <li>Improve and optimize our application</li>
                <li>Communicate with you about updates and new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your data is stored securely using industry-standard practices:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Data is encrypted in transit using TLS/SSL</li>
                <li>Database is hosted on secure cloud infrastructure</li>
                <li>Authentication is handled by Clerk, a trusted third-party provider</li>
                <li>We regularly backup data to prevent loss</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your data only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third parties who help us operate our services (e.g., hosting providers, authentication services)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                <li><strong>Safety:</strong> To protect the rights, property, or safety of FocusFlow, our users, or others</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FocusFlow uses the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Clerk:</strong> For user authentication and account management</li>
                <li><strong>Vercel:</strong> For hosting and infrastructure</li>
                <li><strong>Neon/PostgreSQL:</strong> For database storage</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Each of these services has their own privacy policies that govern their use of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Delete your account and all associated data</li>
                <li><strong>Export:</strong> Download your data in a portable format (CSV/PDF)</li>
                <li><strong>Deactivation:</strong> Temporarily deactivate your account</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, visit your Settings page or contact us at privacy@focusflow.app
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                FocusFlow uses essential cookies for authentication and session management. We do not use 
                tracking cookies for advertising purposes. You can control cookie settings through your 
                browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                FocusFlow is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information 
                from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data in accordance with 
                applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">11. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data for as long as your account is active or as needed to provide 
                services. Upon account deletion, we will delete or anonymize your data within 30 days, 
                except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. 
                Your continued use of FocusFlow after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2 mt-4">
                <li>📧 Email: privacy@focusflow.app</li>
                <li>🌐 Website: focusflow.app</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
