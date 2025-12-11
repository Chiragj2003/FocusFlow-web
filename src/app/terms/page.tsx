'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 11, 2025</p>

          <div className="space-y-8 text-card-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using FocusFlow (&quot;Service&quot;), you agree to be bound by these Terms of Service 
                (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service. 
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                FocusFlow is a habit tracking application that allows users to create, track, and analyze 
                personal habits. The Service includes features for habit management, progress tracking, 
                streak monitoring, data visualization, and data export capabilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1 Account Creation</h3>
              <p className="text-muted-foreground leading-relaxed">
                To use FocusFlow, you must create an account. You agree to provide accurate, current, and 
                complete information during registration and to update such information to keep it accurate, 
                current, and complete.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2 Account Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for safeguarding your account credentials and for any activities or 
                actions under your account. You must notify us immediately of any unauthorized access or 
                security breach.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.3 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may deactivate or delete your account at any time through the Settings page. We reserve 
                the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any unlawful purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to other users&apos; accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Use automated systems or bots to access the Service</li>
                <li>Scrape, copy, or harvest data from the Service</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm others through the Service</li>
                <li>Use the Service to send spam or unsolicited communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. User Content</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.1 Ownership</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all content you create within FocusFlow, including habit names, 
                descriptions, and associated data. We claim no intellectual property rights over your content.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.2 License</h3>
              <p className="text-muted-foreground leading-relaxed">
                By using FocusFlow, you grant us a limited license to store, process, and display your 
                content solely for the purpose of providing the Service to you.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">5.3 Content Responsibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are solely responsible for your content. Do not include sensitive personal information, 
                passwords, or confidential data in habit names or descriptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content (excluding user content), features, and functionality 
                are and will remain the exclusive property of FocusFlow and its licensors. The Service is 
                protected by copyright, trademark, and other laws. Our trademarks and trade dress may not 
                be used in connection with any product or service without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Implied warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security or freedom from viruses</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not warrant that the Service will meet your requirements or achieve any particular results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL FOCUSFLOW, ITS DIRECTORS, 
                EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Your access to or use of (or inability to access or use) the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your content</li>
                <li>Any bugs, viruses, or other harmful code transmitted through the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless FocusFlow and its licensors, employees, 
                contractors, agents, officers, and directors from and against any and all claims, damages, 
                obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including intellectual property rights</li>
                <li>Any claim that your content caused damage to a third party</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. Service Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
                at any time, with or without notice. We shall not be liable to you or any third party for 
                any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">11. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service may contain links to or integrate with third-party websites or services that 
                are not owned or controlled by FocusFlow. We have no control over and assume no responsibility 
                for the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with applicable laws, without 
                regard to conflict of law provisions. Our failure to enforce any right or provision of 
                these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">13. Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising out of or relating to these Terms or the Service shall first be 
                attempted to be resolved through good-faith negotiation. If negotiation fails, disputes 
                may be resolved through binding arbitration or in the courts of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">14. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions will remain in full force and effect. The invalid or unenforceable provision 
                will be modified to reflect the parties&apos; original intent as closely as possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">15. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with the Privacy Policy, constitute the entire agreement between 
                you and FocusFlow regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">16. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes 
                a material change will be determined at our sole discretion. By continuing to access or use 
                the Service after revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">17. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2 mt-4">
                <li>📧 Email: legal@focusflow.app</li>
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
